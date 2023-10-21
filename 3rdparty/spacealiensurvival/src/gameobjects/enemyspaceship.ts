import Phaser from 'phaser';
import { BaseSpaceship } from './basespaceship';
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
        super(scene, distanceFromLeftCorner, (bossmode == true) ? 0x006400 : 0xFF0000);

        this.isBoss = bossmode;
        this.playerSpaceship = playerSpaceship;
        this.fireKey = undefined;
        this.missileKey = undefined;
        this.mineKey = undefined;
        this.maxPopSize = 40;
        this.explosionColors = [0xFF0000, 0xffa500];
        this.fireRate = 1200;
        this.missileFireRate = 5000;
        this.exhaustFlame.show();

        if (bossmode === true) {
            this.explosionColors = [0x006400, 0xffa500];
            this.fireRate = 500;
            this.missileFireRate = 1000;
            this.hitpoints += 5; // 10 is default.  
        }
    }

    public explode(): void {
        super.explode();

        if (this.isBoss) {
            // Boss counts as two ships.
            gGameStore.dispatch(gameActions.incrementPlayersScore({}));
            gGameStore.dispatch(gameActions.incrementPlayersScore({}));
        } else {
            gGameStore.dispatch(gameActions.incrementPlayersScore({}));
        }
    }

    public handleBullets(spaceShips: BaseSpaceship[]) {
        const currentTime = this.scene.time.now;

        if ((currentTime - this.lastFired > this.fireRate) &&
            this.playerSpaceship?.state === BaseExplodableState.ALIVE) {

            const centroid = this.baseSpaceshipDisplay.getCentroid();
            const angle = this.baseSpaceshipDisplay.getForwardAngle();
            const bullet = new Bullet(this.scene, centroid.x, centroid.y, angle);
            this.bullets.push(bullet);
            this.lastFired = currentTime;
            this.playBulletSound();

        }

        this.collisionCollectionTest(this.bullets, spaceShips);

    }


    public handleMissiles(spaceShips: BaseSpaceship[]) {
        const currentTime = this.scene.time.now;

        if ((currentTime - this.missileLastFired > this.missileFireRate) &&
            this.playerSpaceship?.state === BaseExplodableState.ALIVE) {

            const centroid = this.baseSpaceshipDisplay.getCentroid();
            const angle = this.baseSpaceshipDisplay.getForwardAngle();
            const missile = new Missile(this.scene, centroid.x, centroid.y, angle);
            missile.setTarget(spaceShips[Phaser.Math.Between(0, spaceShips.length - 1)]);
            this.missiles.push(missile);
            this.missileLastFired = currentTime;
            this.playMissileSound();

        }

        this.collisionCollectionTest(this.missiles, spaceShips);

    }


    public drawObjectAlive(): void {
        const centroid = this.getCentroid();
        const playerCentroid = this.playerSpaceship.getCentroid();
        const directionX = playerCentroid?.x - centroid.x;
        const directionY = playerCentroid?.y - centroid.y;
        const distanceToPlayer = Phaser.Math.Distance.Between(centroid.x, centroid.y, playerCentroid.x, playerCentroid.y);
        const angle = Math.atan2(directionY, directionX);

        // Rotate the spaceship to point towards the player
        const currentRotation = this.baseSpaceshipDisplay.getCurrentRotation();
        const rotationDifference = angle - currentRotation;

        this.baseSpaceshipDisplay.rotateAroundPoint(rotationDifference);
        
        // If the enemy is closer than 40 pixels to the player, reduce its speed
        let effectiveThrust = this.thrust;
        if (distanceToPlayer < 80) { // Considering 80 because 40 pixels is the buffer, so we start slowing down when we are 80 pixels away
            effectiveThrust *= (distanceToPlayer - 80) / 80;
        }

        this.velocity.x += effectiveThrust * Math.cos(angle);
        this.velocity.y += effectiveThrust * Math.sin(angle);

        this.velocity.x *= this.damping;
        this.velocity.y *= this.damping;

        this._points = this.baseSpaceshipDisplay.drawObjectAlive(this.velocity);


        this.exhaustFlame.update();
        this.exhaustFlame.render();

        this.forceField.update();
        this.forceField.render();

        this.hitpoints = this.baseSpaceshipDisplay.weakHitpointsFlashIndicator(this.hitpoints, this.flashLastTime, this.flashColorIndex, this.flashLightChangeWaitLength, this.explosionColors);
    
    }


    protected testCollisionAgainstGroup(sourceObject: BaseExplodable,
        targetObjects: BaseExplodable[]) {

        for (let i2 = 0; i2 < targetObjects.length; ++i2) {
            let width = targetObjects[i2].getObjectWidthHeight().width / 2;
            let height = targetObjects[i2].getObjectWidthHeight().height / 2;


            if (targetObjects[i2] instanceof PlayerSpaceship) {
                let player = targetObjects[i2] as PlayerSpaceship;

                if (player.forceField?.isVisible === true) {
                    width = ForceField.circleRadius * 1.5;
                    height = ForceField.circleRadius * 1.5;
                }
            }


            if (sourceObject.handleBaseCollision(targetObjects[i2], (width > height) ? width : height)) {
                return i2;
            }
        }
        return -1;
    }


}
