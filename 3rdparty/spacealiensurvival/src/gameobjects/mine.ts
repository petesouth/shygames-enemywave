import Phaser from 'phaser';
import { BaseExplodable } from './baseExplodable';

export class Mine extends BaseExplodable {
    private lifeTimer: number = 10000;  // 10000 ms = 10 seconds
    private creationTime: number;


    constructor(scene: Phaser.Scene, startX: number, startY: number) {
        super( scene, [new Phaser.Geom.Point(startX, startY)]);

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

    public render() {
        console.log("Bullet render");
        this.update();
        
        if (this.isPopping) {
            this.renderExplosion();
        } else {
            const chosenColor = Phaser.Utils.Array.GetRandom(this.colors);
            this.graphics.fillStyle(chosenColor);
            const theCenter = this.getCentroid();
            this.graphics.fillCircle(theCenter.x, theCenter.y, 8);  // 4 pixel radius
        }
    }


    
}
