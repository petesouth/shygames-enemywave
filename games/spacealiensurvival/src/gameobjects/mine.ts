import Phaser from 'phaser';
import { BaseExplodable } from './baseExplodable';

export class Mine extends BaseExplodable {
    private lifeTimer: number = 10000;  // 10000 ms = 10 seconds
    private creationTime: number;


    constructor(scene: Phaser.Scene, startX: number, startY: number) {
        super( scene, scene.add.graphics(), [new Phaser.Geom.Point(startX, startY)]);

        this.creationTime = scene.time.now;
        this.maxPopSize = 40;
        
    }


    public drawObjectAlive() : void {

        const currentTime = this.scene.time.now;
        if (currentTime - this.creationTime >= this.lifeTimer) {
            this.explode();
        }

        const chosenColor = Phaser.Utils.Array.GetRandom(this.explosionColors);
        this.graphics.fillStyle(chosenColor);
        const theCenter = this.getCentroid();
        this.graphics.fillCircle(theCenter.x, theCenter.y, 8);  // 4 pixel radius
       
    }

    

    
}
