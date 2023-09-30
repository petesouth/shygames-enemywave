import Phaser from 'phaser';


// Constants derived from the polygon creation logic
const MAX_SIZE = 20;
const MIN_SIZE = 8;
const SCALE = 1.6;
const MIN_SIDES = 5;
const MAX_SIDES = 12;

export class SpaceObject {
    private graphics: Phaser.GameObjects.Graphics;
    private polygon: Phaser.Geom.Polygon;
    private velocity: Phaser.Math.Vector2;
    private scene: Phaser.Scene;
    private hasCollided: boolean = false; // Flag to track collision

    constructor(scene: Phaser.Scene) {
        this.scene = scene;


        const x = Phaser.Math.Between(0, scene.scale.width);
        const y = Phaser.Math.Between(0, scene.scale.height);

        const sides = Phaser.Math.Between(MIN_SIDES, MAX_SIDES);
        const size = Phaser.Math.Between(MIN_SIZE, MAX_SIZE);
        const scale = SCALE; // Scaling factor

        const points = [];

        for (let i = 0; i < sides; i++) {
            const px = Math.cos((i / sides) * 2 * Math.PI) * size * scale + x;
            const py = Math.sin((i / sides) * 2 * Math.PI) * size * scale + y;
            points.push(new Phaser.Geom.Point(px, py));
        }

        this.polygon = new Phaser.Geom.Polygon(points);

        this.velocity = new Phaser.Math.Vector2(
            Phaser.Math.Between(-50, 50) / 100,
            Phaser.Math.Between(-50, 50) / 100
        );

        // Create a graphics object with the desired line color
        this.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x777777 } });

        // Set the fill style to match the line color
        this.graphics.fillStyle(0x777777);

        // Draw the polygon with both fill and stroke
        this.graphics.fillPoints(this.polygon.points, true);
        this.graphics.strokePoints(this.polygon.points, true);
    }

    update(spaceObjects: SpaceObject[]) {
        this.polygon.setTo(this.polygon.points.map(point => {
            return new Phaser.Geom.Point(point.x + this.velocity.x, point.y + this.velocity.y);
        }));

        // Clamp the velocity magnitude to a maximum value
        const maxVelocityMagnitude = 7; // Adjust as needed
        const velocityMagnitude = this.velocity.length();

        if (velocityMagnitude > maxVelocityMagnitude) {
            this.velocity.normalize().scale(maxVelocityMagnitude);
        }

        const maxX = Math.max(...this.polygon.points.map(point => point.x));
        const minX = Math.min(...this.polygon.points.map(point => point.x));
        const maxY = Math.max(...this.polygon.points.map(point => point.y));
        const minY = Math.min(...this.polygon.points.map(point => point.y));

        if (maxX < 0) {
            this.polygon.setTo(this.polygon.points.map(point => new Phaser.Geom.Point(point.x + this.scene.scale.width, point.y)));
        } else if (minX > this.scene.scale.width) {
            this.polygon.setTo(this.polygon.points.map(point => new Phaser.Geom.Point(point.x - this.scene.scale.width, point.y)));
        }

        if (maxY < 0) {
            this.polygon.setTo(this.polygon.points.map(point => new Phaser.Geom.Point(point.x, point.y + this.scene.scale.height)));
        } else if (minY > this.scene.scale.height) {
            this.polygon.setTo(this.polygon.points.map(point => new Phaser.Geom.Point(point.x, point.y - this.scene.scale.height)));
        }

        this.graphics.clear();

        this.graphics.fillStyle(0x777777);

        // Draw the polygon with both fill and stroke
        this.graphics.fillPoints(this.polygon.points, true);
        this.graphics.strokePoints(this.polygon.points, true);

        // Handle collisions with other SpaceObjects
        this.detectCollisions(spaceObjects);
    }

    public destroy () {
        this.graphics.clear();
        this.graphics.destroy();
    }

    public getSpaceObjectWidthHeight(): { width: number, height: number } {
        const maxX = Math.max(...this.polygon.points.map(point => point.x));
        const minX = Math.min(...this.polygon.points.map(point => point.x));
        const maxY = Math.max(...this.polygon.points.map(point => point.y));
        const minY = Math.min(...this.polygon.points.map(point => point.y));

        return {
            width: maxX - minX,
            height: maxY - minY
        };
    }

    
    public static getMaxSpaceObjectWidthHeight(): { width: number, height: number } {
        const maxDiameter = MAX_SIZE * SCALE * 2; // Diameter = 2 * Radius
        return {
            width: maxDiameter,
            height: maxDiameter
        };
    }

    public getCentroid(): Phaser.Geom.Point {
        return this.getCentroidOfPolygon(this.polygon);
    }

    private getCentroidOfPolygon(polygon: Phaser.Geom.Polygon): Phaser.Geom.Point {
        const { x, y } = polygon.points.reduce((acc, point) => ({
            x: acc.x + point.x,
            y: acc.y + point.y
        }), { x: 0, y: 0 });

        const centroidX = x / polygon.points.length;
        const centroidY = y / polygon.points.length;

        return new Phaser.Geom.Point(centroidX, centroidY);
    }

    private detectCollisions(spaceObjects: SpaceObject[]) {
        const centroidSpaceObj = this.getCentroid();
        for (const spaceObj of spaceObjects) {
            if (spaceObj !== this) {
                const collisionPoints = spaceObj.getPolygon().points;
    
                for (let point of collisionPoints) {
                    if (Phaser.Geom.Polygon.ContainsPoint(this.getPolygon(), point)) {
                        const distance = Phaser.Math.Distance.BetweenPoints(point, centroidSpaceObj);
    
                        if (distance < 40) {
                            const angle = Phaser.Math.Angle.BetweenPoints(centroidSpaceObj, spaceObj.getCentroid());
    
                            // Apply collision response logic here
                            const velocity1 = this.getVelocity().clone();
                            const velocity2 = spaceObj.getVelocity().clone();
    
                            const m1 = 1; // Mass for SpaceObject. Adjust if needed
                            const m2 = 1; // Mass for SpaceObject. Adjust if needed
    
                            const newVelocity1 = velocity1.clone().scale((m1 - m2) / (m1 + m2)).add(velocity2.clone().scale((2 * m2) / (m1 + m2)));
                            const newVelocity2 = velocity2.clone().scale((m2 - m1) / (m1 + m2)).add(velocity1.clone().scale((2 * m1) / (m1 + m2)));
    
                            // Ensure a minimum velocity to avoid standing still
                            const minVelocity = 0.1; // Adjust as needed
                            if (newVelocity1.length() < minVelocity) {
                                newVelocity1.normalize().scale(minVelocity);
                            }
                            if (newVelocity2.length() < minVelocity) {
                                newVelocity2.normalize().scale(minVelocity);
                            }
    
                            this.setVelocity(newVelocity1.x, newVelocity1.y);
                            spaceObj.setVelocity(newVelocity2.x, newVelocity2.y);
                        }
                    }
                }
            }
        }
    }
    
    

    getPolygon() {
        return this.polygon;
    }

    getVelocity() {
        return this.velocity;
    }

    setVelocity(x: number, y: number) {
        this.velocity.set(x, y);
    }
}
