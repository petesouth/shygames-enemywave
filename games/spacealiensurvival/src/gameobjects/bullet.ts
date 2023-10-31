import Phaser from 'phaser';
import { BaseExplodable } from './baseExplodable';

export class Bullet extends BaseExplodable {
   
    protected direction: Phaser.Math.Vector2;
    protected speed: number = 10;  // adjust for desired bullet speed
    protected distanceTraveled: number = 0;
    protected maxDistance: number;
    protected colors: number[] = [0xffa500, 0xff4500];
   
    constructor(protected scene: Phaser.Scene, startX: number, startY: number, angle: number) {
        super(scene, scene.add.graphics(),[new Phaser.Geom.Point(startX, startY)]);

        this.direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
        this.maxDistance = .5 * ((scene.scale.width >= scene.scale.height) ? scene.scale.width : scene.scale.height);
    }

    protected handleScreenWrap() {
        if (this.getCentroid().x < 0) {
            this._points[0].x += this.scene.scale.width;
        } else if (this.getCentroid().x > this.scene.scale.width) {
            this._points[0].x -= this.scene.scale.width;
        }

        if (this.getCentroid().y < 0) {
            this._points[0].y += this.scene.scale.height;
        } else if (this.getCentroid().y > this.scene.scale.height) {
            this._points[0].y -= this.scene.scale.height;
        }
    }
    

    public drawObjectAlive() {
            const dx = this.direction.x * this.speed;
            const dy = this.direction.y * this.speed;
            this._points[0].x += dx;
            this._points[0].y += dy;
            this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);
            
            // Check if the bullet has reached the maximum distance
            if (this.distanceTraveled >= this.maxDistance) {
                this.explode();
            }

            const chosenColor = Phaser.Utils.Array.GetRandom(this.colors);
            this.graphics.fillStyle(chosenColor);
            const theCenter = this.getCentroid();
            this.graphics.fillCircle(theCenter.x, theCenter.y, 4);  // 4 pixel radius
            this.handleScreenWrap();
    }

   

}
