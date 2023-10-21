// gameobjects/exhaustflame.ts
import Phaser from 'phaser';

class FlamePoint extends Phaser.Geom.Point {
    visible: boolean = true;
}

export class ExhaustFlame {
    private points: FlamePoint[];
    private graphics: Phaser.GameObjects.Graphics;
    private visible: boolean = false;
    private base: {
        getCentroid(): Phaser.Geom.Point,
        getReverseAngle(): number,
        getDistanceFromTopToBottom(): number
    };
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, base: {
        getCentroid(): Phaser.Geom.Point,
        getReverseAngle(): number,
        getDistanceFromTopToBottom(): number
    }) {
        this.base = base;
        this.scene = scene;
        this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0xffcc00 } });
        this.points = [];
        for (let i = 0; i < 5; i++) {
            this.points.push(new FlamePoint());
        }
    }

    show() {
        this.visible = true;

    }

    hide() {
        this.graphics.clear();
        this.visible = false;
    }

    destroy() {
        this.graphics.clear();
        this.graphics.destroy();
        this.visible = false;
    }

    update() {
        const centroid = this.base.getCentroid();

        const angle = this.base.getReverseAngle();
        const distance = this.base.getDistanceFromTopToBottom();

        const activeDots = Phaser.Math.Between(1, 3); // Randomly choose between 1 and 4 dots for sputtering effect

        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];

            if (i < activeDots) {
                const offset = (i - (this.points.length / 2)) * 10 + 34;
                point.x = centroid.x + (distance + offset) * Math.cos(angle);
                point.y = centroid.y + (distance + offset * 2.5) * Math.sin(angle);
            } else {
                point.x = -10; // Move the inactive dots off screen
                point.y = -10;
            }
        }
    }


    render() {
        this.graphics.clear();

        if (!this.visible) {
            return;
        }

        this.points.forEach((point) => {
            const colors = [0xffa500, 0xff4500, 0xffd700, 0xff8c00]; // Colors representing fire: orange, red-orange, gold, dark orange
            const chosenColor = Phaser.Utils.Array.GetRandom(colors); // Pick a random color from the list

            this.graphics.fillStyle(chosenColor);

            if (point.visible) {
                this.graphics.fillPointShape(point, 8);
            }
        });
    }
}
