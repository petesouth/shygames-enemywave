import Phaser from 'phaser';
import gGameStore from '../store/store';
import { MainSceneStartGameText } from './MainSceneStartGameText';


export class MainScene extends Phaser.Scene {

    public static GOLDEN_RATIO = { width: 2065, height: 1047 };
    public static LEVEL_BONUS = 5;
    static MAX_ENEMIES: number = 14;
    
    private bricksTileSprite!: Phaser.GameObjects.TileSprite | null;
    private forestTileSprite!: Phaser.GameObjects.TileSprite | null;
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

        if( this.bricksTileSprite ) {
            this.bricksTileSprite.tilePositionX += 1;
        
        }
        
        if( this.forestTileSprite ) {
            this.forestTileSprite.tilePositionX += 4;
        }
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
        if (this.bricksTileSprite) {
            this.bricksTileSprite.destroy();
            this.bricksTileSprite = null;
        }

        if (this.forestTileSprite) {
            this.forestTileSprite.destroy();
            this.forestTileSprite = null;
        }

        
        this.forestTileSprite = this.add.tileSprite(0, 0, 1420,
             528, "background22"
        );

        this.bricksTileSprite = this.add.tileSprite(0, 0, 280,
            280, "bricks2"
       );

        const animConfig = {
            key: 'herorun', // This is the key for the animation itself
            frames: this.anims.generateFrameNames('herorun', { // This should match the atlas key from the preload
                prefix: 'run/frame000', // Adjusted to match the frame names in the JSON
                start: 0, // Starting frame index is 0
                end: 8, // Ending at frame index 2 for a total of 3 frames
                zeroPad: 1 // Adjust if your frame names have leading zeros
            }),
            frameRate: 10,
            repeat: -1
        };
        
        this.anims.create(animConfig);
        
        const sprite = this.add.sprite(window.innerWidth / 2, window.innerHeight - 190, 'herorun', 'run/frame0000'); // Adjust the initial frame name to match JSON
        sprite.setDisplaySize(300, 300); // Set the display size of the sprite
        sprite.play("herorun");

        
    }


    public resizeStarBackground() {
        if (!this.bricksTileSprite || ! this.forestTileSprite) {
            return;
        }
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenAspectRatio = screenWidth / screenHeight;

        const imageWidth = this.forestTileSprite.width;
        const imageHeight = this.forestTileSprite.height;
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

        this.forestTileSprite.setDisplaySize(newWidth, newHeight);
        this.forestTileSprite.setPosition(screenWidth / 2,  ( screenHeight / 2 ) );

        this.bricksTileSprite.setDisplaySize(screenWidth, 100);
        this.bricksTileSprite.setPosition(screenWidth / 2, screenHeight - 10);
        
        
    }

}
