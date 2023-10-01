import Phaser from 'phaser';
import { ExhaustFlame } from './exhaustflame';
import { SpaceObject } from './spaceobject';
import { ForceField } from './forcefield';
import { Bullet } from './bullet';
import {Mine} from "./mine";


const halfBaseWidth = 10;
const halfHeight = 15;

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
    private shieldKey?: Phaser.Input.Keyboard.Key;
    private forceField: ForceField;
    private fireKey?: Phaser.Input.Keyboard.Key;
    private mineKey?: Phaser.Input.Keyboard.Key;
    
    private mines: Mine[] = [];
    private bullets: Bullet[] = [];
    private lastFired: number = 0;
    private fireRate: number = 200;  // 1000 ms = 1 second

    private lastMinePlaced: number = 0;
    private mineRate: number = 1000;  // 1000 ms = 1 second


    private scene: Phaser.Scene;
    private exhaustFlame: ExhaustFlame;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x808080 }, fillStyle: { color: 0xC0C0C0 } });

        

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
        this.shieldKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        
        this.forceField = new ForceField(scene, this);
        this.exhaustFlame = new ExhaustFlame(scene, this.spaceShipShape);
        this.fireKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.mineKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.M);


    }

    public getTriangle() {
        return this.spaceShipShape;
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

        if (this.shieldKey?.isDown) {
            this.forceField.show();
        } else {
            this.forceField.hide();
        }
    
        this.forceField.update();
        this.forceField.render();
    }

    public handleBullets(spaceObjects: SpaceObject[]) {
        const currentTime = this.scene.time.now;

        if (this.fireKey?.isDown && (currentTime - this.lastFired > this.fireRate)) {
            const centroid = Phaser.Geom.Triangle.Centroid(this.spaceShipShape);
            const angle = Math.atan2(this.spaceShipShape.y1 - centroid.y, this.spaceShipShape.x1 - centroid.x);
            const bullet = new Bullet(this.scene, this.spaceShipShape.x1, this.spaceShipShape.y1, angle);
            this.bullets.push(bullet);
            this.lastFired = currentTime;
        }

        for (let i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].process(spaceObjects)) {
                this.bullets.splice(i, 1);
                i--; // Adjust the index after removing an element
          
            }
        }
    }

    public handleMines(spaceObjects: SpaceObject[]) {
        const currentTime = this.scene.time.now;
        
        if (this.mineKey?.isDown && (currentTime - this.lastMinePlaced > this.mineRate)) {
            const x = this.getPositionX();
            const y = this.getPositionY();
            const mine = new Mine(this.scene, x, y);
            this.mines.push(mine);
            this.lastMinePlaced = currentTime;
        }
        
        for (let i = 0; i < this.mines.length; i++) {
            if (this.mines[i].process(spaceObjects)) {
                this.mines.splice(i, 1);
                i--; // Adjust the index after removing an element
            }
        }
    }
    

     // Add a method to get the X position of the spaceship's centroid
     public getPositionX(): number {
        return Phaser.Geom.Triangle.Centroid(this.spaceShipShape).x;
    }

    // Add a method to get the Y position of the spaceship's centroid
    public getPositionY(): number {
        return Phaser.Geom.Triangle.Centroid(this.spaceShipShape).y;
    }
    

    private detectCollisions(spaceObjects: SpaceObject[]) {
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
        
                    if (distance < (halfBaseWidth *2)) {
                        const angle = Phaser.Math.Angle.BetweenPoints(centroidSpaceShip, centroidSpaceObj);
                        const velocity1 = this.velocity.clone();``
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
    
        
    
}
