import Phaser from 'phaser';
import { PlayerSpaceship } from './gameobjects/playerspaceship';
import { SpaceObject } from './gameobjects/spaceobject';

export class MainScene extends Phaser.Scene {
    private spaceship!: PlayerSpaceship;
    private spaceObjects: SpaceObject[] = [];

    constructor() {
        super('MainScene');
    }

    create() {
        this.spaceship = new PlayerSpaceship(this);

        // Create a random number of space objects
        const numObjects = Phaser.Math.Between(10, 24);
        for (let i = 0; i < numObjects; i++) {
            const spaceObj = new SpaceObject(this);
            this.spaceObjects.push(spaceObj);
        }
    }

    update() {
        
      this.spaceship.updateSpaceshipState(this.spaceObjects);

        this.spaceObjects.forEach(spaceObj => {
            spaceObj.update(this.spaceObjects);
        });
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

        // Adjust game size on window resize
        window.addEventListener("resize", () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            this.scale.setGameSize(w, h);
        });
    }
}
