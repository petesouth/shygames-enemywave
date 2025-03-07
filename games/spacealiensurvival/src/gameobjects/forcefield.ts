// forcefield.ts
import Phaser from 'phaser';
import { BaseSpaceship } from './basespaceship';

export class ForceField {
    private graphics: Phaser.GameObjects.Graphics;
    private circle: Phaser.Geom.Circle;
    private circleColor: number = 0xC0C0C0;  // Silver
    private dots: Phaser.Geom.Point[] = [];
    public isVisible: boolean = false;
    public static circleRadius: number = 40;  // Adjust to your needs
        
    constructor(private scene: Phaser.Scene, private parent: BaseSpaceship) { // parent is your spaceship
        this.graphics = scene.add.graphics();
        const parentPosition = parent.getCentroid();
        this.circle = new Phaser.Geom.Circle(parentPosition.x, parentPosition.y, ForceField.circleRadius);
        
        for (let i = 0; i < 360; i += 45) {  // Adding 8 dots around the circle
            const x = this.circle.x + ForceField.circleRadius * Math.cos(Phaser.Math.DegToRad(i));
            const y = this.circle.y + ForceField.circleRadius * Math.sin(Phaser.Math.DegToRad(i));
            this.dots.push(new Phaser.Geom.Point(x, y));
        }
    }

    show() {
        this.isVisible = true;
        
    }

    hide() {
        this.graphics.clear();
        this.isVisible = false;
    }

    destroy() {
        this.graphics.clear();
        this.graphics.destroy();
        this.isVisible = false;
    }

    update() {
        const parentPosition = this.parent.getCentroid();
        this.circle.setPosition(parentPosition.x, parentPosition.y);
        const circleRadius = this.circle.radius;

        for (let i = 0; i < this.dots.length; i++) {
            const angle = Phaser.Math.Angle.Between(this.circle.x, this.circle.y, this.dots[i].x, this.dots[i].y);
            const newAngle = angle + Phaser.Math.DegToRad(5);  // Adjust the rotation speed
            this.dots[i].x = this.circle.x + circleRadius * Math.cos(newAngle);
            this.dots[i].y = this.circle.y + circleRadius * Math.sin(newAngle);
        }
    }

    render() {
        this.graphics.clear();
        if (!this.isVisible) return;
        this.graphics.lineStyle(1, this.circleColor);
        this.graphics.strokeCircleShape(this.circle);
        this.dots.forEach(dot => {
            this.graphics.fillStyle(this.circleColor);
            this.graphics.fillPointShape(dot, 2);  // Drawing the dots
        });
    }
}
