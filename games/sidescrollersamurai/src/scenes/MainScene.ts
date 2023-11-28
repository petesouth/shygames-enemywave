import Phaser from 'phaser';
import gGameStore from '../store/store';
import { MainSceneStartGameText } from './MainSceneStartGameText';


export class MainScene extends Phaser.Scene {

    public static GOLDEN_RATIO = { width: 2065, height: 1047 };
    public static LEVEL_BONUS = 5;
    static MAX_ENEMIES: number = 14;
    
    private bricksTileSprite?: Phaser.GameObjects.TileSprite | null;
    private forestTileSprite?: Phaser.GameObjects.TileSprite | null;
    private gamesongSound?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private mainSceneStartGameText: MainSceneStartGameText = new MainSceneStartGameText(this);
    private spriteRunning?:  Phaser.GameObjects.Sprite | null;
    private spriteIdle?:  Phaser.GameObjects.Sprite | null;
    protected leftKey?: Phaser.Input.Keyboard.Key;
    protected rightKey?: Phaser.Input.Keyboard.Key;

    
    constructor() {
        super('MainScene');
    }


    create() {
        this.leftKey = this.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = this.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
     
        this.gamesongSound = this.sound.add('gamesong', { loop: true, volume: 1 });


        this.createBackgroundImage();
        this.resizeStarBackground();
        

        this.mainSceneStartGameText.createStartGameText();

        this.playGameSongSound();
    
    }

    update() {
        if( ! this.spriteRunning || ! this.forestTileSprite || ! this.bricksTileSprite ) {
            return;
        }

        const w = window.innerWidth;
        const h = window.innerHeight;

        this.mainSceneStartGameText.displayGameText();

        if (this.leftKey?.isDown ) {
            this.bricksTileSprite.tilePositionX -= 1;
            this.forestTileSprite.tilePositionX -= 1;
            
            this.spriteIdle?.stop();
            this.spriteIdle?.setFlipX(true);
            this.spriteIdle?.setVisible(false);
            
            this.spriteRunning.setVisible(true);
            this.spriteRunning?.setFlipX(true);
            this.spriteRunning.play("herorun", true);

        } else if (this.rightKey?.isDown ) {
            this.bricksTileSprite.tilePositionX += 1;
            this.forestTileSprite.tilePositionX += 1;
            
            this.spriteIdle?.stop();
            this.spriteIdle?.setFlipX(false);
            this.spriteIdle?.setVisible(false);
            
            this.spriteRunning.setVisible(true);
            this.spriteRunning?.setFlipX(false);
            this.spriteRunning.play("herorun", true);

        } else {
            this.spriteRunning.stop();
            this.spriteRunning.setVisible(false);

            this.spriteIdle?.play("heroidle", true);
            this.spriteIdle?.setVisible(true);
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

        const animConfigRunning = {
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
        
        this.anims.create(animConfigRunning);
        
        this.spriteRunning = this.add.sprite(window.innerWidth / 2, window.innerHeight - 190, 'herorun', 'run/frame0000'); // Adjust the initial frame name to match JSON
        this.spriteRunning.setDisplaySize(300, 300); // Set the display size of the sprite
        this.spriteRunning.setVisible(false);

        const animConfigIdle = {
            key: 'heroidle', // This is the key for the animation itself
            frames: this.anims.generateFrameNames('heroidle', { // This should match the atlas key from the preload
                prefix: 'idle/frame000', // Adjusted to match the frame names in the JSON
                start: 0, // Starting frame index is 0
                end: 2, // Ending at frame index 2 for a total of 3 frames
                zeroPad: 1 // Adjust if your frame names have leading zeros
            }),
            frameRate: 10,
            repeat: -1
        };
        
        this.anims.create(animConfigIdle);
        
        this.spriteIdle = this.add.sprite(window.innerWidth / 2, window.innerHeight - 190, 'heroidle', 'idle/frame0000'); // Adjust the initial frame name to match JSON
        this.spriteIdle.setDisplaySize(300, 300); // Set the display size of the sprite
        this.spriteIdle.setVisible(true);
        
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
        
        this.spriteRunning?.setPosition(screenWidth / 2, screenHeight - 190);
        this.spriteIdle?.setPosition(screenWidth / 2, screenHeight - 190);
        
    }

}
