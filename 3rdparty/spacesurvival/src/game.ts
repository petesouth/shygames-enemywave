import Phaser from 'phaser';
import { PlayerSpaceship } from './gameobjects/playerspaceship';
import { EnemySpaceship } from './gameobjects/enemyspaceship';
import { SpaceObject } from './gameobjects/spaceobject';

export class MainScene extends Phaser.Scene {
    private playerspaceship!: PlayerSpaceship;
    private enemyspaceship!: EnemySpaceship;
    private starsBackground!: Phaser.GameObjects.Graphics;

    private spaceObjects: SpaceObject[] = [];
    
    constructor() {
        super('MainScene');
    }

    create() {
        this.createStarBackground();

        this.playerspaceship = new PlayerSpaceship(this);
        this.enemyspaceship = new EnemySpaceship(this, this.playerspaceship);

        this.createAsteroidsBasedOnScreenSize();
    }


    update() {
        
      this.playerspaceship.updateSpaceshipState(this.spaceObjects);
      this.playerspaceship.handleBullets(this.spaceObjects);
      this.playerspaceship.handleMines(this.spaceObjects);

      
      this.enemyspaceship.updateSpaceshipState(this.spaceObjects);


      this.spaceObjects.forEach(spaceObj => {
            spaceObj.update(this.spaceObjects);
        });
    }

    public createAsteroidsBasedOnScreenSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const dimendsionsSpaceObject: { width:number, height: number} = SpaceObject.getMaxSpaceObjectWidthHeight();
        let numobjects : number = 0;

        if( width >= height ) {
            numobjects = (width / dimendsionsSpaceObject.width);
        } else {
            numobjects = (height / dimendsionsSpaceObject.width);
        }

        this.spaceObjects.forEach((spaceObject)=>{
            spaceObject.destroy();
        });

        this.spaceObjects = [];

        
        numobjects = Phaser.Math.Between(numobjects * .6, numobjects);
    
        for (let i = 0; i < numobjects; i++) {
            const spaceObj = new SpaceObject(this);
            this.spaceObjects.push(spaceObj);
        }
    }

    public createStarBackground() {
        const stars = this.add.graphics({ fillStyle: { color: 0xFFFFFF } });
    
        const numStars = Math.floor((this.scale.width * this.scale.height) / 200);  // One star for every 200 pixels
    
        for (let i = 0; i < numStars; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(0, this.scale.height);
            stars.fillRect(x, y, 1, 1);
        }
    
        // Make sure the stars are rendered behind all other game objects
        stars.setDepth(0);
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
            const mainScene : MainScene = this.scene.getScene("MainScene") as MainScene;
            mainScene.createStarBackground();
            mainScene.createAsteroidsBasedOnScreenSize();
        });
    }
}
