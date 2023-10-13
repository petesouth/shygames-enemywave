


export class BaseExplodable {

    protected scene: Phaser.Scene;
    protected graphics: Phaser.GameObjects.Graphics;
    protected isPopping: boolean = false;
    protected popSize: number = 0;
    public hit: boolean = false; // Add this line at the top with other properties
    protected colors: number[] = [0xffa500, 0xff4500];
    protected _points: Phaser.Geom.Point[] = [];

    public get points(): Phaser.Geom.Point[] {
        return this._points;
    }

    public set points(value: Phaser.Geom.Point[]) {
        this._points = value;
    }

    constructor( scene: Phaser.Scene, points: Phaser.Geom.Point[] = []) {
        this.graphics = scene.add.graphics();
        this.scene = scene;
        this.points = points;
    }

    pop() {
        console.log("Pop called");
        this.isPopping = true;
    }

    public destroy() {
        console.log("Destroy called");
        this.graphics.clear();
        this.graphics.destroy();
        this.isPopping = false;  // Reset the popping state
    }




    public handleBaseCollision(target: {  getCentroid(): Phaser.Geom.Point }, distanceTrigger: number): boolean {

        const sourcePoint = this.getCentroid();
        const targetPoint = target.getCentroid();

        if (!this.hit) {
            const distance = Phaser.Math.Distance.BetweenPoints(sourcePoint, targetPoint);

            if (distanceTrigger >= distance) {
                this.hit = true; // Set the hit flag
                this.pop();      // Start the pop animation
            }
        }

        // The bullet is removed only when the animation is finished
        if ((this.isPopping && this.popSize > 30) || (this.hit && !this.isPopping)) {
            this.destroy();
            return true;
        }

        return false;
    }

    public renderExplosion() {

        this.popSize += 2;
        if (this.popSize > 20) {
            this.destroy();
            return;
        }

        const chosenColor = Phaser.Utils.Array.GetRandom(this.colors);
        this.graphics.fillStyle(chosenColor);

        const theCenter = this.getCentroid();
        this.graphics.fillCircle(theCenter.x, theCenter.y, this.popSize);
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

}