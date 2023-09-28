import Phaser from 'phaser';
import { ExhaustFlame } from './exhaustflame';
import { SpaceObject } from './spaceobject';

export class PlayerSpaceship {
    private spaceShipShape: Phaser.Geom.Triangle;
    private innerSpaceShipShape: Phaser.Geom.Triangle;
    private graphics: Phaser.GameObjects.Graphics;
    private rotationRate: number = 0.2;
    private thrust: number = 0.5;
    private damping: number = 0.98;
    private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    private leftKey?: Phaser.Input.Keyboard.Key;
    private rightKey?: Phaser.Input.Keyboard.Key;
    private upKey?: Phaser.Input.Keyboard.Key;
    private scene: Phaser.Scene;
    private exhaustFlame: ExhaustFlame;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x808080 }, fillStyle: { color: 0xC0C0C0 } });

        const halfBaseWidth = 20;
        const halfHeight = 30;

        this.spaceShipShape = new Phaser.Geom.Triangle(
            400, 300 - halfHeight,
            400 - halfBaseWidth, 300 + halfHeight,
            400 + halfBaseWidth, 300 + halfHeight
        );

        this.innerSpaceShipShape = new Phaser.Geom.Triangle(
            400, 300 - halfHeight * 0.6,
            400 - halfBaseWidth * 0.7, 300 + halfHeight * 0.75,
            400 + halfBaseWidth * 0.7, 300 + halfHeight * 0.75
        );

        this.leftKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.upKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.exhaustFlame = new ExhaustFlame(scene, this.spaceShipShape);
    }

    updateSpaceshipState(spaceObjects: SpaceObject[]) {
        this.graphics.clear();
        const centroid = Phaser.Geom.Triangle.Centroid(this.spaceShipShape);
    
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
    
        this.detectCollisions(spaceObjects);
    
        this.graphics.strokeTriangleShape(this.spaceShipShape);
        this.graphics.fillTriangleShape(this.innerSpaceShipShape);
    
        if (this.upKey?.isDown) {
            this.exhaustFlame.show();
            this.exhaustFlame.update();
        } else {
            this.exhaustFlame.hide();
        }
    
        this.exhaustFlame.render();
    }
    

    private detectCollisions(spaceObjects: SpaceObject[]) {
        for (const spaceObj of spaceObjects) {
            const collisionPoints = [
                new Phaser.Geom.Point(this.spaceShipShape.x1, this.spaceShipShape.y1),
                new Phaser.Geom.Point(this.spaceShipShape.x2, this.spaceShipShape.y2),
                new Phaser.Geom.Point(this.spaceShipShape.x3, this.spaceShipShape.y3)
            ];
    
            const objPolygon = spaceObj.getPolygon().points;
    
            for (let i = 0; i < collisionPoints.length; i++) {
                for (let j = 0; j < objPolygon.length; j++) {
                    if (this.lineSegmentIntersects(collisionPoints[i], collisionPoints[(i + 1) % 3], objPolygon[j], objPolygon[(j + 1) % objPolygon.length])) {
                        const distance = Phaser.Math.Distance.BetweenPoints(collisionPoints[i], objPolygon[j]);
    
                        if (distance < 40) {
                            const angle = Phaser.Math.Angle.BetweenPoints(collisionPoints[i], objPolygon[j]);
                            const velocity1 = this.velocity.clone();
                            const velocity2 = spaceObj.getVelocity().clone();
    
                            const m1 = 1; 
                            const m2 = 1; 
    
                            const newVelocity1 = velocity1.clone().scale((m1 - m2) / (m1 + m2)).add(velocity2.clone().scale((2 * m2) / (m1 + m2)));
                            const newVelocity2 = velocity2.clone().scale((m2 - m1) / (m1 + m2)).add(velocity1.clone().scale((2 * m1) / (m1 + m2)));
    
                            this.velocity.set(newVelocity1.x, newVelocity1.y);
                            spaceObj.setVelocity(newVelocity2.x, newVelocity2.y);
                        }
                    }
                }
            }
        }
    }
    
    private lineSegmentIntersects(a: Phaser.Geom.Point, b: Phaser.Geom.Point, c: Phaser.Geom.Point, d: Phaser.Geom.Point): boolean {
        const det = (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
        if (det === 0) return false;
    
        const lambda = ((d.y - c.y) * (d.x - a.x) + (c.x - d.x) * (d.y - a.y)) / det;
        const gamma = ((a.y - b.y) * (d.x - a.x) + (b.x - a.x) * (d.y - a.y)) / det;
    
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
    
    
}
