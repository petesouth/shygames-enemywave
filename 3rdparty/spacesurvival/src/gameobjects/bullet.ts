import Phaser from 'phaser';
import { SpaceObject } from './spaceobject';

export class Bullet {
    private point: Phaser.Geom.Point;
    private graphics: Phaser.GameObjects.Graphics;
    private direction: Phaser.Math.Vector2;
    private speed: number = 10;  // adjust for desired bullet speed
    private distanceTraveled: number = 0;
    private maxDistance: number;
    public isPopping: boolean = false;
    private popSize: number = 0;
    public hit: boolean = false; // Add this line at the top with other properties


    constructor(private scene: Phaser.Scene, startX: number, startY: number, angle: number) {
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


    private handleScreenWrap() {
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

    render() {
        console.log("Bullet render");
        this.graphics.clear();
        const colors = [0xffa500, 0xff4500];
        const chosenColor = Phaser.Utils.Array.GetRandom(colors);
        this.graphics.fillStyle(chosenColor);

        if (this.isPopping) {
            this.graphics.fillCircle(this.point.x, this.point.y, this.popSize);
        } else {
            this.graphics.fillCircle(this.point.x, this.point.y, 4);  // 4 pixel radius
        }
    }

    process(spaceObjects: SpaceObject[]): boolean {
        this.update();
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
