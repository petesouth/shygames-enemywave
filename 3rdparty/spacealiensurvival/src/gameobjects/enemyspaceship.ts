import Phaser from 'phaser';
import { BaseSpaceship, SpaceShipType } from './basespaceship';
import { Bullet } from './bullet';
import { Missile } from './missile';
import { BaseExplodable, BaseExplodableState } from './baseExplodable';
import { PlayerSpaceship } from './playerspaceship';
import { ForceField } from './forcefield';
import gGameStore from '../store/store';
import { gameActions } from '../store/gamestore';



export class EnemySpaceship extends BaseSpaceship {


    private playerSpaceship: BaseSpaceship;
    public isBoss: boolean = false;


    constructor(scene: Phaser.Scene, distanceFromLeftCorner: number, playerSpaceship: BaseSpaceship, bossmode = false) {
        super(scene, SpaceShipType.IMAGE, (bossmode !== true) ? "enemyspaceship" : "bossenemyspaceship",
            distanceFromLeftCorner,
            (bossmode == true) ? 0x006400 : 0xFF0000);


        this.isBoss = bossmode;
        this.playerSpaceship = playerSpaceship;
        this.shieldKey = undefined;
        this.fireKey = undefined;
        this.missileKey = undefined;
        this.mineKey = undefined;
        this.upKey = undefined;
        this.explosionColors = [0xFF0000, 0xffa500];
        this.fireRate = 1200;
        this.missileFireRate = 5000;
        this.maxPopSize = 60;

        if (bossmode === true) {
            this.explosionColors = [0x006400, 0xffa500];
            this.fireRate = 500;
            this.missileFireRate = 1000;
            this.hitpoints += 5; // 10 is default.  
        }
        this.maxPopSize = 60;
        this.baseSpaceshipDisplay?.spawn(this.initialPositionOffset);

    }

    public explode(): void {
        super.explode();

        if (this.isBoss) {
            // Boss counts as two ships.
            new Promise((resolve, reject) => {
                gGameStore.dispatch(gameActions.incrementPlayersScore({}));
                resolve(true);
            }).then((value) => {
                gGameStore.dispatch(gameActions.incrementPlayersScore({}));
            });

        } else {
            gGameStore.dispatch(gameActions.incrementPlayersScore({}));
        }
    }

    public calculateVelocity(): void {
        if (!this.baseSpaceshipDisplay) {
            return;
        }

        const centroid = this.getCentroid();
        const playerCentroid = this.playerSpaceship.getCentroid();

        // If the enemy is closer than 40 pixels to the player, reduce its speed
        const distanceToPlayer = Phaser.Math.Distance.Between(centroid.x, centroid.y, playerCentroid.x, playerCentroid.y);
        let effectiveThrust = this.thrust;
        const baseSpaceshipDisplayWidth: number = this.baseSpaceshipDisplay.getDistanceFromTopToBottom();

        if (distanceToPlayer < 80) { // Considering 80 because 40 pixels is the buffer, so we start slowing down when we are 80 pixels away
            effectiveThrust *= (baseSpaceshipDisplayWidth - 80) / 80;
        }

        const directionX = playerCentroid?.x - centroid.x;
        const directionY = playerCentroid?.y - centroid.y;
        const angle = Math.atan2(directionY, directionX);

        this.velocity.x += effectiveThrust * Math.cos(angle);
        this.velocity.y += effectiveThrust * Math.sin(angle);

        this.velocity.x *= this.damping;
        this.velocity.y *= this.damping;

        this.exhaustFlame.show();


    }

    public calculateRotation(): void {
        if (!this.baseSpaceshipDisplay) {
            return;
        }
    
        const playerCentroid = this.playerSpaceship.getCentroid();
        const centroid = this.getCentroid();
    
        // Calculate the angle from the enemy spaceship to the player
        const angleToPlayer = Math.atan2(playerCentroid.y - centroid.y, playerCentroid.x - centroid.x);
    
        // Get the current forward angle of the enemy spaceship
        const forwardAngle = this.baseSpaceshipDisplay.getForwardAngle();
    
        // Calculate the angle difference, ensuring it remains within the range [-π, π]
        let angleDifference = angleToPlayer - forwardAngle;
        while (angleDifference > Math.PI) angleDifference -= 2 * Math.PI;
        while (angleDifference < -Math.PI) angleDifference += 2 * Math.PI;
    
        // If the angle difference is significant (e.g., greater than a small threshold),
        // rotate the enemy spaceship to point more directly towards the player
        const rotationThreshold = 0.01;  // Adjust this value as needed
        if (Math.abs(angleDifference) > rotationThreshold) {
            this.baseSpaceshipDisplay.rotateAroundPoint(angleDifference);
        }
    }

    public handleBullets(spaceShips: BaseSpaceship[]) {
        if (!this.baseSpaceshipDisplay) {
            return;
        }
        const currentTime = this.scene.time.now;

        if ((currentTime - this.lastFired > this.fireRate) &&
            this.playerSpaceship?.state === BaseExplodableState.ALIVE) {
            this.shootBullets();
        }

        super.handleBullets(spaceShips);

    }


    public handleMissiles(spaceShips: BaseSpaceship[]) {
        if (!this.baseSpaceshipDisplay) {
            return;
        }

        const currentTime = this.scene.time.now;

        if ((currentTime - this.missileLastFired > this.missileFireRate) &&
            this.playerSpaceship?.state === BaseExplodableState.ALIVE) {

            this.shootMissile(this.playerSpaceship);
        }

        super.handleMissiles(spaceShips);
    }






}
