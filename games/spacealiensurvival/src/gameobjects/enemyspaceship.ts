import Phaser from 'phaser';
import { BaseSpaceship, SpaceShipType } from './basespaceship';
import gGameStore from '../store/store';
import { gameActions } from '../store/gamestore';
import { BaseExplodableState } from './baseExplodable';
import { SplashScreen } from '../scenes/SplashScreen';


export interface EnemySpaceshipConfig {
    thrust: number,
    fireRate: number,
    missileFireRate: number,
    hitpoints: number,
    imageKey: string
}


export class EnemySpaceship extends BaseSpaceship {
    private playerSpaceship: BaseSpaceship;
    private jetTime: number = Date.now();
    private jetOn: boolean = false;
    private jetOffTimeWait: number = 5000;
    private jetOnTimeWait: number = 700;
    private enemySpacshipConfig: EnemySpaceshipConfig = {
        thrust: .5,
        hitpoints: 10,
        fireRate: 1200,
        missileFireRate: 5000,
        imageKey: SplashScreen.enemySpaceships[0]
    }


    public speedMultiplier: number = 12;  // Add this property to your class

    constructor(scene: Phaser.Scene, distanceFromLeftCorner: number, playerSpaceship: BaseSpaceship, enemySpacshipConfig: EnemySpaceshipConfig) {
        super(scene, SpaceShipType.IMAGE, enemySpacshipConfig.imageKey, [ 0x040d61, 0xfacc22, 0xf89800, 0xf83600, 0x9f0404, 0x4b4a4f, 0x353438, 0x040404 ],
            distanceFromLeftCorner, 40);

        this.enemySpacshipConfig = enemySpacshipConfig;
        this.playerSpaceship = playerSpaceship;
        this.shieldKey = undefined;
        this.fireKey = undefined;
        this.missileKey = undefined;
        this.mineKey = undefined;
        this.upKey = undefined;
        this.fireRate = 1200;
        this.missileFireRate = 5000;
        this.explosionColors = [ 'red', 'yellow' ];
        this.maxPopSize = 60;
        this.baseSpaceshipDisplay?.spawn(this.initialPositionOffset);
        this.exhaustFlame.hide();

        this.enemySpacshipConfig = enemySpacshipConfig;
        this.thrust = this.enemySpacshipConfig.thrust;
        this.hitpoints = this.enemySpacshipConfig.hitpoints;
        this.fireRate = this.enemySpacshipConfig.fireRate;
        this.missileFireRate = this.enemySpacshipConfig.missileFireRate;
        

    }

    public explode(): void {
        super.explode();
        gGameStore.dispatch(gameActions.incrementPlayersScore({}));
    }


    public calculateVelocity(): void {
        if (!this.baseSpaceshipDisplay) {
            return;
        }


        let difference = Date.now() - this.jetTime;
        if (this.jetOn === false && difference > this.jetOnTimeWait) {
            console.log("difference", difference);
            this.playThrustSound();
            this.exhaustFlame.show();
            this.jetTime = Date.now();
            this.jetOn = true;
        } else if (this.jetOn === true && difference > this.jetOffTimeWait) {
            this.exhaustFlame.hide();
            this.stopThrustSound();
            this.jetTime = Date.now();
            this.jetOn = false;
        }

        const centroid = this.getCentroid();
        const playerCentroid = this.playerSpaceship.getCentroid();
        const angleToPlayer = Math.atan2(playerCentroid.y - centroid.y, playerCentroid.x - centroid.x);

        // Randomized Angle Adjustment
        const randomAngleOffset = Phaser.Math.Between(-15, 15) * (Math.PI / 180);  // +/- 15 degrees in radians
        const adjustedAngleToPlayer = angleToPlayer + randomAngleOffset;

        // Calculate the target point with some random offset for slop
        const randomOffset = Phaser.Math.Between(-50, 50);  // +/- 50 pixels
        const targetX = playerCentroid.x - (this.getObjectWidthHeight().width + randomOffset) * Math.cos(adjustedAngleToPlayer);
        const targetY = playerCentroid.y - (this.getObjectWidthHeight().width + randomOffset) * Math.sin(adjustedAngleToPlayer);

        const directionX = targetX - centroid.x;
        const directionY = targetY - centroid.y;
        const angle = Math.atan2(directionY, directionX);

        // Randomized Thrust
        const randomThrustOffset = Phaser.Math.FloatBetween(-0.1, 0.1) * this.thrust;
        const effectiveThrust = (this.jetOn === true) ? (this.thrust + randomThrustOffset) : 1;

        this.velocity.x += effectiveThrust * Math.cos(angle);
        this.velocity.y += effectiveThrust * Math.sin(angle);
        // Randomized Damping
        const randomDampingOffset = Phaser.Math.FloatBetween(-0.01, 0.01);
        const effectiveDamping = this.damping + randomDampingOffset;

        this.velocity.x *= effectiveDamping;
        this.velocity.y *= effectiveDamping;



        // Check the magnitude of the velocity vector
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

        if (speed > this.maxSpeed) {
            const scale = this.maxSpeed / speed;
            this.velocity.x *= scale;
            this.velocity.y *= scale;
        }



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
