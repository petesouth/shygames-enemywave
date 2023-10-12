import Phaser from 'phaser';
import { SpaceObject } from './spaceobject';
import { BaseSpaceship } from './basespaceship';

export class Bullet {
    protected point: Phaser.Geom.Point;
    protected graphics: Phaser.GameObjects.Graphics;
    protected direction: Phaser.Math.Vector2;
    protected speed: number = 10;  // adjust for desired bullet speed
    protected distanceTraveled: number = 0;
    protected maxDistance: number;
    public isPopping: boolean = false;
    protected popSize: number = 0;
    public hit: boolean = false; // Add this line at the top with other properties
    protected colors: number [] = [0xffa500, 0xff4500];
        
    constructor(protected scene: Phaser.Scene, startX: number, startY: number, angle: number) {
        this.graphics = scene.add.graphics();
        this.point = new Phaser.Geom.Point(startX, startY);
        this.direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
        this.maxDistance = .5 * (( scene.scale.width >= scene.scale.height ) ? scene.scale.width : scene.scale.height);
    }

    update() {
        this.graphics.clear();
        if (this.isPopping) {
            this.popSize += 2;
            if (this.popSize > 20) {
                this.destroy();
                return;
            }
        } else {
            const dx = this.direction.x * this.speed;
            const dy = this.direction.y * this.speed;
            this.point.x += dx;
            this.point.y += dy;
            this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);
            if (this.distanceTraveled >= this.maxDistance) {
                this.pop();
            }
        }

        this.handleScreenWrap();
    }


    protected handleScreenWrap() {
        if (this.point.x < 0) {
            this.point.x += this.scene.scale.width;
        } else if (this.point.x > this.scene.scale.width) {
            this.point.x -= this.scene.scale.width;
        }

        if (this.point.y < 0) {
            this.point.y += this.scene.scale.height;
        } else if (this.point.y > this.scene.scale.height) {
            this.point.y -= this.scene.scale.height;
        }
    }

    public render() {
        console.log("Bullet render");
        this.update();
        const chosenColor = Phaser.Utils.Array.GetRandom(this.colors);
        this.graphics.fillStyle(chosenColor);

        if (this.isPopping) {
            this.graphics.fillCircle(this.point.x, this.point.y, this.popSize);
        } else {
            this.graphics.fillCircle(this.point.x, this.point.y, 4);  // 4 pixel radius
        }
    }

    public handleSpaceObjectCollision(spaceObjects: SpaceObject[]): boolean {
        
        this.render();
        const bulletPoint = this.getPoint();
    
        if (!this.hit) {
            for (const spaceObj of spaceObjects) {
                if (Phaser.Geom.Polygon.ContainsPoint(spaceObj.getPolygon(), bulletPoint)) {
                    this.hit = true; // Set the hit flag
                    this.pop();      // Start the pop animation
                    break;           // Exit the loop
                }
            }
        }
    
        // The bullet is removed only when the animation is finished
        if ((this.isPopping && this.popSize > 20) || (this.hit && !this.isPopping)) {
            this.destroy();
            return true;
        }
    
        return false;
    }


    public handleBaseSpaceshipsCollision(spaceShips: BaseSpaceship[]): boolean {
        
        this.render();
        const bulletPoint = this.getPoint();
    
        if (!this.hit) {
            for (const spaceShip of spaceShips) {
                if (Phaser.Geom.Triangle.ContainsPoint(spaceShip.getTriangle(), bulletPoint)) {
                    this.hit = true; // Set the hit flag
                    this.pop();      // Start the pop animation
                    break;           // Exit the loop
                }
            }
        }
    
        // The bullet is removed only when the animation is finished
        if ((this.isPopping && this.popSize > 20) || (this.hit && !this.isPopping)) {
            this.destroy();
            return true;
        }
    
        return false;
    }

    

    pop() {
        console.log("Pop called");
        this.isPopping = true;
    }

    destroy() {
        console.log("Destroy called");
        this.graphics.clear();
        this.graphics.destroy();
        this.isPopping = false;  // Reset the popping state
    }

    getPoint(): Phaser.Geom.Point {
        return this.point;
    }
}
