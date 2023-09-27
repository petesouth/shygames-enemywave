// gameobjects/playerspaceship.ts
import Phaser from 'phaser';
import store from '../store/store';
import { spaceshipActions } from '../store/spaceshipstore';

export class PlayerSpaceship {

  private spaceShipShape: Phaser.Geom.Triangle;
  private graphics: Phaser.GameObjects.Graphics;
  private rotationRate: number = 0.2;
  private thrust: number = 0.5;
  private damping: number = 0.98;
  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  private leftKey?: Phaser.Input.Keyboard.Key;
  private rightKey?: Phaser.Input.Keyboard.Key;
  private upKey?: Phaser.Input.Keyboard.Key;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
    const halfBaseWidth = 20;
    const halfHeight = 30;

    this.spaceShipShape = new Phaser.Geom.Triangle(
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
    if (this.leftKey?.isDown) {
        Phaser.Geom.Triangle.Rotate(this.spaceShipShape, -this.rotationRate);
    } else if (this.rightKey?.isDown) {
        Phaser.Geom.Triangle.Rotate(this.spaceShipShape, this.rotationRate);
    }
    
    if (this.upKey?.isDown) {
        const centroid = Phaser.Geom.Triangle.Centroid(this.spaceShipShape);
        const deltaX = this.spaceShipShape.x1 - centroid.x;
        const deltaY = this.spaceShipShape.y1 - centroid.y;
        const angle = Math.atan2(deltaY, deltaX);
        this.velocity.x += this.thrust * Math.cos(angle);
        this.velocity.y += this.thrust * Math.sin(angle);
    }
    this.velocity.x *= this.damping;
    this.velocity.y *= this.damping;

    Phaser.Geom.Triangle.Offset(this.spaceShipShape, this.velocity.x, this.velocity.y);
    const maxX = Math.max(this.spaceShipShape.x1, this.spaceShipShape.x2, this.spaceShipShape.x3);
    const minX = Math.min(this.spaceShipShape.x1, this.spaceShipShape.x2, this.spaceShipShape.x3);
    const maxY = Math.max(this.spaceShipShape.y1, this.spaceShipShape.y2, this.spaceShipShape.y3);
    const minY = Math.min(this.spaceShipShape.y1, this.spaceShipShape.y2, this.spaceShipShape.y3);
    
    if (maxX < 0) {
        Phaser.Geom.Triangle.Offset(this.spaceShipShape, this.scene.scale.width, 0);
    } else if (minX > this.scene.scale.width) {
        Phaser.Geom.Triangle.Offset(this.spaceShipShape, -this.scene.scale.width, 0);
    }

    if (maxY < 0) {
        Phaser.Geom.Triangle.Offset(this.spaceShipShape, 0, this.scene.scale.height);
    } else if (minY > this.scene.scale.height) {
        Phaser.Geom.Triangle.Offset(this.spaceShipShape, 0, -this.scene.scale.height);
    }
    this.graphics.strokeTriangleShape(this.spaceShipShape);
  }
}
