import Phaser from 'phaser';
import { BaseSpaceship } from './basespaceship';
import { BaseSpaceshipDisplay } from './basespaceshipdisplay';

export class BaseSpaceshipDisplayTriangles implements BaseSpaceshipDisplay {
    protected spaceShipShape: Phaser.Geom.Triangle;
    protected innerSpaceShipShape: Phaser.Geom.Triangle;
    protected initialPositionOffset: number;
    protected scene: Phaser.Scene;
    protected graphics: Phaser.GameObjects.Graphics;
    protected spaceshipColor: number;


    constructor(scene: Phaser.Scene, graphics: Phaser.GameObjects.Graphics, initialPositionOffset: number = 400, spaceshipColor: number = 12632256) {
        this.initialPositionOffset = initialPositionOffset;
        this.scene = scene;
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

    hide(): void {
        this.graphics.clear();
    }


    public rotateAroundPoint(rotationDifference: number) {
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



    public getCurrentRotation(): number {
        let centroid = this.getCentroid();
        return Math.atan2(this.spaceShipShape.y1 - centroid.y, this.spaceShipShape.x1 - centroid.x);
    }

    public getDistanceFromTopToBottom(): number {
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
