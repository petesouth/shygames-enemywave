

export enum BaseExplodableState {
    ALIVE,
    EXPLODING,
    DESTROYED
}

export abstract class BaseExplodable {

    protected scene: Phaser.Scene;
    protected graphics: Phaser.GameObjects.Graphics;
    protected popSize: number = 0;
    protected maxPopSize: number = 30;
    protected explosionColors: number[] = [0xffa500, 0xff4500];
    protected _points: Phaser.Geom.Point[] = [];
    public state: BaseExplodableState = BaseExplodableState.ALIVE;

    public getPoints(): Phaser.Geom.Point[] {
        return this._points;
    }

    public setPoints(value: Phaser.Geom.Point[]) {
        this._points = value;
    }

    constructor( scene: Phaser.Scene,  graphics: Phaser.GameObjects.Graphics, points: Phaser.Geom.Point[] = []) {
        this.graphics = graphics
        this.scene = scene;
        this._points = points;
    }

    public respawn() {
        this.state = BaseExplodableState.ALIVE;
    }

    public explode() {
        this.state = BaseExplodableState.EXPLODING;
    }

    public destroy() {
        this.state = BaseExplodableState.DESTROYED;
    }

  
    public abstract drawObjectAlive() : void;

    public drawObjectIsDead() : void {
        // NO OP
    }

    public drawExplosion() : boolean {

        this.popSize += 2;
        if (this.popSize > this.maxPopSize) {
            this.destroy();
            return true;
        }

        const chosenColor = Phaser.Utils.Array.GetRandom(this.explosionColors);
        this.graphics.fillStyle(chosenColor);

        const theCenter = this.getCentroid();
        this.graphics.fillCircle(theCenter.x, theCenter.y, this.popSize);
        return false;
    }

    public render() {
        this.graphics.clear();

        switch(this.state) {
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

    public handleBaseCollision(target: {  getCentroid(): Phaser.Geom.Point }, distanceTrigger: number): boolean {

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