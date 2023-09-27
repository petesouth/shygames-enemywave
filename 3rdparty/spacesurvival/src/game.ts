// game.ts
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
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game',
  scene: [MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

export default class Game extends Phaser.Game {
  constructor() {
    super(config);
    window.addEventListener("resize", () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.scale?.setGameSize(w, h);
    });
  }
}
