import { Utils } from "../utils/utils";


export enum BaseExplodableState {
    ALIVE,
    EXPLODING,
    DESTROYED
}

export abstract class BaseExplodable {

    protected scene: Phaser.Scene;
    protected graphics: Phaser.GameObjects.Graphics;
    protected popSize: number = 0;
    protected maxPopSize: number = 10;
    protected _points: Phaser.Geom.Point[] = [];
    public state: BaseExplodableState = BaseExplodableState.ALIVE;
    protected explosionEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
    protected explosionColors: string[] = [ 'red', 'yellow', 'green' ];

    createExplosionEmitter() {
        const centroid = this.getCentroid();

        this.explosionEmitter = this.scene.add.particles(centroid.x, centroid.y, 'flares', {
            frame: this.explosionColors,
            lifespan: Utils.computeRatioValue(this.maxPopSize * 10),
            speed: { min: 150, max: 250 },
            scale: { start: 0.8, end: 0 },
            gravityY: 150,
            blendMode: 'ADD',
            emitting: false
        });
        this.explosionEmitter?.setPosition(this.getCentroid().x, this.getCentroid().y);
        this.explosionEmitter?.explode(16);
    }

    public getPoints(): Phaser.Geom.Point[] {
        return this._points;
    }

    public setPoints(value: Phaser.Geom.Point[]) {
        this._points = value;
    }

    constructor(scene: Phaser.Scene, graphics: Phaser.GameObjects.Graphics, points: Phaser.Geom.Point[] = []) {
        this.graphics = graphics
        this.scene = scene;
        this._points = points;
    }

    public respawn() {
        this.state = BaseExplodableState.ALIVE;
    }

    public explode() {
        this.state = BaseExplodableState.EXPLODING;
        this.playExplosionSound();
    }

    public destroy() {
        this.graphics.clear();
        this.state = BaseExplodableState.DESTROYED;
    }

    public playExplosionSound(): void {
        let explosionSound = this.scene.sound.add('explosion', { loop: false });
        explosionSound.play();
    }



    public abstract drawObjectAlive(): void;

    public drawObjectIsDead(): void {
    }

    public drawExplosion(): boolean {

        this.destroy();
        this.createExplosionEmitter();
        this.explosionEmitter?.explode(Utils.computeRatioValue(this.maxPopSize));
        return false;
    }

    public render() {
        this.graphics.clear();

        switch (this.state) {
            case BaseExplodableState.ALIVE:
                this.drawObjectAlive();
                break;
            case BaseExplodableState.EXPLODING:
                this.drawExplosion();
                break;
            case BaseExplodableState.DESTROYED:
                this.drawObjectIsDead();
                break;

        }



    }


    public getCentroid(): Phaser.Geom.Point {

        const { x, y } = this._points.reduce((acc, point) => ({
            x: acc.x + point.x,
            y: acc.y + point.y
        }), { x: 0, y: 0 });

        const centroidX = x / this._points.length;
        const centroidY = y / this._points.length;

        return new Phaser.Geom.Point(centroidX, centroidY);
    }

    public getObjectWidthHeight(): { width: number, height: number } {
        const maxX = Math.max(...this._points.map(point => point.x));
        const minX = Math.min(...this._points.map(point => point.x));
        const maxY = Math.max(...this._points.map(point => point.y));
        const minY = Math.min(...this._points.map(point => point.y));

        return {
            width: maxX - minX,
            height: maxY - minY
        };
    }

    public handleBaseCollision(target: { getCentroid(): Phaser.Geom.Point }, distanceTrigger: number): boolean {

        const sourcePoint = this.getCentroid();
        const targetPoint = target.getCentroid();

        if (this.state === BaseExplodableState.ALIVE) {
            const distance = Phaser.Math.Distance.BetweenPoints(sourcePoint, targetPoint);

            if (distanceTrigger >= distance) {
                this.explode();      // Start the pop animation
            }
        }


        return this.state !== BaseExplodableState.ALIVE;
    }


}