import Phaser from 'phaser';
import { Bullet } from './bullet';
import { BaseSpaceship } from './basespaceship';

export class Missile extends Bullet {
    private target: BaseSpaceship | null = null;
    private lifespan: number = 20 * 1000;
    private startTime: number;

    constructor(scene: Phaser.Scene, startX: number, startY: number, angle: number) {
        super(scene, startX, startY, angle);
        this.startTime = scene.time.now;
        this.colors = [0xffffff, 0xff4500];
        this.explosionColors = ["red", "white"]
        this.speed = 4;
    }

    public drawObjectAlive() : void {
        if (this.target) {
            const targetPoint = this.target.getCentroid();
            const angleToTarget = Phaser.Math.Angle.BetweenPoints(this.getCentroid(), targetPoint);
            this.direction.setTo(Math.cos(angleToTarget), Math.sin(angleToTarget));
        }

        // Adjust the missile's speed (slower by half)
        super.drawObjectAlive();

        if (this.scene.time.now - this.startTime > this.lifespan) {
            this.explode();
        }
    }

    setTarget(target: BaseSpaceship) {
        this.target = target;
    }
}
