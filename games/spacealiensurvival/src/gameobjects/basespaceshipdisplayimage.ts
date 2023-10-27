import Phaser from 'phaser';
import { BaseSpaceshipDisplay } from './basespaceshipdisplay';

export class BaseSpaceshipDisplayImage implements BaseSpaceshipDisplay {
    protected squarePolygon: Phaser.Geom.Polygon;
    protected scene: Phaser.Scene;
    protected graphics: Phaser.GameObjects.Graphics;
    protected spaceshipColor: number;
    protected initialPositionOffset: number;
    protected image: Phaser.GameObjects.Image;
    protected squaresize: number = 50;

    constructor(scene: Phaser.Scene, graphics: Phaser.GameObjects.Graphics, imageNameKey: string, initialPositionOffset: number = 400, spaceshipColor: number = 12632256, sqauresize: number = 50) {
        this.initialPositionOffset = initialPositionOffset;
        this.scene = scene;
        this.graphics = graphics;
        this.squaresize = sqauresize;
        this.spaceshipColor = spaceshipColor;

        // Create the square polygon with the top side facing upwards
        this.squarePolygon = new Phaser.Geom.Polygon([
            new Phaser.Geom.Point(initialPositionOffset - this.squaresize / 2, initialPositionOffset + this.squaresize / 2),
            new Phaser.Geom.Point(initialPositionOffset + this.squaresize / 2, initialPositionOffset + this.squaresize / 2),
            new Phaser.Geom.Point(initialPositionOffset + this.squaresize / 2, initialPositionOffset - this.squaresize / 2),
            new Phaser.Geom.Point(initialPositionOffset - this.squaresize / 2, initialPositionOffset - this.squaresize / 2)
        ]);

        // Create and position the image on the centroid of the square
        this.image = scene.add.image(0, 0, imageNameKey);
        this.image.setOrigin(0.5); // Center the image on its position
        const centroid = this.getCentroid();
        this.image.setPosition(centroid.x, centroid.y);
        let width = (this.image.displayHeight / this.image.displayWidth) * sqauresize;
        this.image.setDisplaySize(width, sqauresize); // Set the size to match the square

        this.image.setVisible(false);

    }

    hide(): void {
        this.graphics.clear();
        this.image.setVisible(false);
    }

    public getCentroid(): Phaser.Geom.Point {
        const { x, y } = this.squarePolygon.points.reduce((acc, point) => ({
            x: acc.x + point.x,
            y: acc.y + point.y
        }), { x: 0, y: 0 });

        const centroidX = x / this.squarePolygon.points.length;
        const centroidY = y / this.squarePolygon.points.length;

        return new Phaser.Geom.Point(centroidX, centroidY);
    }

    

    public rotateAroundPoint(rotationDifference: number): void {
        const centroid = this.getCentroid();
        const cosAngle = Math.cos(rotationDifference);
        const sinAngle = Math.sin(rotationDifference);
    
        const updatedPoints = this.squarePolygon.points.map(point => {
            const x = point.x - centroid.x;
            const y = point.y - centroid.y;
            const rotatedX = x * cosAngle - y * sinAngle + centroid.x;
            const rotatedY = x * sinAngle + y * cosAngle + centroid.y;
            return new Phaser.Geom.Point(rotatedX, rotatedY);
        });
    
        this.squarePolygon.setTo(updatedPoints);
    
        // Align the image's rotation with the angle difference 
        // so that it points towards the target point
        this.image.setRotation(this.image.rotation + rotationDifference);
    }


    public rotateRight(rotationRate: number): void {
        this.rotateAroundPoint(Phaser.Math.DegToRad(rotationRate)); // Negative rotation for clockwise (right) rotation
    }

    public rotateLeft(rotationRate: number): void {
        this.rotateAroundPoint(-Phaser.Math.DegToRad(rotationRate)); // Positive rotation for counterclockwise (left) rotation
    }

    public thrustForward(thrust: number, centroid: Phaser.Geom.Point, velocity: Phaser.Math.Vector2): Phaser.Math.Vector2 {
        const forwardAngle = Phaser.Math.Angle.BetweenPoints(this.squarePolygon.points[0], this.squarePolygon.points[1]);
        velocity.x += thrust * Math.cos(forwardAngle);
        velocity.y += thrust * Math.sin(forwardAngle);
        return velocity;
    }

    public spawn(initialPositionOffset: number = 400): void {
        this.initialPositionOffset = initialPositionOffset;

        // Reset the square polygon with the top side facing upwards
        this.squarePolygon.setTo([
            new Phaser.Geom.Point(this.initialPositionOffset - this.squaresize / 2, this.initialPositionOffset + this.squaresize / 2),
            new Phaser.Geom.Point(this.initialPositionOffset + this.squaresize / 2, this.initialPositionOffset + this.squaresize / 2),
            new Phaser.Geom.Point(this.initialPositionOffset + this.squaresize / 2, this.initialPositionOffset - this.squaresize / 2),
            new Phaser.Geom.Point(this.initialPositionOffset - this.squaresize / 2, this.initialPositionOffset - this.squaresize / 2)
        ]);

        // Reset graphics object style
        this.graphics.lineStyle(2, this.spaceshipColor);
        this.graphics.fillStyle(this.spaceshipColor);

        // Update the image's position and rotation to match the square
        const centroid = this.getCentroid();
        this.image.setPosition(centroid.x, centroid.y);
        this.image.setRotation(0); // Reset rotation
        this.image.setVisible(true);
    }


    public drawObjectAlive(velocity: Phaser.Math.Vector2): Phaser.Geom.Point[] {
        this.squarePolygon.setTo(this.squarePolygon.points.map(point => {
            return new Phaser.Geom.Point(point.x + velocity.x, point.y + velocity.y);
        }));

        // Update the image position to match the centroid of the square
        const centroid = this.getCentroid();
        this.image.setPosition(centroid.x, centroid.y);

        // Update the rotation of the image to match the square's rotation
        const forwardAngle = Phaser.Math.Angle.BetweenPoints(this.squarePolygon.points[0], this.squarePolygon.points[1]);
        this.image.setRotation(forwardAngle);

        // Check if any point of the polygon is out of bounds and adjust it
        // Wrap around the screen
        const maxX = Math.max(...this.squarePolygon.points.map(point => point.x));
        const minX = Math.min(...this.squarePolygon.points.map(point => point.x));
        const maxY = Math.max(...this.squarePolygon.points.map(point => point.y));
        const minY = Math.min(...this.squarePolygon.points.map(point => point.y));

        if (maxX < 0) {
            this.squarePolygon.setTo(this.squarePolygon.points.map(point => new Phaser.Geom.Point(point.x + this.scene.scale.width, point.y)));
        } else if (minX > this.scene.scale.width) {
            this.squarePolygon.setTo(this.squarePolygon.points.map(point => new Phaser.Geom.Point(point.x - this.scene.scale.width, point.y)));
        }

        if (maxY < 0) {
            this.squarePolygon.setTo(this.squarePolygon.points.map(point => new Phaser.Geom.Point(point.x, point.y + this.scene.scale.height)));
        } else if (minY > this.scene.scale.height) {
            this.squarePolygon.setTo(this.squarePolygon.points.map(point => new Phaser.Geom.Point(point.x, point.y - this.scene.scale.height)));
        }

        return this.getCollisionPoints();
    }

    public weakHitpointsFlashIndicator(hitpoints: number, flashLastTime: number, flashColorIndex: number, flashLightChangeWaitLength: number, explosionColors: number[]): number {
        if (hitpoints < 5 && explosionColors.length > 0 && (Date.now() - flashLastTime) > flashLightChangeWaitLength) {
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
        return Phaser.Math.Angle.BetweenPoints(this.squarePolygon.points[1], this.squarePolygon.points[2]);
    }

    public getReverseAngle(): number {
        return this.getForwardAngle() + Math.PI;
    }

    public getCurrentRotation(): number {
        const centroid = this.getCentroid();
        return Phaser.Math.Angle.BetweenPoints(centroid, this.squarePolygon.points[2]);
    }

    public getDistanceFromTopToBottom(): number {
        return this.squaresize - 10;
    }

    public getCollisionPoints(): Phaser.Geom.Point[] {
        return [...this.squarePolygon.points];
    }
}
