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

        
        for (const spaceObj of spaceObjects) {
            const collisionPoints = this.spaceShipShape.getPoints(3);
        
            for (let i = 0; i < collisionPoints.length; i++) {
                const x1 = collisionPoints[i].x;
                const y1 = collisionPoints[i].y;
                const x2 = collisionPoints[(i + 1) % collisionPoints.length].x;
                const y2 = collisionPoints[(i + 1) % collisionPoints.length].y;
        
                const distance = Phaser.Math.Distance.Between(x1, y1, spaceObj.getPolygon().points[0].x, spaceObj.getPolygon().points[0].y);
        
                if (distance < 40) {
                    // Calculate collision angle
                    const angle = Phaser.Math.Angle.Between(x1, y1, spaceObj.getPolygon().points[0].x, spaceObj.getPolygon().points[0].y);        
                    // Create Vector2 objects for velocity and position
                    const velocity1 = new Phaser.Math.Vector2(this.velocity.x, this.velocity.y);
                    const velocity2 = spaceObj.getVelocity().clone();
                    const position1 = new Phaser.Math.Vector2(x1, y1);
                    const position2 = { ...spaceObj.getPolygon().points[0] };
                    
                    // Calculate new velocities for both objects based on collision
                    const m1 = 1; // Mass of PlayerSpaceship (adjust as needed)
                    const m2 = 1; // Mass of SpaceObject (adjust as needed)
                    
                    const newVelocity1 = velocity1
                        .clone()
                        .scale((m1 - m2) / (m1 + m2))
                        .add(
                            velocity2
                                .clone()
                                .scale((2 * m2) / (m1 + m2))
                        );
                    
                    const newVelocity2 = velocity2
                        .clone()
                        .scale((m2 - m1) / (m1 + m2))
                        .add(
                            velocity1
                                .clone()
                                .scale((2 * m1) / (m1 + m2))
                        );
                
                    // Apply new velocities in opposite directions
                    this.velocity.set(newVelocity1.x, newVelocity1.y);
                    spaceObj.setVelocity(newVelocity2.x, newVelocity2.y);
                }
            }
        }
        

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
}
