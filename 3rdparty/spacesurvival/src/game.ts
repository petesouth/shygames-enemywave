import Phaser from 'phaser';
import { PlayerSpaceship } from './gameobjects/playerspaceship';

export class MainScene extends Phaser.Scene {
  private spaceship!: PlayerSpaceship;

  constructor() {
    super('MainScene');
  }

  create() {
    // Create an instance of the CustomSpaceship class
    this.spaceship = new PlayerSpaceship(this);
  }

  update() {
    this.spaceship.updateSpaceshipState();
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  scene: [MainScene],
};

export default class Game extends Phaser.Game {
  constructor() {
    super(config);
  }
}
