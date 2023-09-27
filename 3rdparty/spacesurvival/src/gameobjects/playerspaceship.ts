// gameobjects/playerspaceship.ts
import Phaser from 'phaser';
import { ExhaustFlame } from './exhaustflame';

export class PlayerSpaceship {

  private spaceShipShape: Phaser.Geom.Triangle;
  private innerSpaceShipShape: Phaser.Geom.Triangle;
  private graphics: Phaser.GameObjects.Graphics;
  private rotationRate: number = 0.2;
  private thrust: number = 0.5;
  private damping: number = 0.98;
  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  private leftKey?: Phaser.Input.Keyboard.Key;
  private rightKey?: Phaser.Input.Keyboard.Key;
  private upKey?: Phaser.Input.Keyboard.Key;
  private scene: Phaser.Scene;
  private exhaustFlame: ExhaustFlame;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x808080 }, fillStyle: { color: 0xC0C0C0 } }); // Dark gray border
    const halfBaseWidth = 20;
    const halfHeight = 30;

    this.spaceShipShape = new Phaser.Geom.Triangle(
      400, 300 - halfHeight,
      400 - halfBaseWidth, 300 + halfHeight,
      400 + halfBaseWidth, 300 + halfHeight
    );

    // Adjusted position for the inner triangle to move it slightly towards the bottom of the parent triangle
    this.innerSpaceShipShape = new Phaser.Geom.Triangle(
      400, 300 - halfHeight * 0.6,
      400 - halfBaseWidth * 0.7, 300 + halfHeight * 0.75,
      400 + halfBaseWidth * 0.7, 300 + halfHeight * 0.75
    );

    this.leftKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.upKey = scene.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.exhaustFlame = new ExhaustFlame(scene, this.spaceShipShape);
  }

  updateSpaceshipState() {
    this.graphics.clear();

    const centroid = Phaser.Geom.Triangle.Centroid(this.spaceShipShape);

    if (this.leftKey?.isDown) {
      Phaser.Geom.Triangle.RotateAroundPoint(this.spaceShipShape, centroid, -this.rotationRate);
      Phaser.Geom.Triangle.RotateAroundPoint(this.innerSpaceShipShape, centroid, -this.rotationRate);
    } else if (this.rightKey?.isDown) {
      Phaser.Geom.Triangle.RotateAroundPoint(this.spaceShipShape, centroid, this.rotationRate);
      Phaser.Geom.Triangle.RotateAroundPoint(this.innerSpaceShipShape, centroid, this.rotationRate);
    }

    if (this.upKey?.isDown) {
      const deltaX = this.spaceShipShape.x1 - centroid.x;
      const deltaY = this.spaceShipShape.y1 - centroid.y;
      const angle = Math.atan2(deltaY, deltaX);
      this.velocity.x += this.thrust * Math.cos(angle);
      this.velocity.y += this.thrust * Math.sin(angle);
    }

    this.velocity.x *= this.damping;
    this.velocity.y *= this.damping;
    Phaser.Geom.Triangle.Offset(this.spaceShipShape, this.velocity.x, this.velocity.y);
    Phaser.Geom.Triangle.Offset(this.innerSpaceShipShape, this.velocity.x, this.velocity.y);

    this.graphics.fillTriangleShape(this.spaceShipShape);
    this.graphics.fillTriangleShape(this.innerSpaceShipShape);

    this.graphics.strokeTriangleShape(this.spaceShipShape);
    this.graphics.strokeTriangleShape(this.innerSpaceShipShape);

    if (this.upKey?.isDown) {
      this.exhaustFlame.show();
      this.exhaustFlame.update();
    } else {
      this.exhaustFlame.hide();
    }

    this.exhaustFlame.render();
  }
}
