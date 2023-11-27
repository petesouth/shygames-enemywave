import Phaser from 'phaser';
import gGameStore from '../store/store';
import { MainSceneStartGameText } from './MainSceneStartGameText';


export class MainScene extends Phaser.Scene {

    public static GOLDEN_RATIO = { width: 2065, height: 1047 };
    public static LEVEL_BONUS = 5;
    static MAX_ENEMIES: number = 14;
    
    private cloudTileSprite!: Phaser.GameObjects.TileSprite;
    private housesTileSprite!: Phaser.GameObjects.TileSprite;
    private gamesongSound?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private mainSceneStartGameText: MainSceneStartGameText = new MainSceneStartGameText(this);
    

    constructor() {
        super('MainScene');
    }


    create() {
        this.gamesongSound = this.sound.add('gamesong', { loop: true, volume: 1 });


        this.createBackgroundImage();
        this.resizeStarBackground();
        

        this.mainSceneStartGameText.createStartGameText();

        this.playGameSongSound();
    
    }

    update() {

        const w = window.innerWidth;
        const h = window.innerHeight;

        this.mainSceneStartGameText.displayGameText();

        this.cloudTileSprite.tilePositionX -= 1;
        this.housesTileSprite.tilePositionX -= 4;
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


    

    
    handleWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.scale.setGameSize(w, h);
        this.resizeStarBackground();
        this.mainSceneStartGameText.repositionStartGameText(w);

     }
   

    createBackgroundImage() {
        const currentLevel = gGameStore.getState().game.currentLevel;
        if (this.cloudTileSprite) {
            this.cloudTileSprite.destroy();
        }

        this.cloudTileSprite = this.add.tileSprite(0, 0, 512,
            296, "background21"
        );



        this.housesTileSprite = this.add.tileSprite(0, 0, 1420,
            528, "background22"
        );


        this.resizeStarBackground();
    }


    public resizeStarBackground() {
        if (!this.cloudTileSprite) {
            return;
        }
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenAspectRatio = screenWidth / screenHeight;

        const imageWidth = this.cloudTileSprite.width;
        const imageHeight = this.cloudTileSprite.height;
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

        this.cloudTileSprite.setDisplaySize(newWidth, newHeight);
        this.cloudTileSprite.setPosition(screenWidth / 2, 200);
        this.cloudTileSprite.setDepth(-1);

        this.housesTileSprite.setDisplaySize(screenWidth + 100, screenHeight);
        this.housesTileSprite.setPosition(screenWidth / 2,  ( screenHeight / 2 ) );
        this.housesTileSprite.setDepth(0);
    }

}
