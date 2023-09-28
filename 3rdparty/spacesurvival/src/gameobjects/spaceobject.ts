import Phaser from 'phaser';

export class SpaceObject {
    private graphics: Phaser.GameObjects.Graphics;
    private polygon: Phaser.Geom.Polygon;
    private velocity: Phaser.Math.Vector2;
    private scene: Phaser.Scene;

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

        this.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0xFFFFFF } });
    }

    update(spaceObjects: SpaceObject[]) {
        this.polygon.setTo(this.polygon.points.map(point => {
            return new Phaser.Geom.Point(point.x + this.velocity.x, point.y + this.velocity.y);
        }));

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
        this.graphics.strokePoints(this.polygon.points, true);
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
