import Phaser from 'phaser';
import { SpaceObject } from './spaceobject';
import { BaseSpaceship } from './basespaceship';
import { BaseExplodable } from './baseExplodable';

export class Bullet extends BaseExplodable {
    protected direction: Phaser.Math.Vector2;
    protected speed: number = 10;  // adjust for desired bullet speed
    protected distanceTraveled: number = 0;
    protected maxDistance: number;

    constructor(protected scene: Phaser.Scene, startX: number, startY: number, angle: number) {
        super(scene, [new Phaser.Geom.Point(startX, startY)]);

        this.direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
        this.maxDistance = .5 * ((scene.scale.width >= scene.scale.height) ? scene.scale.width : scene.scale.height);
    }

    protected handleScreenWrap() {
        if (this.getCentroid().x < 0) {
            this.points[0].x += this.scene.scale.width;
        } else if (this.getCentroid().x > this.scene.scale.width) {
            this.points[0].x -= this.scene.scale.width;
        }

        if (this.getCentroid().y < 0) {
            this.points[0].y += this.scene.scale.height;
        } else if (this.getCentroid().y > this.scene.scale.height) {
            this.points[0].y -= this.scene.scale.height;
        }
    }

    public update() {
        this.graphics.clear();
        if (!this.isPopping && this.hit === false) {
            const dx = this.direction.x * this.speed;
            const dy = this.direction.y * this.speed;
            this.points[0].x += dx;
            this.points[0].y += dy;
            this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);
            
            // Check if the bullet has reached the maximum distance
            if (this.distanceTraveled >= this.maxDistance) {
                this.pop();
            }
        }
        
        this.handleScreenWrap();
    }
    


    public render() {
        this.update();

        if (this.isPopping) {
            this.renderExplosion();
        } else {
            const chosenColor = Phaser.Utils.Array.GetRandom(this.colors);
            this.graphics.fillStyle(chosenColor);
            const theCenter = this.getCentroid();
            this.graphics.fillCircle(theCenter.x, theCenter.y, 4);  // 4 pixel radius
        }
    }



}
