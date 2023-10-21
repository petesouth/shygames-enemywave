import Phaser from 'phaser';
import { ExhaustFlame } from './exhaustflame';
import { SpaceObject } from './spaceobject';
import { ForceField } from './forcefield';
import { Bullet } from './bullet';
import { Mine } from "./mine";
import { Missile } from './missile';
import { BaseExplodable, BaseExplodableState } from './baseExplodable';

class BaseSpaceshipDisplayTriangles {
    protected spaceShipShape: Phaser.Geom.Triangle;
    protected innerSpaceShipShape: Phaser.Geom.Triangle;
    protected initialPositionOffset: number;
    protected scene: Phaser.Scene;
    protected graphics: Phaser.GameObjects.Graphics;
    protected spaceshipColor: number;


    constructor(scene: Phaser.Scene, graphics: Phaser.GameObjects.Graphics, initialPositionOffset: number = 400, spaceshipColor: number = 0xC0C0C0) {
        this.initialPositionOffset = initialPositionOffset;
        this.scene = scene
        this.graphics = graphics;
        this.spaceshipColor = spaceshipColor;

        this.spaceShipShape = new Phaser.Geom.Triangle(
            this.initialPositionOffset, this.initialPositionOffset - BaseSpaceship.halfHeight,
            this.initialPositionOffset - BaseSpaceship.halfBaseWidth, this.initialPositionOffset + BaseSpaceship.halfHeight,
            this.initialPositionOffset + BaseSpaceship.halfBaseWidth, this.initialPositionOffset + BaseSpaceship.halfHeight
        );

        this.innerSpaceShipShape = new Phaser.Geom.Triangle(
            this.initialPositionOffset, this.initialPositionOffset - BaseSpaceship.halfHeight * 0.6,
            this.initialPositionOffset - BaseSpaceship.halfBaseWidth * 0.7, this.initialPositionOffset + BaseSpaceship.halfHeight * 0.75,
            this.initialPositionOffset + BaseSpaceship.halfBaseWidth * 0.7, this.initialPositionOffset + BaseSpaceship.halfHeight * 0.75
        );
    }

    public getCentroid(): Phaser.Geom.Point {
        return Phaser.Geom.Triangle.Centroid(this.spaceShipShape);
    }

    public rotateAroundPoint(rotationDifference:number ) {
        let centroid = this.getCentroid();
        Phaser.Geom.Triangle.RotateAroundPoint(this.spaceShipShape, centroid, rotationDifference);
        Phaser.Geom.Triangle.RotateAroundPoint(this.innerSpaceShipShape, centroid, rotationDifference);
    }
    

    public rotateRight(rotationRate: number) {
        let centroid = this.getCentroid();
        Phaser.Geom.Triangle.RotateAroundPoint(this.spaceShipShape, centroid, rotationRate);
        Phaser.Geom.Triangle.RotateAroundPoint(this.innerSpaceShipShape, centroid, rotationRate);

    }

    public rotateLeft(rotationRate: number) {
        let centroid = this.getCentroid();
        Phaser.Geom.Triangle.RotateAroundPoint(this.spaceShipShape, centroid, -rotationRate);
        Phaser.Geom.Triangle.RotateAroundPoint(this.innerSpaceShipShape, centroid, -rotationRate);
    }

    public thrustForward(thrust: number, centroid: Phaser.Geom.Point, velocity: Phaser.Math.Vector2): Phaser.Math.Vector2 {
        const deltaX = this.spaceShipShape.x1 - centroid.x;
        const deltaY = this.spaceShipShape.y1 - centroid.y;
        const angle = Math.atan2(deltaY, deltaX);
        velocity.x += thrust * Math.cos(angle);
        velocity.y += thrust * Math.sin(angle);
        return velocity;
    }

    public spawn(initialPositionOffset: number = 400): void {

        // Reset graphics object style
        this.graphics.lineStyle(2, this.spaceshipColor);
        this.graphics.fillStyle(this.spaceshipColor);
        // Reset spaceship shape to initial position
        this.spaceShipShape.setTo(
            this.initialPositionOffset, this.initialPositionOffset - BaseSpaceship.halfHeight,
            this.initialPositionOffset - BaseSpaceship.halfBaseWidth, this.initialPositionOffset + BaseSpaceship.halfHeight,
            this.initialPositionOffset + BaseSpaceship.halfBaseWidth, this.initialPositionOffset + BaseSpaceship.halfHeight
        );
        // Reset inner spaceship shape to initial position
        this.innerSpaceShipShape.setTo(
            this.initialPositionOffset, this.initialPositionOffset - BaseSpaceship.halfHeight * 0.6,
            this.initialPositionOffset - BaseSpaceship.halfBaseWidth * 0.7, this.initialPositionOffset + BaseSpaceship.halfHeight * 0.75,
            this.initialPositionOffset + BaseSpaceship.halfBaseWidth * 0.7, this.initialPositionOffset + BaseSpaceship.halfHeight * 0.75
        );
        

        // Reset initial position offset and color
        this.initialPositionOffset = initialPositionOffset;
        // Reset graphics object style
        this.graphics.lineStyle(2, this.spaceshipColor);
        this.graphics.fillStyle(this.spaceshipColor);
        // Reset spaceship shape to initial position
        this.spaceShipShape.setTo(
            this.initialPositionOffset, this.initialPositionOffset - BaseSpaceship.halfHeight,
            this.initialPositionOffset - BaseSpaceship.halfBaseWidth, this.initialPositionOffset + BaseSpaceship.halfHeight,
            this.initialPositionOffset + BaseSpaceship.halfBaseWidth, this.initialPositionOffset + BaseSpaceship.halfHeight
        );
        // Reset inner spaceship shape to initial position
        this.innerSpaceShipShape.setTo(
            this.initialPositionOffset, this.initialPositionOffset - BaseSpaceship.halfHeight * 0.6,
            this.initialPositionOffset - BaseSpaceship.halfBaseWidth * 0.7, this.initialPositionOffset + BaseSpaceship.halfHeight * 0.75,
            this.initialPositionOffset + BaseSpaceship.halfBaseWidth * 0.7, this.initialPositionOffset + BaseSpaceship.halfHeight * 0.75
        );
    }

    public drawObjectAlive(velocity: Phaser.Math.Vector2): Phaser.Geom.Point[] {
        Phaser.Geom.Triangle.Offset(this.spaceShipShape, velocity.x, velocity.y);
        Phaser.Geom.Triangle.Offset(this.innerSpaceShipShape, velocity.x, velocity.y);

        const maxX = Math.max(this.spaceShipShape.x1, this.spaceShipShape.x2, this.spaceShipShape.x3);
        const minX = Math.min(this.spaceShipShape.x1, this.spaceShipShape.x2, this.spaceShipShape.x3);
        const maxY = Math.max(this.spaceShipShape.y1, this.spaceShipShape.y2, this.spaceShipShape.y3);
        const minY = Math.min(this.spaceShipShape.y1, this.spaceShipShape.y2, this.spaceShipShape.y3);

        if (maxX < 0) {
            Phaser.Geom.Triangle.Offset(this.spaceShipShape, this.scene.scale.width, 0);
            Phaser.Geom.Triangle.Offset(this.innerSpaceShipShape, this.scene.scale.width, 0);
        } else if (minX > this.scene.scale.width) {
            Phaser.Geom.Triangle.Offset(this.spaceShipShape, -this.scene.scale.width, 0);
            Phaser.Geom.Triangle.Offset(this.innerSpaceShipShape, -this.scene.scale.width, 0);
        }

        if (maxY < 0) {
            Phaser.Geom.Triangle.Offset(this.spaceShipShape, 0, this.scene.scale.height);
            Phaser.Geom.Triangle.Offset(this.innerSpaceShipShape, 0, this.scene.scale.height);
        } else if (minY > this.scene.scale.height) {
            Phaser.Geom.Triangle.Offset(this.spaceShipShape, 0, -this.scene.scale.height);
            Phaser.Geom.Triangle.Offset(this.innerSpaceShipShape, 0, -this.scene.scale.height);
        }

        this.graphics.strokeTriangleShape(this.spaceShipShape);
        this.graphics.fillTriangleShape(this.innerSpaceShipShape);
        return this.spaceShipShape.getPoints(3);
    }

    public weakHitpointsFlashIndicator(hitpoints: number, flashLastTime: number, flashColorIndex: number, flashLightChangeWaitLength: number, explosionColors: number[]): number {
        if (hitpoints < 5 && explosionColors.length > 0 &&
            (Date.now() - flashLastTime) > flashLightChangeWaitLength) {
            flashLastTime = Date.now();
            if (flashColorIndex > (explosionColors.length - 1)) {
                flashColorIndex = 0;
            } else {
                flashColorIndex++;
            }
            const chosenColor = explosionColors[flashColorIndex];
            this.graphics.fillStyle(chosenColor);
        }
        return flashColorIndex;
    }

    public getForwardAngle(): number {
        const centroid = this.getCentroid();
        const angle = Math.atan2(this.spaceShipShape.y1 - centroid.y, this.spaceShipShape.x1 - centroid.x);
        return angle;
    }

    public getReverseAngle(): number {
        const centroid = this.getCentroid();
        const angle = Math.atan2(this.spaceShipShape.y1 - centroid.y, this.spaceShipShape.x1 - centroid.x) + Math.PI;
        return angle;
    }



    public getCurrentRotation() : number {
        let centroid = this.getCentroid();
        return Math.atan2(this.spaceShipShape.y1 - centroid.y, this.spaceShipShape.x1 - centroid.x);
    }

    public getDistanceFromTopToBottom(): number{
        const centroid = this.getCentroid();
        return Phaser.Math.Distance.Between(centroid.x, centroid.y, this.spaceShipShape.x1, this.spaceShipShape.y1);
    }

    public getCollisionPoints(): Phaser.Geom.Point[] {
        return [
            new Phaser.Geom.Point(this.spaceShipShape.x1, this.spaceShipShape.y1),
            new Phaser.Geom.Point(this.spaceShipShape.x2, this.spaceShipShape.y2),
            new Phaser.Geom.Point(this.spaceShipShape.x3, this.spaceShipShape.y3)
        ];

    }



}

export class BaseSpaceship extends BaseExplodable {
    public static halfBaseWidth = 10;
    public static halfHeight = 15;


    protected rotationRate: number = 0.2;
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
    protected baseSpaceshipDisplay: BaseSpaceshipDisplayTriangles;


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


    constructor(scene: Phaser.Scene, initialPositionOffset: number = 400, spaceshipColor: number = 0xC0C0C0) {
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

        this.baseSpaceshipDisplay = new BaseSpaceshipDisplayTriangles(this.scene, this.graphics, this.initialPositionOffset, this.spaceshipColor );
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
        this.respawn();

        // Reset initial position offset and color
        this.initialPositionOffset = initialPositionOffset;
        
        this.baseSpaceshipDisplay.spawn();

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
        return this.baseSpaceshipDisplay.getCentroid();
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




    public drawObjectAlive(): void {
        const centroid = this.getCentroid();

        if (this.leftKey?.isDown) {
            this.baseSpaceshipDisplay.rotateLeft(this.rotationRate);
        } else if (this.rightKey?.isDown) {
            this.baseSpaceshipDisplay.rotateRight(this.rotationRate);        }

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

        
        this._points = this.baseSpaceshipDisplay.drawObjectAlive(this.velocity);

        if (this.upKey?.isDown) {
            this.exhaustFlame.show();
        } else {
            this.exhaustFlame.hide();
        }

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

        this.hitpoints = this.baseSpaceshipDisplay.weakHitpointsFlashIndicator(this.hitpoints, this.flashLastTime, this.flashColorIndex, this.flashLightChangeWaitLength, this.explosionColors);
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


    public handleMissiles(spaceShips: BaseSpaceship[]) {
        const currentTime = this.scene.time.now;

        if (this.missileKey?.isDown &&
            (currentTime - this.missileLastFired > this.missileFireRate) &&
            this.forceField.isVisible === false &&
            this.state === BaseExplodableState.ALIVE) {
            const angle = this.baseSpaceshipDisplay.getForwardAngle();
            const centroid = this.baseSpaceshipDisplay.getCentroid();
            const missile = new Missile(this.scene, centroid.x, centroid.y, angle);
            missile.setTarget(spaceShips[Phaser.Math.Between(0, spaceShips.length - 1)]);
            this.missiles.push(missile);
            this.missileLastFired = currentTime;
            this.playMissileSound();

        }

        this.collisionCollectionTest(this.missiles, spaceShips);

    }

    public handleBullets(spaceShips: BaseSpaceship[]) {
        const currentTime = this.scene.time.now;

        if (this.fireKey?.isDown &&
            (currentTime - this.lastFired > this.fireRate) &&
            this.forceField.isVisible === false &&
            this.state === BaseExplodableState.ALIVE) {
            const angle = this.baseSpaceshipDisplay.getForwardAngle();
            const centroid = this.baseSpaceshipDisplay.getCentroid();
            const bullet = new Bullet(this.scene, centroid.x, centroid.y, angle);
            this.bullets.push(bullet);
            this.lastFired = currentTime;
            this.playBulletSound();
        }

        this.collisionCollectionTest(this.bullets, spaceShips);

    }

    public handleMines(spaceShips: BaseSpaceship[]) {
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
