import Phaser from 'phaser';
import { BaseExplodable } from './baseExplodable';

export class Mine extends BaseExplodable {
    private flameParticles: Phaser.GameObjects.Particles.ParticleEmitter;
    private lifeTimer: number = 5000;  // 10000 ms = 10 seconds
    private creationTime: number;
    protected colors: number[] = [0xffa500, 0xff4500];
   
    constructor(scene: Phaser.Scene, startX: number, startY: number) {
        super( scene, scene.add.graphics(), [new Phaser.Geom.Point(startX, startY)]);

        this.flameParticles = this.createFlameEmitter(this.colors, startX, startY);
        this.flameParticles.start();
        this.creationTime = Date.now();
    }

    private createFlameEmitter(colors: number[], x: number, y: number): Phaser.GameObjects.Particles.ParticleEmitter {
        
        // Create the particle emitter
        return this.scene.add.particles(x, y, 'flares', {
            frame: [ 'red', 'yellow', 'green'],
            color: [ 0xfacc22, 0xf89800, 0xf83600, 0x9f0404 ],
            lifespan: 2,
            angle: { min: -140, max: -120 },
            scale: { start: 1, end: 0, ease: 'sine.in' },
            alpha: { start: 1, end: 0, ease: 'sine.in' },
            speed: { min: 250, max: 350 },
            blendMode: 'ADD',
            visible: true
        });
        
    }
    public drawExplosion(): boolean {
        this.flameParticles.setVisible(false);
        this.flameParticles.destroy();
        return super.drawExplosion();
    }

    public drawObjectAlive() : void {

        const currentTime = Date.now();
        if (currentTime - this.creationTime >= this.lifeTimer) {
            this.explode();

        }

    }

    

    
}
