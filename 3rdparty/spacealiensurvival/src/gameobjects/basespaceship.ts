import Phaser from 'phaser';
import { ExhaustFlame } from './exhaustflame';
import { SpaceObject } from './spaceobject';
import { ForceField } from './forcefield';
import { Bullet } from './bullet';
import { Mine } from "./mine";
import { Missile } from './missile';
import { BaseExplodable, BaseExplodableState } from './baseExplodable';
import { BaseSpaceshipDisplay } from './basespaceshipdisplay';
import { BaseSpaceshipDisplayTriangles } from './basespaceshipdisplaytriangles';
import { BaseSpaceshipDisplayImage } from './basespaceshipdisplayimage';


export enum SpaceShipType {
    TRIANGLES,
    IMAGE
}

export class BaseSpaceship extends BaseExplodable {
    public static halfBaseWidth = 10;
    public static halfHeight = 15;


    protected rotationRate: number = 10;
    protected thrust: number = 0.5;
    protected damping: number = 0.98;
    protected velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    protected lastFired: number = 0;
    protected fireRate: number = 200;  // 1000 ms = 1 second
    protected missileLastFired: number = 0;
    protected missileFireRate: number = 500;  // 1000 ms = 1 second
    protected lastMinePlaced: number = 0;
    protected mineRate: number = 500;  // 1000 ms = 1 second
    protected initialPositionOffset: number;
    protected spaceshipColor: number;
    protected flashColorIndex: number = 0;
    protected flashLastTime: number = Date.now();
    protected flashLightChangeWaitLength: number = 200; // when the spaceship it weaks it flashes.  This controls 
    // how long  each color lasts before oscilatingto different color.
    protected exhaustFlame: ExhaustFlame;

    protected mines: Mine[] = [];
    protected bullets: Bullet[] = [];
    protected missiles: Missile[] = [];
    protected baseSpaceshipDisplay?: BaseSpaceshipDisplay;


    protected leftKey?: Phaser.Input.Keyboard.Key;
    protected rightKey?: Phaser.Input.Keyboard.Key;
    protected upKey?: Phaser.Input.Keyboard.Key;
    protected shieldKey?: Phaser.Input.Keyboard.Key;
    protected fireKey?: Phaser.Input.Keyboard.Key;
    protected missileKey?: Phaser.Input.Keyboard.Key;
    protected mineKey?: Phaser.Input.Keyboard.Key;
    protected thrustSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    protected shieldSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    public hitpoints: number = 10;
    public forceField: ForceField;


    constructor(scene: Phaser.Scene, spaceShipType: SpaceShipType, imageNameKey: string, initialPositionOffset: number = 400, spaceshipColor: number = 0xC0C0C0) {
        super(scene, scene.add.graphics({ lineStyle: { width: 2, color: spaceshipColor }, fillStyle: { color: spaceshipColor } }));

        this.thrustSound = this.scene.sound.add('thrust', { loop: true });
        this.shieldSound = this.scene.sound.add('shield', { loop: true });

        this.initialPositionOffset = initialPositionOffset;
        this.spaceshipColor = spaceshipColor;

        this.leftKey = this.scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.upKey = this.scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.shieldKey = this.scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.fireKey = this.scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.missileKey = this.scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        this.mineKey = this.scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        this.baseSpaceshipDisplay = (spaceShipType === SpaceShipType.IMAGE) ? new BaseSpaceshipDisplayImage(this.scene, this.graphics, imageNameKey, this.initialPositionOffset, this.spaceshipColor) : new BaseSpaceshipDisplayTriangles(this.scene, this.graphics, this.initialPositionOffset, this.spaceshipColor);

        this.forceField = new ForceField(this.scene, this);
        this.exhaustFlame = new ExhaustFlame(this.scene, this.baseSpaceshipDisplay);


    }


    public destroy(): void {
        super.destroy();

        // Hide exhaust flame and force field
        this.exhaustFlame.hide();
        this.forceField.hide();
        // Destroy bullets, missiles, and mines
        this.bullets.forEach(bullet => bullet.destroy());
        this.missiles.forEach(missile => missile.destroy());
        this.mines.forEach(mine => mine.destroy());
    }

    public explode(): void {
        this.baseSpaceshipDisplay?.hide();
        super.explode();
    }

    public isEverythingDestroyed() {
        let isEverythingDestroyed = true;

        for (let i = 0; i < this.bullets.length; ++i) {
            if (this.bullets[i].state !== BaseExplodableState.DESTROYED) {
                isEverythingDestroyed = false;
                break;
            }
        }

        if (isEverythingDestroyed === true) {
            for (let i = 0; i < this.missiles.length; ++i) {
                if (this.missiles[i].state !== BaseExplodableState.DESTROYED) {
                    isEverythingDestroyed = false;
                    break;
                }
            }
        }


        if (isEverythingDestroyed === true) {
            for (let i = 0; i < this.mines.length; ++i) {
                if (this.mines[i].state !== BaseExplodableState.DESTROYED) {
                    isEverythingDestroyed = false;
                    break;
                }
            }
        }

        return (this.state === BaseExplodableState.DESTROYED && isEverythingDestroyed);
    }

    public spawn(initialPositionOffset: number = 400): void {
        if (!this.baseSpaceshipDisplay) {
            return;
        }

        this.respawn();

        // Reset initial position offset and color
        this.initialPositionOffset = initialPositionOffset;
        this.baseSpaceshipDisplay.spawn(initialPositionOffset);

        // Reset velocity
        this.velocity.set(0, 0);
        // Reset hitpoints
        this.hitpoints = 10;
    }


    public getVelocity(): Phaser.Math.Vector2 {
        return this.velocity;
    }

    public setVelocity(x: number, y: number) {
        this.velocity.set(x, y);
    }

    public getCentroid(): Phaser.Geom.Point {
        if (!this.baseSpaceshipDisplay) {
            return new Phaser.Geom.Point(0, 0);
        }

        return this.baseSpaceshipDisplay?.getCentroid();
    }

    public playThrustSound(): void {
        if (!this.thrustSound.isPlaying) {
            this.thrustSound.play();
        }
    }

    public stopThrustSound(): void {
        if (this.thrustSound.isPlaying) {
            this.thrustSound.stop();
        }
    }

    public playShieldSound(): void {
        if (!this.shieldSound.isPlaying) {
            this.shieldSound.play();
        }
    }

    public stopSheildSound(): void {
        if (this.shieldSound.isPlaying) {
            this.shieldSound.stop();
        }
    }

    public playBulletSound(): void {
        let bulletSound = this.scene.sound.add('bullet', { loop: false });
        bulletSound.play();
    }

    public playMissileSound(): void {
        let missileSound = this.scene.sound.add('missile', { loop: false });
        missileSound.play();
    }

    public playImpactSound(): void {
        let impactSound = this.scene.sound.add('impact', { loop: false });
        impactSound.play();
    }


    public calculateVelocity() : void {
        if( !this.baseSpaceshipDisplay ) {
            return;
        }

        if (this.upKey?.isDown) {
            this.playThrustSound();
            const angle = this.baseSpaceshipDisplay.getForwardAngle();
            this.velocity.x += this.thrust * Math.cos(angle);
            this.velocity.y += this.thrust * Math.sin(angle);
        } else {
            this.stopThrustSound();
        }

        this.velocity.x *= this.damping;
        this.velocity.y *= this.damping;
 
    }

    public calculateRotation() {
        if (!this.baseSpaceshipDisplay) {
            return;
        }
        if (this.leftKey?.isDown) {
            this.baseSpaceshipDisplay.rotateLeft(this.rotationRate);
        } else if (this.rightKey?.isDown) {
            this.baseSpaceshipDisplay.rotateRight(this.rotationRate);
        }

        if (this.upKey?.isDown) {
            this.exhaustFlame.show();
        } else {
            this.exhaustFlame.hide();
        }

        
    }

    public drawObjectAlive(): void {
        if (!this.baseSpaceshipDisplay) {
            return;
        }

        this.calculateRotation();

        this.calculateVelocity();

        this._points = this.baseSpaceshipDisplay.drawObjectAlive(this.velocity);

        if (this.shieldKey?.isDown) {
            this.forceField.show();
            this.playShieldSound();
        } else {
            this.forceField.hide();
            this.stopSheildSound();
        }

        this.exhaustFlame.update();
        this.exhaustFlame.render();

        this.forceField.update();
        this.forceField.render();

        this.flashColorIndex = this.baseSpaceshipDisplay.weakHitpointsFlashIndicator(this.hitpoints, this.flashLastTime, this.flashColorIndex, this.flashLightChangeWaitLength, this.explosionColors);
    }


    public renderWeapons() {
        this.bullets.forEach((bullet) => { bullet.render(); });
        this.missiles.forEach((missile) => { missile.render() });
        this.mines.forEach((mine) => { mine.render() });
    }


    public handleWeaponsAgainstSpaceObjets(spaceObjects: SpaceObject[]) {
        this.collisionCollectionSpaceObjectTest(this.bullets, spaceObjects);
        this.collisionCollectionSpaceObjectTest(this.mines, spaceObjects);
        this.collisionCollectionSpaceObjectTest(this.missiles, spaceObjects);
    }

    public shootMissile(target: BaseSpaceship): void {
        if (!this.baseSpaceshipDisplay) {
            return;
        }

        const angle = this.baseSpaceshipDisplay.getForwardAngle();
        const centroid = this.baseSpaceshipDisplay.getCentroid();
        const missile = new Missile(this.scene, centroid.x, centroid.y, angle);
        missile.setTarget(target);
        this.missiles.push(missile);
        this.missileLastFired = this.scene.time.now;
        this.playMissileSound();
    }

    public handleMissiles(spaceShips: BaseSpaceship[]) {
        if (!this.baseSpaceshipDisplay) {
            return;
        }

        const currentTime = this.scene.time.now;

        if (this.missileKey?.isDown &&
            (currentTime - this.missileLastFired > this.missileFireRate) &&
            this.forceField.isVisible === false &&
            this.state === BaseExplodableState.ALIVE) {
            this.shootMissile(spaceShips[Phaser.Math.Between(0, spaceShips.length - 1)]);
        }

        this.collisionCollectionTest(this.missiles, spaceShips);

    }


    public shootBullets() {
        if( ! this.baseSpaceshipDisplay ) {
            return;
        }
        const angle = this.baseSpaceshipDisplay.getForwardAngle();
        const centroid = this.baseSpaceshipDisplay.getCentroid();
        const bullet = new Bullet(this.scene, centroid.x, centroid.y, angle);
        this.bullets.push(bullet);
        this.lastFired = this.scene.time.now;
        this.playBulletSound();
    }

    public handleBullets(spaceShips: BaseSpaceship[]) {
        if (!this.baseSpaceshipDisplay) {
            return;
        }

        const currentTime = this.scene.time.now;

        if (this.fireKey?.isDown &&
            (currentTime - this.lastFired > this.fireRate) &&
            this.forceField.isVisible === false &&
            this.state === BaseExplodableState.ALIVE) {
           this.shootBullets();
        }

        this.collisionCollectionTest(this.bullets, spaceShips);

    }

    public handleMines(spaceShips: BaseSpaceship[]) {
        if (!this.baseSpaceshipDisplay) {
            return;
        }

        const currentTime = this.scene.time.now;

        if (this.mineKey?.isDown &&
            (currentTime - this.lastMinePlaced > this.mineRate) &&
            this.forceField.isVisible === false &&
            this.state === BaseExplodableState.ALIVE) {
            const centroid = this.baseSpaceshipDisplay.getCentroid();
            const x = centroid.x;
            const y = centroid.y;
            const mine = new Mine(this.scene, x, y);
            this.mines.push(mine);
            this.lastMinePlaced = currentTime;
        }

        this.collisionCollectionTest(this.mines, spaceShips);


    }

    public handleSpaceshipCollision(spaceship: BaseSpaceship) {
        const centroid = this.getCentroid();
        const spaceshipCentroid = spaceship.getCentroid();
        const distance = Phaser.Math.Distance.Between(centroid.x, centroid.y, spaceshipCentroid.x, spaceshipCentroid.y);

        if (distance < (BaseSpaceship.halfBaseWidth * 2)) {

            // Calculate the new velocities after collision (simple reflection)
            const enemyVelocity = this.velocity.clone();
            const playerVelocity = spaceship.getVelocity().clone();

            // Mass of enemy spaceship and player spaceship (you may need to adjust these)
            const enemyMass = 1;
            const playerMass = 1;

            const newEnemyVelocity = enemyVelocity.clone()
                .scale((enemyMass - playerMass) / (enemyMass + playerMass))
                .add(playerVelocity.clone().scale((2 * playerMass) / (enemyMass + playerMass)));

            const newPlayerVelocity = playerVelocity.clone()
                .scale((playerMass - enemyMass) / (enemyMass + playerMass))
                .add(enemyVelocity.clone().scale((2 * enemyMass) / (enemyMass + playerMass)));

            // Apply the new velocities
            this.velocity.set(newEnemyVelocity.x, newEnemyVelocity.y);
            spaceship.setVelocity(newPlayerVelocity.x, newPlayerVelocity.y);
        }
    }


    public detectSpaceshipBounceCollisions(spaceShips: BaseSpaceship[]) {
        spaceShips.forEach((ship) => {
            this.handleSpaceshipCollision(ship);
        });
    }

    public detectSpaceObjctBounceCollisions(spaceObjects: SpaceObject[]) {
        if (!this.baseSpaceshipDisplay) {
            return;
        }

        const centroidSpaceShip = this.baseSpaceshipDisplay.getCentroid();

        for (const spaceObj of spaceObjects) {
            const collisionPoints = this.baseSpaceshipDisplay.getCollisionPoints();

            for (let point of collisionPoints) {
                if (Phaser.Geom.Polygon.ContainsPoint(spaceObj.getPolygon(), point)) {
                    const centroidSpaceObj = spaceObj.getCentroid();
                    const distance = Phaser.Math.Distance.BetweenPoints(point, centroidSpaceObj);

                    if (distance < (BaseSpaceship.halfBaseWidth * 2)) {
                        const angle = Phaser.Math.Angle.BetweenPoints(centroidSpaceShip, centroidSpaceObj);
                        const velocity1 = this.velocity.clone();
                        const velocity2 = spaceObj.getVelocity().clone();

                        const m1 = 1; // Mass for PlayerSpaceship. Adjust if needed
                        const m2 = 1; // Mass for SpaceObject. Adjust if needed

                        const newVelocity1 = velocity1.clone().scale((m1 - m2) / (m1 + m2)).add(velocity2.clone().scale((2 * m2) / (m1 + m2)));
                        const newVelocity2 = velocity2.clone().scale((m2 - m1) / (m1 + m2)).add(velocity1.clone().scale((2 * m1) / (m1 + m2)));

                        this.velocity.set(newVelocity1.x, newVelocity1.y);
                        spaceObj.setVelocity(newVelocity2.x, newVelocity2.y);
                    }
                }
            }
        }

    }


    protected testCollisionAgainstGroup(sourceObject: BaseExplodable,
        targetObjects: {
            getObjectWidthHeight(): { width: number, height: number },
            getCentroid(): Phaser.Geom.Point
        }[]) {

        for (let i2 = 0; i2 < targetObjects.length; ++i2) {
            let width = targetObjects[i2].getObjectWidthHeight().width / 2;
            let height = targetObjects[i2].getObjectWidthHeight().height / 2;

            if (sourceObject.handleBaseCollision(targetObjects[i2], (width > height) ? width : height)) {
                return i2;
            }

        }
        return -1;
    }


    protected collisionCollectionTest(exploadables: BaseExplodable[], spaceShips: BaseSpaceship[]) {
        for (let i = 0; i < exploadables.length; i++) {

            let exploadable = exploadables[i];

            if (exploadable.state === BaseExplodableState.DESTROYED) {
                exploadables.splice(i, 1);
                i--; // Adjust the index after removing an element    
            }

            if (exploadable.state === BaseExplodableState.DESTROYED || exploadable.state === BaseExplodableState.EXPLODING) {
                continue;
            }

            const foundIndex = this.testCollisionAgainstGroup(exploadable, spaceShips);

            if (foundIndex !== -1) {


                if (spaceShips[foundIndex].forceField.isVisible === false &&
                    spaceShips[foundIndex].state === BaseExplodableState.ALIVE &&
                    spaceShips[foundIndex].hitpoints > 0) {
                    this.playImpactSound();
                    spaceShips[foundIndex].hitpoints--;
                    if (spaceShips[foundIndex].hitpoints === 0) {
                        spaceShips[foundIndex].explode();
                    }
                }
            }

        }
    }

    protected collisionCollectionSpaceObjectTest(exploadables: BaseExplodable[], spaceObjects: SpaceObject[]) {
        for (let i = 0; i < exploadables.length; i++) {

            let exploadable = exploadables[i];

            if (exploadable.state === BaseExplodableState.DESTROYED) {
                exploadables.splice(i, 1);
                i--; // Adjust the index after removing an element    
            }

            if (exploadable.state === BaseExplodableState.DESTROYED || exploadable.state === BaseExplodableState.EXPLODING) {
                continue;
            }

            const foundIndex = this.testCollisionAgainstGroup(exploadable, spaceObjects);
            // No Op.  SpaceObjects don't blow up.  They just suck down exploadables.

        }
    }

}
