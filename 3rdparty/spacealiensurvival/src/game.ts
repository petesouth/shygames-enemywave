import Phaser from 'phaser';
import { PlayerSpaceship } from './gameobjects/playerspaceship';
import { EnemySpaceship } from './gameobjects/enemyspaceship';
import { SpaceObject } from './gameobjects/spaceobject';
import { BaseExplodableState } from './gameobjects/baseExplodable';
const num_ships = 2;
const SPAWN_TIME = 30000; // 30 seconds in milliseconds

export class MainScene extends Phaser.Scene {
    private playerspaceship!: PlayerSpaceship;
    private enemyspaceships: EnemySpaceship[] = [];
    private starsBackground!: Phaser.GameObjects.Graphics;
    private respawnCharacterText?: Phaser.GameObjects.Text;
    private timerCount: number = 0;
    private spaceObjects: SpaceObject[] = [];


    constructor() {
        super('MainScene');
    }

    recreate() {
        if (this.playerspaceship.state === BaseExplodableState.DESTROYED) {
            this.playerspaceship.spawn();
        }
    }

    create() {
        this.createStarBackground();

        this.respawnCharacterText = this.add.text(
            (window.innerWidth / 2) - 150, window.innerHeight / 2,  // Position: 0 pixels from the left, 0 pixels from the top
            'Push R to Spawn/Re-Spawn Your Spaceship.',  // Text
            { font: '16px Arial', color: '#ffffff' }  // Style
        );

        this.respawnCharacterText.visible = true;
        this.playerspaceship = new PlayerSpaceship(this);
        this.enemyspaceships.push(new EnemySpaceship(this, window.innerHeight, this.playerspaceship));
        this.createAsteroidsBasedOnScreenSize();

        this.timerCount = Date.now();

    }


    update() {

        if (this.playerspaceship.state === BaseExplodableState.DESTROYED) {
            if (this.respawnCharacterText) {
                this.respawnCharacterText.visible = true;
            }
        } else {
            if (this.respawnCharacterText) {
                this.respawnCharacterText.visible = false;
            }

        }


        this.spaceObjects.forEach(spaceObj => {
            spaceObj.renderSpaceObject(this.spaceObjects);
        });




        if (this.respawnCharacterText?.visible === false) {
            this.playerspaceship.detectSpaceshipBounceCollisions(this.enemyspaceships);
            this.playerspaceship.detectSpaceObjctBounceCollisions(this.spaceObjects);
           
            this.playerspaceship.handleBullets(this.enemyspaceships);
            this.playerspaceship.handleMines(this.enemyspaceships);
            this.playerspaceship.handleMissiles(this.enemyspaceships);
            
        }
        
        this.playerspaceship.render();        
        this.playerspaceship.renderWeapons();


        for (let i = 0; i < this.enemyspaceships.length; ++i) {
            const tenemyspaceship = this.enemyspaceships[i];
            const isEverythingDestroyed = tenemyspaceship.isEverythingDestroyed();
            if (isEverythingDestroyed) {
                this.enemyspaceships.splice(i, 1);
                i--;
            }


            if (this.respawnCharacterText?.visible === false) {
                tenemyspaceship.detectSpaceshipBounceCollisions([this.playerspaceship]);
                tenemyspaceship.detectSpaceObjctBounceCollisions(this.spaceObjects);
                tenemyspaceship.handleBullets([this.playerspaceship]);
                tenemyspaceship.handleMines([this.playerspaceship]);
                tenemyspaceship.handleMissiles([this.playerspaceship]);
            }

            tenemyspaceship.render();
            tenemyspaceship.renderWeapons();

        };

        const difference = Date.now() - this.timerCount;
        if (difference >= SPAWN_TIME) {
            this.spawnEnemy();
            this.timerCount = Date.now();
        }

    }

    spawnEnemy() {

        if (this.enemyspaceships.length < num_ships) {
            this.enemyspaceships.push(new EnemySpaceship(this, window.innerWidth, this.playerspaceship));
        }

    }

    public createAsteroidsBasedOnScreenSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const dimendsionsSpaceObject: { width: number, height: number } = SpaceObject.getMaxSpaceObjectWidthHeight();
        let numobjects: number = 0;

        if (width >= height) {
            numobjects = (width / dimendsionsSpaceObject.width);
        } else {
            numobjects = (height / dimendsionsSpaceObject.width);
        }

        this.spaceObjects.forEach((spaceObject) => {
            spaceObject.destroy();
        });

        this.spaceObjects = [];


        numobjects = Phaser.Math.Between(numobjects * .6, numobjects);

        for (let i = 0; i < 0; i++) {
            const spaceObj = new SpaceObject(this);
            this.spaceObjects.push(spaceObj);
        }
    }

    public createStarBackground() {
        // Clear the existing stars
        if (this.starsBackground) {
            this.starsBackground.clear();
        } else {
            this.starsBackground = this.add.graphics({ fillStyle: { color: 0xFFFFFF } });
            this.starsBackground.setDepth(0); // Make sure the stars are rendered behind other game objects
        }

        const numStars = Math.floor((this.scale.width * this.scale.height) / 200); // One star for every 200 pixels

        for (let i = 0; i < numStars; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(0, this.scale.height);
            this.starsBackground.fillRect(x, y, 1, 1);
        }
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

        // Add event listeners for key presses
        window.addEventListener("resize", this.handleWindowResize.bind(this));
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.getElementById("game")?.focus();

    }

    handleWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.scale.setGameSize(w, h);
        const mainScene = this.scene.getScene("MainScene") as MainScene;
        mainScene.createStarBackground();
        mainScene.createAsteroidsBasedOnScreenSize();
        document.getElementById("game")?.focus();

    }

    handleKeyDown(event: KeyboardEvent) {
        // Check if the Ctrl key is pressed (key code 17) and the "E" key (key code 69)
        if (event.ctrlKey && event.keyCode === 69) {
            this.toggleFullscreen();
        } else if (event.keyCode === 82) {
            const mainScene = this.scene.getScene("MainScene") as MainScene;
            mainScene.recreate();
        } else if (event.key === "Escape") {
            this.exitFullscreen();
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            const canvas = this.canvas as HTMLCanvasElement;
            canvas.requestFullscreen().catch((err) => {
                console.error("Fullscreen request failed:", err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
}
