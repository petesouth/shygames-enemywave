import Phaser from 'phaser';
import { PlayerSpaceship } from '../gameobjects/playerspaceship';
import { EnemySpaceship, EnemySpaceshipConfig } from '../gameobjects/enemyspaceship';
import { SpaceObject } from '../gameobjects/spaceobject';
import { BaseExplodableState } from '../gameobjects/baseExplodable';
import gGameStore from '../store/store';
import { gameActions } from '../store/gamestore';
import { SplashScreen } from './SplashScreen';


class MainSceneStartGameText {
    private gameNameText: Phaser.GameObjects.Text | undefined;
    private instructions: Phaser.GameObjects.Text[] = [];
    private scoreText: Phaser.GameObjects.Text | undefined;

    constructor(private scene: Phaser.Scene) { }

    createStartGameText() {
        this.scoreText = this.scene.add.text(
            20,
            20,
            'Player Kills: 0  Level: 0',
            { font: '16px Arial', color: '#ffffff' }
        );

        let offset = 60;

        this.gameNameText = this.scene.add.text(
            (window.innerWidth / 2),
            offset,
            'ShyHumanGames LLC - Space Alien Survival',
            { font: '16px Arial', color: '#ffffff' }
        );
        this.gameNameText.setOrigin(0.5);
        offset += 30;

        const instructionTexts = [
            'Game', 'R - Start Game / Re-spawn', 'CTRL-E - Fullscreen',
            'Movement', '\u2191 - Thrust Forward', '\u2190 - Rotate Left', '\u2192 - Rotate Right',
            'Weapons', 'Space - Fire Cannon', 'G - Guided Missiles', 'M - Floating Mines', 'S - Shields'
        ];

        instructionTexts.forEach(instruction => {
            let text = this.scene.add.text(
                (window.innerWidth / 2),
                offset,
                instruction,
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            this.instructions.push(text);
            offset += 15;
        });
    }

    repositionStartGameText(w: number) {
        let offset = 60;
        this.gameNameText?.setPosition(w / 2, offset);
        this.gameNameText?.setDepth(1);
        offset += 30;

        this.instructions.forEach(instruction => {
            instruction.setPosition(w / 2, offset);
            instruction.setDepth(1);
            offset += 15;
        });
    }

    displayGameText(playerSpaceship: any) {
        if (playerSpaceship.state === BaseExplodableState.DESTROYED) {
            this.gameNameText?.setVisible(true);
            this.instructions.forEach(instruction => instruction.setVisible(true));
        } else {
            this.gameNameText?.setVisible(false);
            this.instructions.forEach(instruction => instruction.setVisible(false));
        }

        let { game } = gGameStore.getState();

        if (playerSpaceship?.state === BaseExplodableState.ALIVE) {
            this.scoreText?.setText(`Player Kills: ${game.playerSpaceShipKilled} Player HitPoints: ${playerSpaceship.hitpoints} Level: ${game.currentLevel}`);
        } else {
            this.scoreText?.setText(`Player Kills: ${game.playerSpaceShipKilled} Level: ${game.currentLevel}`);
        }
        this.scoreText?.setDepth(1);
    }
}




export class MainScene extends Phaser.Scene {

    private playerspaceship!: PlayerSpaceship;
    private enemyspaceships: EnemySpaceship[] = [];
    private starsBackground!: Phaser.GameObjects.Graphics;

    private timerCount: number = 0;
    private spaceObjects: SpaceObject[] = [];
    private gamesongSound?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private mainSceneStartGameText: MainSceneStartGameText = new MainSceneStartGameText(this);
    constructor() {
        super('MainScene');

    }


    public playGameSongSound(): void {
        if (this.gamesongSound && !this.gamesongSound.isPlaying) {
            this.gamesongSound.play();
        }
    }

    public stopGameSongSound(): void {
        if (this.gamesongSound && this.gamesongSound.isPlaying) {
            this.gamesongSound.stop();
        }
    }

    recreate() {
        if (this.playerspaceship && this.playerspaceship.state === BaseExplodableState.DESTROYED) {
            this.playerspaceship.spawn();
            gGameStore.dispatch(gameActions.startCurrentLevel({}));
        }
    }


    create() {
        this.gamesongSound = this.sound.add('gamesong', { loop: true, volume: 1 });

        this.createStarBackground();
        this.playerspaceship = new PlayerSpaceship(this);
        this.createAsteroidsBasedOnScreenSize();


        this.mainSceneStartGameText.createStartGameText();

        this.timerCount = Date.now();

        setInterval(() => {
            if (this.scale.width < window.innerWidth ||
                this.scale.height < window.innerHeight) {
                this.handleWindowResize();
            }
        }, 500);

        this.playGameSongSound();
    }


    handleWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.scale.setGameSize(w, h);
        this.createStarBackground();
        this.createAsteroidsBasedOnScreenSize();
        this.mainSceneStartGameText.repositionStartGameText(w);


    }

    update() {

        this.mainSceneStartGameText.displayGameText(this.playerspaceship);

        this.spaceObjects.forEach(spaceObj => {
            spaceObj.renderSpaceObject(this.spaceObjects);
        });


        if (this.playerspaceship.state === BaseExplodableState.ALIVE) {
            this.playerspaceship.handleBullets(this.enemyspaceships);
            this.playerspaceship.handleMines(this.enemyspaceships);
            this.playerspaceship.handleMissiles(this.enemyspaceships);
        }



        this.playerspaceship.render();
        this.playerspaceship.renderWeapons();
        this.playerspaceship.handleWeaponsAgainstSpaceObjets(this.spaceObjects);
        this.playerspaceship.detectBounceCollisions([...this.enemyspaceships, ...this.spaceObjects]);


        for (let i = 0; i < this.enemyspaceships.length; ++i) {
            const tenemyspaceship = this.enemyspaceships[i];
            const isEverythingDestroyed = tenemyspaceship.isEverythingDestroyed();
            if (isEverythingDestroyed) {
                this.enemyspaceships.splice(i, 1);
                i--;
                break;
            }


            if (this.playerspaceship.state === BaseExplodableState.ALIVE && this.playerspaceship.hitpoints > 0) {
                tenemyspaceship.handleBullets([this.playerspaceship]);
                tenemyspaceship.handleMines([this.playerspaceship]);
                tenemyspaceship.handleMissiles([this.playerspaceship]);
            }

            tenemyspaceship.render();
            tenemyspaceship.renderWeapons();
            tenemyspaceship.handleWeaponsAgainstSpaceObjets(this.spaceObjects);
            tenemyspaceship.detectBounceCollisions([this.playerspaceship, ...this.enemyspaceships, ...this.spaceObjects]);

        };

    }

    spawnEnemy() {


        const enemySpaceshipConfig: EnemySpaceshipConfig = {
            // If there isn't a boss already being a boss and there isn't atleast 1 red ship.  No Boss
            thrust: 0.5,
            hitpoints: 10,
            fireRate: 1200,
            missileFireRate: 5000,
            imageKey: SplashScreen.enemySpaceships[0]
        };

        this.enemyspaceships.push(new EnemySpaceship(this, window.innerHeight, this.playerspaceship, enemySpaceshipConfig));
    }

    public createAsteroidsBasedOnScreenSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const dimendsionsSpaceObject: { width: number; height: number; } = SpaceObject.getMaxSpaceObjectWidthHeight();
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


        numobjects = Phaser.Math.Between(numobjects * 0.6, numobjects);

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
            this.starsBackground = this.add.graphics({ fillStyle: { color: 16777215 } });
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
