import Phaser from 'phaser';
import { SpaceObject } from './spaceobject';
import { BaseSpaceship } from './basespaceship';

export class Mine {
    private point: Phaser.Geom.Point;
    private graphics: Phaser.GameObjects.Graphics;
    public isPopping: boolean = false;
    private popSize: number = 0;
    public hit: boolean = false;
    private lifeTimer: number = 10000;  // 10000 ms = 10 seconds
    private creationTime: number;


    constructor(private scene: Phaser.Scene, startX: number, startY: number) {
        this.graphics = scene.add.graphics();
        this.point = new Phaser.Geom.Point(startX, startY);
        this.creationTime = scene.time.now;
    }

    update() {
        this.graphics.clear();

        const currentTime = this.scene.time.now;
        if (currentTime - this.creationTime >= this.lifeTimer) {
            this.pop();
        }

        if (this.isPopping) {
            this.popSize += 2;
            if (this.popSize > 20) {
                this.destroy();
                return;
            }
        }
    }

    render() {
        this.graphics.clear();
        const colors = [0xffa500, 0xff4500];
        const chosenColor = Phaser.Utils.Array.GetRandom(colors);
        this.graphics.fillStyle(chosenColor);

        if (this.isPopping) {
            this.graphics.fillCircle(this.point.x, this.point.y, this.popSize);
        } else {
            this.graphics.fillCircle(this.point.x, this.point.y, 8);  // 5 pixel radius for a slightly bigger appearance
        }
    }

    handleSpaceObjectCollision(spaceObjects: SpaceObject[]): boolean {
        this.update();
        this.render();

        const minePoint = this.getPoint();

        for (const spaceObj of spaceObjects) {
            if (Phaser.Geom.Polygon.ContainsPoint(spaceObj.getPolygon(), minePoint)) {
                this.hit = true; // Set the hit flag
                this.pop();      // Start the pop animation
                break;           // Exit the loop
            }
        }
        
        // The mine is removed only when the animation is finished
        if (this.isPopping && this.popSize > 20) {
            this.destroy();
            return true;
        }

        return false;
    }

    handleBaseSpaceShipCollision(spaceShips: BaseSpaceship[]): boolean {
        this.update();
        this.render();

        const minePoint = this.getPoint();

        for (const spaceShip of spaceShips) {
            if (Phaser.Geom.Triangle.ContainsPoint(spaceShip.getTriangle(), minePoint)) {
                this.hit = true; // Set the hit flag
                this.pop();      // Start the pop animation
                break;           // Exit the loop
            }
        }
        
        // The mine is removed only when the animation is finished
        if (this.isPopping && this.popSize > 20) {
            this.destroy();
            return true;
        }

        return false;
    }

    pop() {
        this.isPopping = true;
    }

    destroy() {
        this.graphics.clear();
        this.graphics.destroy();
        this.isPopping = false;  // Reset the popping state
    }

    getPoint(): Phaser.Geom.Point {
        return this.point;
    }
}
