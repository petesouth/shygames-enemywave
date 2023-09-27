import Phaser from 'phaser';
import store from '../store/store';
import { spaceshipActions } from '../store/spaceshipstore';

export class PlayerSpaceship {
  private triangle: Phaser.Geom.Triangle;
  private graphics: Phaser.GameObjects.Graphics;
  private rotationRate: number = 0.2;
  private thrust: number = 0.5; // How much velocity is added when thrusting
  private damping: number = 0.98; // Damping factor to slow down the spaceship
  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0); // Current velocity
  private leftKey?: Phaser.Input.Keyboard.Key;
  private rightKey?: Phaser.Input.Keyboard.Key;
  private upKey?: Phaser.Input.Keyboard.Key;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });

    const halfBaseWidth = 20;
    const halfHeight = 30;

    this.triangle = new Phaser.Geom.Triangle(
      400, 300 - halfHeight,
      400 - halfBaseWidth, 300 + halfHeight,
      400 + halfBaseWidth, 300 + halfHeight
    );

    this.leftKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.upKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  }

  updateSpaceshipState() {
    this.graphics.clear();

    // Rotation logic
    if (this.leftKey?.isDown) {
        Phaser.Geom.Triangle.Rotate(this.triangle, -this.rotationRate);
    } else if (this.rightKey?.isDown) {
        Phaser.Geom.Triangle.Rotate(this.triangle, this.rotationRate);
    }

    // Thrust logic
    if (this.upKey?.isDown) {
        const centroid = Phaser.Geom.Triangle.Centroid(this.triangle);
        const deltaX = this.triangle.x1 - centroid.x;
        const deltaY = this.triangle.y1 - centroid.y;
        const angle = Math.atan2(deltaY, deltaX);

        this.velocity.x += this.thrust * Math.cos(angle);
        this.velocity.y += this.thrust * Math.sin(angle);
    }

    // Apply damping to velocity
    this.velocity.x *= this.damping;
    this.velocity.y *= this.damping;

    // Move the spaceship by the current velocity
    Phaser.Geom.Triangle.Offset(this.triangle, this.velocity.x, this.velocity.y);

    // Screen wrapping logic
    const maxX = Math.max(this.triangle.x1, this.triangle.x2, this.triangle.x3);
    const minX = Math.min(this.triangle.x1, this.triangle.x2, this.triangle.x3);
    const maxY = Math.max(this.triangle.y1, this.triangle.y2, this.triangle.y3);
    const minY = Math.min(this.triangle.y1, this.triangle.y2, this.triangle.y3);

    if (maxX < 0) {
        Phaser.Geom.Triangle.Offset(this.triangle, Number.parseInt("" + this.scene.sys.game.config.width), 0);
    } else if (minX > Number.parseInt("" + this.scene.sys.game.config.width)) {
        Phaser.Geom.Triangle.Offset(this.triangle, -Number.parseInt("" + this.scene.sys.game.config.width), 0);
    }

    if (maxY < 0) {
        Phaser.Geom.Triangle.Offset(this.triangle, 0, Number.parseInt("" + this.scene.sys.game.config.height));
    } else if (minY > Number.parseInt("" + this.scene.sys.game.config.height)) {
        Phaser.Geom.Triangle.Offset(this.triangle, 0, -Number.parseInt("" + this.scene.sys.game.config.height));
    }

    // Render the updated triangle
    this.graphics.strokeTriangleShape(this.triangle);
  }
}
