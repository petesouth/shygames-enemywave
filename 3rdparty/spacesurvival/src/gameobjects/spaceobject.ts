import Phaser from 'phaser';

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

        const sides = Phaser.Math.Between(5, 7);
        const size = Phaser.Math.Between(10, 20);
        const scale = 1.6; // Scaling factor

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

    private detectCollisions(spaceObjects: SpaceObject[]) {
        if (!this.hasCollided) {
            for (const spaceObj of spaceObjects) {
                if (spaceObj !== this) {
                    const collisionPoints = this.polygon.points;
    
                    for (let i = 0; i < collisionPoints.length; i++) {
                        const x1 = collisionPoints[i].x;
                        const y1 = collisionPoints[i].y;
                        const x2 = collisionPoints[(i + 1) % collisionPoints.length].x;
                        const y2 = collisionPoints[(i + 1) % collisionPoints.length].y;
    
                        const distance = Phaser.Math.Distance.Between(x1, y1, spaceObj.getPolygon().points[0].x, spaceObj.getPolygon().points[0].y);
    
                        if (distance < 30) {
                            const angle = Phaser.Math.Angle.Between(x1, y1, spaceObj.getPolygon().points[0].x, spaceObj.getPolygon().points[0].y) + Phaser.Math.RND.realInRange(-Math.PI / 4, Math.PI / 4);
    
                            // Random speed between slow and fast
                            const minSpeed = .2; // Adjust as needed
                            const maxSpeed = 3; // Adjust as needed
                            const newSpeed = Phaser.Math.RND.realInRange(minSpeed, maxSpeed);
    
                            // Calculate the new velocity based on the random speed
                            const velocity1 = this.velocity.clone().normalize().scale(newSpeed);
                            const velocity2 = spaceObj.getVelocity().clone().normalize().scale(newSpeed);
    
                            // Apply the new velocities
                            this.velocity.set(velocity1.x, velocity1.y);
                            spaceObj.setVelocity(velocity2.x, velocity2.y);
    
                            this.hasCollided = true;
                            spaceObj.hasCollided = true;
    
                            // Calculate the repulsion force to avoid sticking
                            const repulsionForce = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
                            repulsionForce.scale(1 / distance); // Inverse proportion to distance
    
                            // Apply the repulsion force to push the objects apart
                            this.velocity.add(repulsionForce);
                            spaceObj.getVelocity().subtract(repulsionForce);
                        }
                    }
                }
            }
        } else {
            this.hasCollided = false;
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
