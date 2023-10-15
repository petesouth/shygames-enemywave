import Phaser from 'phaser';
import { ExhaustFlame } from './exhaustflame';
import { SpaceObject } from './spaceobject';
import { ForceField } from './forcefield';
import { Bullet } from './bullet';
import { Mine } from "./mine";
import { Missile } from './missile';
import { BaseExplodable } from './baseExplodable';


export const halfBaseWidth = 10;
export const halfHeight = 15;
export const MISSILE_WAIT_TIME = 2000;

export class BaseSpaceship extends BaseExplodable {
    protected spaceShipShape: Phaser.Geom.Triangle;
    protected innerSpaceShipShape: Phaser.Geom.Triangle;
    protected graphics: Phaser.GameObjects.Graphics;
    protected rotationRate: number = 0.2;
    protected thrust: number = 0.5;
    protected damping: number = 0.98;
    protected velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    protected leftKey?: Phaser.Input.Keyboard.Key;
    protected rightKey?: Phaser.Input.Keyboard.Key;
    protected upKey?: Phaser.Input.Keyboard.Key;
    protected shieldKey?: Phaser.Input.Keyboard.Key;
    protected forceField: ForceField;
    protected fireKey?: Phaser.Input.Keyboard.Key;
    protected missileKey?: Phaser.Input.Keyboard.Key;
    protected mineKey?: Phaser.Input.Keyboard.Key;

    protected mines: Mine[] = [];
    protected bullets: Bullet[] = [];
    protected lastFired: number = 0;
    protected fireRate: number = 200;  // 1000 ms = 1 second


    protected missiles: Missile[] = [];
    protected missileLastFired: number = 0;
    protected missileFireRate: number = 200;  // 1000 ms = 1 second


    protected lastMinePlaced: number = 0;
    protected mineRate: number = 1000;  // 1000 ms = 1 second


    protected scene: Phaser.Scene;
    protected exhaustFlame: ExhaustFlame;
    protected initialPositionOffset: number;
    protected spaceshipColor: number;



    constructor(scene: Phaser.Scene, initialPositionOffset: number = 400, spaceshiptColor: number = 0xC0C0C0) {
        super(scene);
        this.scene = scene;
        this.initialPositionOffset = initialPositionOffset;
        this.spaceshipColor = spaceshiptColor;
        this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: this.spaceshipColor }, fillStyle: { color: this.spaceshipColor } });



        this.spaceShipShape = new Phaser.Geom.Triangle(
            this.initialPositionOffset, this.initialPositionOffset - halfHeight,
            this.initialPositionOffset - halfBaseWidth, this.initialPositionOffset + halfHeight,
            this.initialPositionOffset + halfBaseWidth, this.initialPositionOffset + halfHeight
        );

        this.innerSpaceShipShape = new Phaser.Geom.Triangle(
            this.initialPositionOffset, this.initialPositionOffset - halfHeight * 0.6,
            this.initialPositionOffset - halfBaseWidth * 0.7, this.initialPositionOffset + halfHeight * 0.75,
            this.initialPositionOffset + halfBaseWidth * 0.7, this.initialPositionOffset + halfHeight * 0.75
        );

        this.leftKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.upKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.shieldKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.fireKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.missileKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        this.mineKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        this.forceField = new ForceField(scene, this);
        this.exhaustFlame = new ExhaustFlame(scene, this.spaceShipShape);
        this._points = this.spaceShipShape.getPoints(3);

    }

    public getVelocity(): Phaser.Math.Vector2 {
        return this.velocity;
    }

    public setVelocity(x: number, y: number) {
        this.velocity.set(x, y);
    }

    public getTriangle() {
        return this.spaceShipShape;
    }



    updateSpaceshipState() {
        const centroid = this.getCentroid();

        if (this.leftKey?.isDown) {
            Phaser.Geom.Triangle.RotateAroundPoint(this.spaceShipShape, centroid, -this.rotationRate);
            Phaser.Geom.Triangle.RotateAroundPoint(this.innerSpaceShipShape, centroid, -this.rotationRate);
        } else if (this.rightKey?.isDown) {
            Phaser.Geom.Triangle.RotateAroundPoint(this.spaceShipShape, centroid, this.rotationRate);
            Phaser.Geom.Triangle.RotateAroundPoint(this.innerSpaceShipShape, centroid, this.rotationRate);
        }

        if (this.upKey?.isDown) {
            const deltaX = this.spaceShipShape.x1 - centroid.x;
            const deltaY = this.spaceShipShape.y1 - centroid.y;
            const angle = Math.atan2(deltaY, deltaX);
            this.velocity.x += this.thrust * Math.cos(angle);
            this.velocity.y += this.thrust * Math.sin(angle);
        }

        this.velocity.x *= this.damping;
        this.velocity.y *= this.damping;

        Phaser.Geom.Triangle.Offset(this.spaceShipShape, this.velocity.x, this.velocity.y);
        Phaser.Geom.Triangle.Offset(this.innerSpaceShipShape, this.velocity.x, this.velocity.y);

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

        if (this.upKey?.isDown) {
            this.exhaustFlame.show();
        } else {
            this.exhaustFlame.hide();
        }

        if (this.shieldKey?.isDown) {
            this.forceField.show();
        } else {
            this.forceField.hide();
        }

        this._points = this.spaceShipShape.getPoints(3);

    }

    public render() {
        this.graphics.clear();


        if (this.isPopping) {

            this.exhaustFlame.hide();

            this.forceField.hide();
            this.renderExplosion();
        } else if( this.isPopping === false && this.hit === false ) {
            this.exhaustFlame.update();
            this.exhaustFlame.render();

            this.forceField.update();
            this.forceField.render();

            this.updateSpaceshipState();
            this.graphics.strokeTriangleShape(this.spaceShipShape);
            this.graphics.fillTriangleShape(this.innerSpaceShipShape);
        }

    }

    protected testCollisionAgainstGroup(sourceObject: BaseExplodable,
        targetObjects: {
            getCentroid(): Phaser.Geom.Point,
            getObjectWidthHeight(): {
                width: number,
                height: number
            }
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


    protected collisionCollectionTest(exploadables: BaseExplodable[], spaceObjects: SpaceObject[], spaceShips: BaseSpaceship[]) {
        for (let i = 0; i < exploadables.length; i++) {

            let exploadable = exploadables[i];
            exploadable.render();

            const foundIndex = this.testCollisionAgainstGroup(exploadable, spaceShips);
            if (foundIndex !== -1) {
                exploadables.splice(i, 1);
                i--; // Adjust the index after removing an element
                spaceShips[foundIndex].hit = true;
                spaceShips[foundIndex].pop();

                console.log("HIT....   index", foundIndex);
            } else if (this.testCollisionAgainstGroup(exploadable, spaceObjects) !== -1) {
                exploadables.splice(i, 1);
                i--; // Adjust the index after removing an element
            }

        }
    }

    public handleMissiles(spaceObjects: SpaceObject[], spaceShips: BaseSpaceship[]) {
        const currentTime = this.scene.time.now;

        if (this.missileKey?.isDown && (currentTime - this.missileLastFired > MISSILE_WAIT_TIME)) {
            const centroid = Phaser.Geom.Triangle.Centroid(this.spaceShipShape);
            const angle = Math.atan2(this.spaceShipShape.y1 - centroid.y, this.spaceShipShape.x1 - centroid.x);
            const missile = new Missile(this.scene, this.spaceShipShape.x1, this.spaceShipShape.y1, angle);
            missile.setTarget(spaceShips[Phaser.Math.Between(0, spaceShips.length - 1)]);
            this.missiles.push(missile);
            this.missileLastFired = currentTime;
        }

        this.collisionCollectionTest(this.missiles, spaceObjects, spaceShips);

    }

    public handleBullets(spaceObjects: SpaceObject[], spaceShips: BaseSpaceship[]) {
        const currentTime = this.scene.time.now;

        if (this.fireKey?.isDown && (currentTime - this.lastFired > this.fireRate)) {
            const centroid = Phaser.Geom.Triangle.Centroid(this.spaceShipShape);
            const angle = Math.atan2(this.spaceShipShape.y1 - centroid.y, this.spaceShipShape.x1 - centroid.x);
            const bullet = new Bullet(this.scene, this.spaceShipShape.x1, this.spaceShipShape.y1, angle);
            this.bullets.push(bullet);
            this.lastFired = currentTime;
        }

        this.collisionCollectionTest(this.bullets, spaceObjects, spaceShips);

    }

    public handleMines(spaceObjects: SpaceObject[], spaceShips: BaseSpaceship[]) {
        const currentTime = this.scene.time.now;

        if (this.mineKey?.isDown && (currentTime - this.lastMinePlaced > this.mineRate)) {
            const x = this.getPositionX();
            const y = this.getPositionY();
            const mine = new Mine(this.scene, x, y);
            this.mines.push(mine);
            this.lastMinePlaced = currentTime;
        }

        this.collisionCollectionTest(this.mines, spaceObjects, spaceShips);


    }

    public handleSpaceshipCollision(spaceship: BaseSpaceship) {
        const distance = Phaser.Math.Distance.Between(this.getPositionX(), this.getPositionY(), spaceship.getPositionX(), spaceship.getPositionY());

        if (distance < (halfBaseWidth * 2)) {

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

    public getCentroid(): Phaser.Geom.Point {
        const { x, y } = this.spaceShipShape.getPoints(3).reduce((acc, point) => ({
            x: acc.x + point.x,
            y: acc.y + point.y
        }), { x: 0, y: 0 });

        const centroidX = x / this.spaceShipShape.getPoints(3).length;
        const centroidY = y / this.spaceShipShape.getPoints(3).length;

        return new Phaser.Geom.Point(centroidX, centroidY);
    }

    public getObjectWidthHeight(): { width: number, height: number } {
        let points = this.spaceShipShape.getPoints(3);
        const maxX = Math.max(...points.map(point => point.x));
        const minX = Math.min(...points.map(point => point.x));
        const maxY = Math.max(...points.map(point => point.y));
        const minY = Math.min(...points.map(point => point.y));

        return {
            width: maxX - minX,
            height: maxY - minY
        };
    }

    // Add a method to get the X position of the spaceship's centroid
    public getPositionX(): number {
        return Phaser.Geom.Triangle.Centroid(this.spaceShipShape).x;
    }

    // Add a method to get the Y position of the spaceship's centroid
    public getPositionY(): number {
        return Phaser.Geom.Triangle.Centroid(this.spaceShipShape).y;
    }


    public detectCollisions(spaceObjects: SpaceObject[], spaceShips: BaseSpaceship[]) {
        const centroidSpaceShip = Phaser.Geom.Triangle.Centroid(this.spaceShipShape);
        for (const spaceObj of spaceObjects) {
            const collisionPoints = [
                new Phaser.Geom.Point(this.spaceShipShape.x1, this.spaceShipShape.y1),
                new Phaser.Geom.Point(this.spaceShipShape.x2, this.spaceShipShape.y2),
                new Phaser.Geom.Point(this.spaceShipShape.x3, this.spaceShipShape.y3)
            ];

            for (let point of collisionPoints) {
                if (Phaser.Geom.Polygon.ContainsPoint(spaceObj.getPolygon(), point)) {
                    const centroidSpaceObj = spaceObj.getCentroid();
                    const distance = Phaser.Math.Distance.BetweenPoints(point, centroidSpaceObj);

                    if (distance < (halfBaseWidth * 2)) {
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

        spaceShips.forEach((ship) => {
            this.handleSpaceshipCollision(ship);
        });

    }



}
