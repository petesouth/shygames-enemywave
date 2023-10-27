import Phaser from 'phaser';
import { BaseSpaceship, SpaceShipType } from './basespaceship';
import gGameStore from '../store/store';
import { gameActions } from '../store/gamestore';
import { BaseExplodableState } from './baseExplodable';

export class EnemySpaceship extends BaseSpaceship {
    private playerSpaceship: BaseSpaceship;
    public isBoss: boolean = false;
    public speedMultiplier: number = 12;  // Add this property to your class

    constructor(scene: Phaser.Scene, distanceFromLeftCorner: number, playerSpaceship: BaseSpaceship, bossmode = false) {
        super(scene, SpaceShipType.IMAGE, (bossmode !== true) ? "enemyspaceship" : "bossenemyspaceship",
            distanceFromLeftCorner,
            (bossmode == true) ? 0x006400 : 0xFF0000);

        this.isBoss = bossmode;
        this.thrust = .5;
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
        const angleToPlayer = Math.atan2(playerCentroid.y - centroid.y, playerCentroid.x - centroid.x);

        // Randomized Angle Adjustment
        const randomAngleOffset = Phaser.Math.Between(-5, 5) * (Math.PI / 180);  // +/- 5 degrees in radians
        const adjustedAngleToPlayer = angleToPlayer + randomAngleOffset;

        // Calculate the target point 100 pixels away from the player, along the line from the enemy to the player
        const targetX = playerCentroid.x - this.getObjectWidthHeight().width * Math.cos(adjustedAngleToPlayer);
        const targetY = playerCentroid.y - this.getObjectWidthHeight().width * Math.sin(adjustedAngleToPlayer);

        const directionX = targetX - centroid.x;
        const directionY = targetY - centroid.y;
        const angle = Math.atan2(directionY, directionX);

        this.velocity.x += this.thrust * Math.cos(angle);
        this.velocity.y += this.thrust * Math.sin(angle);

        this.velocity.x *= this.damping;
        this.velocity.y *= this.damping;

        // Check the magnitude of the velocity vector
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

        // If the speed exceeds the maximum, scale back the velocity vector
        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }
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
        const rotationThreshold = .1;  // Adjust this value as needed
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
