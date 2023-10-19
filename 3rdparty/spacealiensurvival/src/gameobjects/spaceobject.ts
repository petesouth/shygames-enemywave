import Phaser from 'phaser';

// Constants derived from the polygon creation logic
const MAX_SIZE = 28;
const MIN_SIZE = 15;
const SCALE = 1.6;
const MIN_SIDES = 5;
const MAX_SIDES = 12;

export class SpaceObject {
    private graphics: Phaser.GameObjects.Graphics;
    private polygon: Phaser.Geom.Polygon;
    private velocity: Phaser.Math.Vector2;
    private scene: Phaser.Scene;
    private rotationSpeed: number; // Add this property
    private angle: number;
    private angularVelocity: number;
    private miniPolygons: Phaser.Geom.Polygon[] = [];
    private miniPolygonColors: number[] = [];



    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        // Initialize the angle and angular velocity properties
        this.angle = Phaser.Math.Between(0, 360); // Initial random angle
        this.angularVelocity = Phaser.Math.Between(-1, 2); // Adjust the range as needed for rotation speed

        // Initialize the rotation direction flag and speed
        this.rotationSpeed = Math.random() < 0.5 ? 1 : -1; // Random initial direction (-1 or 1)

        const x = Phaser.Math.Between(0, scene.scale.width);
        const y = Phaser.Math.Between(0, scene.scale.height);

        const sides = Phaser.Math.Between(MIN_SIDES, MAX_SIDES);
        const size = Phaser.Math.Between(MIN_SIZE, MAX_SIZE);
        const scale = SCALE; // Scaling factor

        const points = [];
        for (let i = 0; i < sides; i++) {
            // Add randomness to the point generation
            const varianceX = Phaser.Math.Between(-size * scale * 0.5, size * scale * 0.5);
            const varianceY = Phaser.Math.Between(-size * scale * 0.5, size * scale * 0.5);

            const px = Math.cos((i / sides) * 2 * Math.PI) * (size * scale + varianceX) + x;
            const py = Math.sin((i / sides) * 2 * Math.PI) * (size * scale + varianceY) + y;

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
        this.createMiniPolygons();
    }

    public renderSpaceObject(spaceObjects: SpaceObject[]) {
        // Update position and velocity
        this.polygon.setTo(this.polygon.points.map(point => {
            return new Phaser.Geom.Point(point.x + this.velocity.x, point.y + this.velocity.y);
        }));

        // Clamp the velocity magnitude to a maximum value
        const maxVelocityMagnitude = 7; // Adjust as needed
        const velocityMagnitude = this.velocity.length();

        if (velocityMagnitude > maxVelocityMagnitude) {
            this.velocity.normalize().scale(maxVelocityMagnitude);
        }

        // Wrap around the screen
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

        // Clear graphics and set fill style
        this.graphics.clear();
        this.graphics.fillStyle(0x777777); // Color Gray

        // Apply gradual rotation with the direction
        this.angle += this.rotationSpeed * this.angularVelocity;


        // Calculate rotated polygon points
        const rotatedPoints = this.polygon.points.map(point => {
            const rotatedX = Math.cos(Phaser.Math.DegToRad(this.angle)) * (point.x - this.getCentroid().x) - Math.sin(Phaser.Math.DegToRad(this.angle)) * (point.y - this.getCentroid().y) + this.getCentroid().x;
            const rotatedY = Math.sin(Phaser.Math.DegToRad(this.angle)) * (point.x - this.getCentroid().x) + Math.cos(Phaser.Math.DegToRad(this.angle)) * (point.y - this.getCentroid().y) + this.getCentroid().y;
            return new Phaser.Geom.Point(rotatedX, rotatedY);
        });

        // Draw the rotated polygon with both fill and stroke
        this.graphics.fillPoints(rotatedPoints, true);
        this.graphics.strokePoints(rotatedPoints, true);

        // Handle collisions with other SpaceObjects
        this.detectCollisions(spaceObjects);

        this.updateMiniPolygons();
    }

    public destroy() {
        this.graphics.clear();
        this.graphics.destroy();
    }

    public getObjectWidthHeight(): { width: number, height: number } {
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
                            // Calculate the repelling force direction
                            const repelDirection = new Phaser.Math.Vector2(
                                centroidSpaceObj.x - point.x,
                                centroidSpaceObj.y - point.y
                            ).normalize();

                            // Apply the repelling force
                            const repelForce = 0.1; // Adjust as needed
                            this.velocity.add(repelDirection.scale(repelForce));
                        }
                    }
                }
            }
        }
    }


    private updateMiniPolygons() {
        this.miniPolygons.forEach((miniPolygon, index) => {
            // Set the fill style to the pre-generated color
            this.graphics.fillStyle(this.miniPolygonColors[index]);

            const rotatedPoints = miniPolygon.points.map(point => {
                const rotatedX = Math.cos(Phaser.Math.DegToRad(this.angle)) * (point.x) - Math.sin(Phaser.Math.DegToRad(this.angle)) * (point.y) + this.getCentroid().x;
                const rotatedY = Math.sin(Phaser.Math.DegToRad(this.angle)) * (point.x) + Math.cos(Phaser.Math.DegToRad(this.angle)) * (point.y) + this.getCentroid().y;
                return new Phaser.Geom.Point(rotatedX, rotatedY);
            });

            this.graphics.fillPoints(rotatedPoints, true);
        });
    }

    private createMiniPolygons() {
        const rockWidth = this.getObjectWidthHeight().width;
        const rockHeight = this.getObjectWidthHeight().height;

        // Calculate an approximate area of the rock's boundary
        const rockArea = rockWidth * rockHeight;

        // Calculate the number of mini polygons based on the boundary area
        const numMiniPolygons = Phaser.Math.Between(20, 100) * (rockArea / 10000); // Adjust the factor (10000) as needed


        // Calculate the radius for distributing mini polygons evenly
        const maxRadius = Math.min(this.getObjectWidthHeight().width, this.getObjectWidthHeight().height) / 2;

        // Rest of your code to create mini polygons...
        let attempts = 0;
        const maxAttempts = 10;

        while (this.miniPolygons.length < numMiniPolygons && attempts < maxAttempts) {
            const points = [];
            const sides = Phaser.Math.Between(3, 6);
            // Adjust size as per your requirement
            const size = Phaser.Math.Between(5, 20);

            // Calculate polar coordinates for distributing mini polygons evenly
            const radius = Phaser.Math.Between(0, maxRadius - size); // Ensure mini polygons stay within the bounding circle
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);

            // Convert polar coordinates to Cartesian coordinates
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            for (let j = 0; j < sides; j++) {
                const px = Math.cos((j / sides) * 2 * Math.PI) * size + x;
                const py = Math.sin((j / sides) * 2 * Math.PI) * size + y;
                points.push(new Phaser.Geom.Point(px, py));
            }

            const miniPolygon = new Phaser.Geom.Polygon(points);

            if (this.isPolygonContained(miniPolygon, this.getPolygon())) {
                // Generate a random grayscale color
                const grayShade = Phaser.Math.Between(0x88, 0xCC); // Grayscale shade between light gray and dark gray

                // Set the fill style to the generated gray shade
                const fillStyle = grayShade * 0x10000 + grayShade * 0x100 + grayShade;

                this.miniPolygons.push(miniPolygon);
                this.miniPolygonColors.push(fillStyle);
            }

            attempts++;
        }
    }

    private isPolygonContained(smallPolygon: Phaser.Geom.Polygon, largePolygon: Phaser.Geom.Polygon): boolean {
        // Check if all points of the small polygon are within the large polygon
        const centroid = this.getCentroid();

        return smallPolygon.points.every(point => {
            const absolutePoint = new Phaser.Geom.Point(point.x + centroid.x, point.y + centroid.y);
            return Phaser.Geom.Polygon.ContainsPoint(largePolygon, absolutePoint);
        });
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