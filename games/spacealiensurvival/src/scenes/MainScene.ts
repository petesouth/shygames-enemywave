import Phaser from 'phaser';
import { PlayerSpaceship } from '../gameobjects/playerspaceship';
import { EnemySpaceship, EnemySpaceshipConfig } from '../gameobjects/enemyspaceship';
import { SpaceObject } from '../gameobjects/spaceobject';
import { BaseExplodableState } from '../gameobjects/baseExplodable';
import gGameStore from '../store/store';
import { gameActions } from '../store/gamestore';
import { SplashScreen } from './SplashScreen';
import { MainSceneStartGameText } from './MainSceneStartGameText';
import { BaseSpaceship } from '../gameobjects/basespaceship';
import Game from '../game';


export class MainScene extends Phaser.Scene {

    public static GOLDEN_RATIO = { width: 2065, height: 1047 };
    private playerspaceship!: PlayerSpaceship;
    private enemyspaceships: EnemySpaceship[] = [];
    private starsBackgroundImage!: Phaser.GameObjects.Image;
    private currentBackgroundName: string = "";
    private timerBetweenLevels: number = -1;
    private timerBetweenLevelsWaitCount: number = 12000;
    private betweenGames: boolean = false;
    private spaceObjects: SpaceObject[] = [];
    private gamesongSound?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private mainSceneStartGameText: MainSceneStartGameText = new MainSceneStartGameText(this);
    constructor() {
        super('MainScene');
    }

    private handleMouseClick(pointer: Phaser.Input.Pointer): void {
        this.startPlayerGame();
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

    public playSuccessSound(): void {
        let sound = this.sound.add('levelcomplete', { loop: false });
        sound.play();
    }

    public playLevelComplete(): void {
        let sound = this.sound.add('success', { loop: false });
        sound.play();
    }


    startPlayerGame() {
        if (this.playerspaceship && this.playerspaceship.state === BaseExplodableState.DESTROYED) {
            gGameStore.dispatch(gameActions.startCurrentLevel({}));
            this.playerspaceship.spawn();
            this.stopGameSongSound();
            this.betweenGames = true;
            this.enemyspaceships.forEach((ship) => {
                ship.destroy();
            });
            this.enemyspaceships = [];
            this.timerBetweenLevels = -1;
            Game.toggleFullscreen();
        }

    }


    create() {
        this.gamesongSound = this.sound.add('gamesong', { loop: true, volume: 1 });


        this.createBackgroundImage();
        this.resizeStarBackground();
        this.playerspaceship = new PlayerSpaceship(this);
        this.createAsteroidsBasedOnScreenSize();


        this.mainSceneStartGameText.createStartGameText();


        setInterval(() => {
            if (this.scale.width < window.innerWidth ||
                this.scale.height < window.innerHeight) {
                this.handleWindowResize();
            }
        }, 500);

        this.playGameSongSound();
        this.input.on('pointerdown', this.handleMouseClick, this);
        this.createUIButtons();

    }

    createUIButtons() {

        // Create button background graphics
        const buttonGraphics = this.add.graphics();
        buttonGraphics.lineStyle(2, 0xffffff);  // White border

        // Helper function to create a button
        const createButton = (x: number, y: number, width: number, height: number, label: string, fillColor: number) => {
            buttonGraphics.fillStyle(fillColor);  // Set fill color based on argument
            buttonGraphics.strokeRoundedRect(x, y, width, height, 10);  // Rounded corners
            buttonGraphics.fillRoundedRect(x, y, width, height, 10);  // Rounded corners
            const text = this.add.text(x + (width / 2), y + (height / 2), label, { fontSize: '10px', color: '#fff' })
                .setOrigin(0.5, 0.5)  // Center the text within the button
                .setDepth(1);
            const zone = this.add.zone(x, y, width, height)
                .setOrigin(0, 0)
                .setInteractive()
                .on('pointerdown', (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) => {
                    this.handleButton(label, buttonGraphics);
                    event.stopPropagation();
                })
                .setDepth(0);  // Ensure zone is rendered below text
            return { text, zone, graphics: buttonGraphics };
        };

        // Array of buttons along with their properties
        const buttons: { label: string, activeProperty: string, y: number }[] = [
            { label: 'Shields', activeProperty: 'turnOnShields', y: 10 },
            { label: 'Fire', activeProperty: 'turnOnBullets', y: 50 },
            { label: 'Missiles', activeProperty: 'turnOnMissiles', y: 90 },
            { label: 'Mines', activeProperty: 'turnOnMines', y: 130 },
            { label: 'Fullscreen', activeProperty: '', y: 170 }  // 'Fullscreen' button color remains unchanged
        ];
        buttons.forEach((button) => {
            const fillColor = (this.playerspaceship as any)[button.activeProperty] ? 0xff0000 : 0x0077be;
            createButton(10, button.y, 70, 30, button.label, fillColor);
        });

        // Update button positions on resize
        this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
            // ... (update positions as needed)
        });
    }


    handleButton(label: string, buttonGraphics: Phaser.GameObjects.Graphics) {
        switch (label) {
            case 'Shields':
                this.playerspaceship.turnOnShields = !this.playerspaceship.turnOnShields;
                break;
            case 'Fire':
                this.playerspaceship.turnOnBullets = !this.playerspaceship.turnOnBullets;
                break;
            case 'Missiles':
                this.playerspaceship.turnOnMissiles = !this.playerspaceship.turnOnMissiles;
                break;
            case 'Mines':
                this.playerspaceship.turnOnMines = !this.playerspaceship.turnOnMines;
                break;
            case 'Fullscreen':
                // handle fullscreen
                Game.toggleFullscreen();
                break;
        }

        // Update button colors
        this.updateButtonColors(buttonGraphics);
    }

    updateButtonColors(buttonGraphics: Phaser.GameObjects.Graphics) {
        buttonGraphics.clear();
        buttonGraphics.lineStyle(2, 0xffffff);  // White border

        // Update 'Shields' button color
        buttonGraphics.fillStyle(this.playerspaceship.turnOnShields ? 0xff0000 : 0x0077be);
        buttonGraphics.strokeRoundedRect(10, 10, 70, 30, 10);
        buttonGraphics.fillRoundedRect(10, 10, 70, 30, 10);

        // Update other button colors, excluding 'Fullscreen'
        const buttons = [
            { label: 'Fire', activeProperty: 'turnOnBullets', y: 50 },
            { label: 'Missiles', activeProperty: 'turnOnMissiles', y: 90 },
            { label: 'Mines', activeProperty: 'turnOnMines', y: 130 },
        ];
        type ButtonProperty = 'turnOnShields' | 'turnOnBullets' | 'turnOnMissiles' | 'turnOnMines';

        buttons.forEach((button) => {
            buttonGraphics.fillStyle((this.playerspaceship as any)[button.activeProperty] ? 0xff0000 : 0x0077be);
            buttonGraphics.strokeRoundedRect(10, button.y, 70, 30, 10);
            buttonGraphics.fillRoundedRect(10, button.y, 70, 30, 10);
        });

        // Handle 'Fullscreen' button separately to keep it blue
        buttonGraphics.fillStyle(0x0077be);
        buttonGraphics.strokeRoundedRect(10, 170, 70, 30, 10);
        buttonGraphics.fillRoundedRect(10, 170, 70, 30, 10);
    }

    handleWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.scale.setGameSize(w, h);
        this.resizeStarBackground();
        this.createAsteroidsBasedOnScreenSize();
        this.mainSceneStartGameText.repositionStartGameText(w);

        [this.playerspaceship, ...this.enemyspaceships].forEach((basSpaceShip: BaseSpaceship) => {
            basSpaceShip?.resizeFromScreenRatio();
        });

    }

    update() {

        const w = window.innerWidth;
        const h = window.innerHeight;

        this.mainSceneStartGameText.displayGameText(this.playerspaceship);

        this.spaceObjects.forEach(spaceObj => {
            spaceObj.renderSpaceObject(this.spaceObjects);
        });


        if (this.playerspaceship.state === BaseExplodableState.ALIVE) {
            this.playerspaceship.detectBounceCollisions([...this.enemyspaceships, ...this.spaceObjects]);
        }

        this.playerspaceship.handleBullets(this.enemyspaceships);
        this.playerspaceship.handleMines(this.enemyspaceships);
        this.playerspaceship.handleMissiles(this.enemyspaceships);
        this.playerspaceship.handleWeaponsAgainstSpaceObjets(this.spaceObjects);

        this.playerspaceship.render();
        this.playerspaceship.renderWeapons();


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


        this.calculateLevelAndEnemySpawning();


    }

    private calculateLevelAndEnemySpawning() {
        const game = gGameStore.getState().game;

        // Player must be alive or this no-opts
        if (this.playerspaceship.state === BaseExplodableState.ALIVE) {

            if (this.enemyspaceships.length < 1 && this.betweenGames === true) {
                // if 0 enemy and betweenGames is true spawn enemis Time to Assault the player
                // With a wave of enemies.

                this.betweenGames = false;
                this.timerBetweenLevels = -1;


                for (let i = 0; i < game.currentLevel; ++i) {
                    this.spawnEnemy();
                }


            } else if (this.betweenGames === false &&
                this.enemyspaceships.length < 1 &&
                this.timerBetweenLevels === -1) {
                // In shit scenario all enemies have been destroyed or not yet created.
                // So Ill start the timer.
                this.timerBetweenLevels = Date.now();
                this.playerspaceship.hitpoints = 10;
                if (game.currentLevel > 0) {
                    this.playLevelComplete();
                    this.mainSceneStartGameText.setLevelAnnounceText(`Level ${game.currentLevel} Completed !!!`)
                    this.mainSceneStartGameText.showLevelAnnounceText();
                }

                if (game.currentLevel >= 1) {
                    this.createBackgroundImage();
                    this.createAsteroidsBasedOnScreenSize();
                    this.resizeStarBackground();
                }


            } else if (this.betweenGames === false &&
                this.enemyspaceships.length < 1 &&
                this.timerBetweenLevels !== -1 &&
                (Date.now() - this.timerBetweenLevels) > this.timerBetweenLevelsWaitCount) {
                // All good to go.  So set all the flags that lets start this level happen

                this.mainSceneStartGameText.hideLevelAnnounceText();
                this.playSuccessSound();
                gGameStore.dispatch(gameActions.incrementCurrentLevel({}));
                this.betweenGames = true;
                this.timerBetweenLevels = Date.now();
            }
        }
    }

    spawnEnemy() {


        const enemySpaceshipConfig: EnemySpaceshipConfig = {
            // If there isn't a boss already being a boss and there isn't atleast 1 red ship.  No Boss
            thrust: Phaser.Math.Between(.5, .8),
            hitpoints: Phaser.Math.Between(5, 20),
            fireRate: Phaser.Math.Between(800, 2000),
            missileFireRate: Phaser.Math.Between(1000, 7000),
            imageKey: Phaser.Utils.Array.GetRandom(SplashScreen.enemySpaceships)
        };

        this.enemyspaceships.push(new EnemySpaceship(this, window.innerHeight + (this.enemyspaceships.length * 40), this.playerspaceship, enemySpaceshipConfig));
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


    createBackgroundImage() {
        let newRandomName = Phaser.Utils.Array.GetRandom(SplashScreen.backgrounds);
        if (this.currentBackgroundName == "" || newRandomName !== this.currentBackgroundName) {
            if (this.starsBackgroundImage) {
                this.starsBackgroundImage.destroy();
            }
    
            this.starsBackgroundImage = this.add.image(window.innerWidth / 2,
                window.innerHeight / 2, newRandomName
            );
    
            this.currentBackgroundName = newRandomName;
        }
    
        this.resizeStarBackground();
    }
    

    public resizeStarBackground() {
        if( !this.starsBackgroundImage ) {
            return;
        }
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenAspectRatio = screenWidth / screenHeight;
    
        const imageWidth = this.starsBackgroundImage.width;
        const imageHeight = this.starsBackgroundImage.height;
        const imageAspectRatio = imageWidth / imageHeight;
    
        let newWidth, newHeight;
    
        if (imageAspectRatio > screenAspectRatio) {
            // The image is wider relative to the screen, set the image width to match the screen width
            newWidth = screenWidth;
            newHeight = newWidth / imageAspectRatio;  // Adjust height proportionally
    
            // Check if the new height is less than the screen height, if so adjust the dimensions
            if (newHeight < screenHeight) {
                newHeight = screenHeight;
                newWidth = newHeight * imageAspectRatio;  // Adjust width proportionally
            }
        } else {
            // The image is taller relative to the screen, or has the same aspect ratio, set the image height to match the screen height
            newHeight = screenHeight;
            newWidth = newHeight * imageAspectRatio;  // Adjust width proportionally
    
            // Check if the new width is less than the screen width, if so adjust the dimensions
            if (newWidth < screenWidth) {
                newWidth = screenWidth;
                newHeight = newWidth / imageAspectRatio;  // Adjust height proportionally
            }
        }
    
        this.starsBackgroundImage.setDisplaySize(newWidth, newHeight);
    
        // Ensure the image is positioned in the center of the screen
        this.starsBackgroundImage.setPosition(screenWidth / 2, screenHeight / 2);
    
    }

}
