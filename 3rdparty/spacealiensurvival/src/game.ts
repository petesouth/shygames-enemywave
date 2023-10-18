import Phaser from 'phaser';
import { PlayerSpaceship } from './gameobjects/playerspaceship';
import { EnemySpaceship } from './gameobjects/enemyspaceship';
import { SpaceObject } from './gameobjects/spaceobject';
import { BaseExplodableState } from './gameobjects/baseExplodable';
import gGameStore from './store/store';


const num_ships = 2;
const SPAWN_TIME = 20000; // 30 seconds in milliseconds

export class MainScene extends Phaser.Scene {

    private playerspaceship!: PlayerSpaceship;
    private enemyspaceships: EnemySpaceship[] = [];
    private starsBackground!: Phaser.GameObjects.Graphics;
    public gameNameText?: Phaser.GameObjects.Text;
    public scoreText?: Phaser.GameObjects.Text;
    public instructions?: Phaser.GameObjects.Text[] = [];

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
        this.playerspaceship = new PlayerSpaceship(this);
        this.enemyspaceships.push(new EnemySpaceship(this, window.innerHeight, this.playerspaceship));
        this.createAsteroidsBasedOnScreenSize();


        this.scoreText = this.add.text(
            20,
            20,
            'Player Kills: 0  Enemey Kills: 0',
            { font: '16px Arial', color: '#ffffff' }
        );
        

        let offset = 60;
        // Create two lines of text as class properties
        this.gameNameText = this.add.text(
            (window.innerWidth / 2),
            offset,
            'Space Alien Survival',
            { font: '16px Arial', color: '#ffffff' }
        );
        this.gameNameText.setOrigin(0.5);
        offset += 30;

        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                'Game',
                { font: '14px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 30;


        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                'R - Spawn/Respawn',
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 15;

        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                'CTRL-E - Fullscreen',
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 30;


        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                'Movement',
                { font: '14px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 30;


        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                '\u2191 - Thrust Forward',
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 15;

        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                '\u2190 - Rotate Left',
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 15;

        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                '\u2192 - Rotate Right',
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 30;

        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                'Weapons',
                { font: '14px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 30;

        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                'Space - Fire Cannon',
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 15;

        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                'G - Guided Missiles',
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 15;

        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                'M - Floating Mines',
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 15;

        this.instructions?.push((() => {
            let text = this.add.text(
                (window.innerWidth / 2),
                offset,
                'S - Shields',
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            return text;
        })());
        offset += 15;
        
        this.timerCount = Date.now();

    }

    handleWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.scale.setGameSize(w, h);
        this.createStarBackground();
        this.createAsteroidsBasedOnScreenSize();
        let offset = 60;

        // Set the position for gameNameText
        this.gameNameText?.setPosition(w / 2, offset);
        this.gameNameText?.setDepth(1);
        offset += 30;

        // Set positions for each instruction text
        if (this.instructions) {
            
            this.instructions[0].setPosition(w / 2, offset);
            this.instructions[0].setDepth(1);
            offset += 30;

            this.instructions[1].setPosition(w / 2, offset);
            this.instructions[1].setDepth(1);
            offset += 15;

            this.instructions[2].setPosition(w / 2, offset);
            this.instructions[2].setDepth(1);
            offset += 30;
            
            this.instructions[3].setPosition(w / 2, offset);
            this.instructions[3].setDepth(1);
            offset += 30;

            this.instructions[4].setPosition(w / 2, offset);
            this.instructions[4].setDepth(1);
            offset += 15;

            this.instructions[5].setPosition(w / 2, offset);
            this.instructions[5].setDepth(1);
            offset += 15;

            this.instructions[6].setPosition(w / 2, offset);
            this.instructions[6].setDepth(1);
            offset += 30;

            this.instructions[7].setPosition(w / 2, offset);
            this.instructions[7].setDepth(1);
            offset += 30;

            this.instructions[8].setPosition(w / 2, offset);
            this.instructions[8].setDepth(1);
            offset += 15;

            this.instructions[9].setPosition(w / 2, offset);
            this.instructions[9].setDepth(1);
            offset += 15;

            this.instructions[10].setPosition(w / 2, offset);
            this.instructions[10].setDepth(1);
            offset += 15;

            this.instructions[11].setPosition(w / 2, offset);
            this.instructions[11].setDepth(1);
            offset += 15;
        }

        
    }

    displayGameText() {
        if (this.playerspaceship.state === BaseExplodableState.DESTROYED) {
            if (this.gameNameText) {
                this.gameNameText.visible = true; // Show the bottom text
            }

            this.instructions?.forEach((instruction) => {
                instruction.visible = true;
            });
        } else {

            if (this.gameNameText) {
                this.gameNameText.visible = false; // Show the bottom text
            }

            this.instructions?.forEach((instruction) => {
                instruction.visible = false;
            });
        }

        let { game } = gGameStore.getState();  // Fetch the game state from the Redux store
        this.scoreText?.setText(`Player Kills: ${game.playerSpaceShipKilled}`);

    }

    update() {

        this.displayGameText();

        this.spaceObjects.forEach(spaceObj => {
            spaceObj.renderSpaceObject(this.spaceObjects);
        });


        if (this.playerspaceship.state === BaseExplodableState.ALIVE) {
            this.playerspaceship.detectSpaceshipBounceCollisions(this.enemyspaceships);
            this.playerspaceship.detectSpaceObjctBounceCollisions(this.spaceObjects);
            this.playerspaceship.handleBullets(this.enemyspaceships);
            this.playerspaceship.handleMines(this.enemyspaceships);
            this.playerspaceship.handleMissiles(this.enemyspaceships);
        }
         
         
         
        this.playerspaceship.render();
        this.playerspaceship.renderWeapons();
        this.playerspaceship.handleWeaponsAgainstSpaceObjets(this.spaceObjects);
        

        for (let i = 0; i < this.enemyspaceships.length; ++i) {
            const tenemyspaceship = this.enemyspaceships[i];
            const isEverythingDestroyed = tenemyspaceship.isEverythingDestroyed();
            if (isEverythingDestroyed) {
                this.enemyspaceships.splice(i, 1);
                i--;
                break;
            }

            tenemyspaceship.detectSpaceshipBounceCollisions([this.playerspaceship]);
            tenemyspaceship.detectSpaceObjctBounceCollisions(this.spaceObjects);
                

            if (this.playerspaceship.state === BaseExplodableState.ALIVE && this.playerspaceship.hitpoints > 0 ) {
                tenemyspaceship.handleBullets([this.playerspaceship]);
                tenemyspaceship.handleMines([this.playerspaceship]);
                tenemyspaceship.handleMissiles([this.playerspaceship]);
            }

            tenemyspaceship.render();
            tenemyspaceship.renderWeapons();
            tenemyspaceship.handleWeaponsAgainstSpaceObjets(this.spaceObjects);
        
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

        for (let i = 0; i < numobjects; i++) {
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
        const mainScene = this.scene.getScene("MainScene") as MainScene;
        mainScene.handleWindowResize();
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
