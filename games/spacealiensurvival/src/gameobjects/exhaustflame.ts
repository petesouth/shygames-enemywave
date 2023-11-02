// gameobjects/exhaustflame.ts
import Phaser from 'phaser';
import { BaseSpaceshipDisplay } from './basespaceshipdisplay';

export class ExhaustFlame {
    private flameParticles: Phaser.GameObjects.Particles.ParticleEmitter;
    private base: BaseSpaceshipDisplay;
    public visible: boolean = false;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, base: BaseSpaceshipDisplay, colors: number[]) {
        this.base = base;
        this.scene = scene;
        this.flameParticles = this.createFlameEmitter(colors);
        this.visible = false;
        this.flameParticles.stop();  // Stop emitting particles
    
    }

    private createFlameEmitter(colors: number[]): Phaser.GameObjects.Particles.ParticleEmitter {
        // Calculate position
        const centroid = this.base.getCentroid();
        const angle = this.base.getReverseAngle();
        const distance = this.base.getDistanceFromTopToBottom() + 5;
        const x = centroid.x + distance * Math.cos(angle);
        const y = centroid.y + distance * Math.sin(angle);

        // Create the particle emitter
        return this.scene.add.particles(x, y, 'flares',
        {
            frame: 'white',
            color:  colors,
            colorEase: 'quad.out',
            lifespan: 600,
            angle: { min: angle - 1, max: angle + 1 },
            scale: { start: 0.35, end: 0, ease: 'sine.out' },  // halved the start value
            speed: 100,
            advance: 2000,
            blendMode: 'ADD',
            visible: false
        });
        
    }


    

    show() {
        this.visible = true;
        this.flameParticles.setVisible(true);
        this.flameParticles.start();  // Start emitting particles
    }

    hide() {
        this.visible = false;
        this.flameParticles.stop();  // Stop emitting particles
    }

    destroy() {
        this.flameParticles.stop();
        this.flameParticles.setVisible(false);
        this.flameParticles.destroy();
        this.visible = false;
    }

    update() {
        if (!this.visible) {
            return;
        }

        // Update emitter position and angle
        const centroid = this.base.getCentroid();
        const angle = this.base.getReverseAngle();
        const distance = this.base.getDistanceFromTopToBottom() + 5;
        const x = centroid.x + distance * Math.cos(angle);
        const y = centroid.y + distance * Math.sin(angle);
        this.flameParticles.setPosition(x, y);
        this.flameParticles.setRotation(angle);  // Update the emitter rotation in radians
    }

    render() {
        // NO OP its just for compatibility
    }
}
