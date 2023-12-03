import Phaser, { Physics } from 'phaser';
import gGameStore from '../store/store';
import { MainSceneStartGameText } from './MainSceneStartGameText';
import { Utils } from '../utils/utils';


class SpriteHero {


    private spriteRunning?: Phaser.Physics.Arcade.Sprite | null;
    private spriteIdle?: Phaser.Physics.Arcade.Sprite | null;
    private spriteJump?: Phaser.GameObjects.Sprite | null;


    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    protected scene: Phaser.Scene;



    constructor(scene: Phaser.Scene, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.scene = scene;
        this.cursors = cursors;
    }

    drawHeroSprite() {
        if (!this.spriteRunning) {
            return;
        }

        if (this.cursors.left.isDown) {

            this.spriteIdle?.stop();
            this.spriteIdle?.setFlipX(true);
            this.spriteIdle?.setVisible(false);

            this.spriteRunning.setVisible(true);
            this.spriteRunning?.setFlipX(true);
            this.spriteRunning.play("herorun", true);

        } else if (this.cursors.right.isDown) {

            this.spriteIdle?.stop();
            this.spriteIdle?.setFlipX(false);
            this.spriteIdle?.setVisible(false);

            this.spriteRunning.setVisible(true);
            this.spriteRunning?.setFlipX(false);
            this.spriteRunning.play("herorun", true);

        } else if (this.cursors.up.isDown) {

            this.spriteIdle?.stop();
            this.spriteIdle?.setFlipX(false);
            this.spriteIdle?.setVisible(false);
            this.spriteIdle?.setVelocityY(-330);

            this.spriteRunning.setVisible(true);
            this.spriteRunning?.setFlipX(false);
            this.spriteRunning?.play("herorun", true);
            this.spriteRunning?.setVelocityY(-330);

        } else {
            this.spriteRunning.stop();
            this.spriteRunning.setVisible(false);

            this.spriteIdle?.play("heroidle", true);
            this.spriteIdle?.setVisible(true);
        }

        const y = this.spriteRunning?.getBottomCenter().y;
        if (this.cursors.up.isUp && y && y < (window.innerHeight - 50)) {
            this.spriteRunning?.setVelocityY(200);
            this.spriteIdle?.setVelocityY(200);
        } else if (this.cursors.up.isUp) {
            this.spriteRunning?.setVelocityY(0);
            this.spriteIdle?.setVelocityY(0);
        }
    }

    createHeroSprite() {
        const animConfigRunning = {
            key: 'herorun', // This is the key for the animation itself
            frames: this.scene.anims.generateFrameNames('herorun', { // This should match the atlas key from the preload
                prefix: 'run/frame000', // Adjusted to match the frame names in the JSON
                start: 0, // Starting frame index is 0
                end: 8, // Ending at frame index 2 for a total of 3 frames
                zeroPad: 1 // Adjust if your frame names have leading zeros
            }),
            frameRate: 10,
            repeat: -1
        };

        this.scene.anims.create(animConfigRunning);

        this.spriteRunning = this.scene.physics.add.sprite(window.innerWidth / 2, window.innerHeight - 190, 'herorun', 'run/frame0000'); // Adjust the initial frame name to match JSON
        this.spriteRunning.setDisplaySize(300, 300); // Set the display size of the sprite
        this.spriteRunning.setVisible(false);
        this.spriteRunning.setBounce(.2);
        this.spriteRunning.setCollideWorldBounds(true);

        const animConfigJump = {
            key: 'herojump', // This is the key for the animation itself
            frames: this.scene.anims.generateFrameNames('herojump', { // This should match the atlas key from the preload
                prefix: 'jump/frame000', // Adjusted to match the frame names in the JSON
                start: 0, // Starting frame index is 0
                end: 8, // Ending at frame index 2 for a total of 3 frames
                zeroPad: 1 // Adjust if your frame names have leading zeros
            }),
            frameRate: 10,
            repeat: -1
        };

        this.scene.anims.create(animConfigJump);

        this.spriteJump = this.scene.add.sprite(window.innerWidth / 2, window.innerHeight - 190, 'herojump', 'jump/frame0000'); // Adjust the initial frame name to match JSON
        this.spriteJump.setDisplaySize(300, 300); // Set the display size of the sprite
        this.spriteJump.setVisible(false);

        const animConfigIdle = {
            key: 'heroidle', // This is the key for the animation itself
            frames: this.scene.anims.generateFrameNames('heroidle', { // This should match the atlas key from the preload
                prefix: 'idle/frame000', // Adjusted to match the frame names in the JSON
                start: 0, // Starting frame index is 0
                end: 2, // Ending at frame index 2 for a total of 3 frames
                zeroPad: 1 // Adjust if your frame names have leading zeros
            }),
            frameRate: 10,
            repeat: -1
        };

        this.scene.anims.create(animConfigIdle);

        this.spriteIdle = this.scene.physics.add.sprite(window.innerWidth / 2, window.innerHeight - 190, 'heroidle', 'idle/frame0000'); // Adjust the initial frame name to match JSON
        this.spriteIdle.setDisplaySize(300, 300); // Set the display size of the sprite
        this.spriteIdle.setVisible(true);
    }


    resizeWindowEvent(screenWidth: number, screenHeight: number) {
        this.spriteRunning?.setPosition(screenWidth / 2, screenHeight - 190);
        this.spriteIdle?.setPosition(screenWidth / 2, screenHeight - 190);
    }
}


export class MainScene extends Phaser.Scene {

    public static GOLDEN_RATIO = { width: 2065, height: 1047 };
    public static LEVEL_BONUS = 5;
    static MAX_ENEMIES: number = 14;

    private bricksTileSprite?: Phaser.GameObjects.TileSprite | null;
    private forestTileSprite?: Phaser.GameObjects.TileSprite | null;
    private gamesongSound?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private mainSceneStartGameText: MainSceneStartGameText = new MainSceneStartGameText(this);
    protected spriteHero?: SpriteHero
    protected cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
    protected groundGroup?: Phaser.Physics.Arcade.StaticGroup;


    constructor() {
        super('MainScene');

    }


    create() {

        this.cursorKeys = this.input?.keyboard?.createCursorKeys();

        this.gamesongSound = this.sound.add('gamesong', { loop: true, volume: 1 });


        this.createBackgroundImage();
        this.resizeStarBackground();

        this.mainSceneStartGameText.createStartGameText();

        if (this.cursorKeys) {
            this.spriteHero = new SpriteHero(this, this.cursorKeys);
            this.spriteHero.createHeroSprite();
        }


        this.playGameSongSound();

    }

    update() {
        if (!this.forestTileSprite || !this.bricksTileSprite) {
            return;
        }

        const w = window.innerWidth;
        const h = window.innerHeight;

        this.mainSceneStartGameText.displayGameText();

        if (this.cursorKeys?.left.isDown) {
            this.bricksTileSprite.tilePositionX -= 1;
            this.forestTileSprite.tilePositionX -= 1;
        } else if (this.cursorKeys?.right.isDown) {
            this.bricksTileSprite.tilePositionX += 1;
            this.forestTileSprite.tilePositionX += 1;
        }

        this.spriteHero?.drawHeroSprite();

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


    // handleWindowResize() {
    //     const w = window.innerWidth;
    //     const h = window.innerHeight;
    //     this.scale.setGameSize(w, h);
    //     this.resizeStarBackground();
    //     this.mainSceneStartGameText.repositionStartGameText(w);
    // }

    handleWindowResize() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        // Set the new game size
        this.scale.setGameSize(newWidth, newHeight);

        // Adjust the background size
        this.resizeStarBackground();

        // Compute the new width and height ratio for scaling
        const { ratioWidth, ratioHeight } = Utils.compuateWidthHeightRatioMax(newWidth, newHeight);

        // Resize and reposition each ground sprite in the group
        this.groundGroup?.getChildren().forEach((sprite) => {
            // Scale and reposition your ground sprites

            if (sprite instanceof Phaser.GameObjects.Image) {

                const imageObj = (sprite as Phaser.GameObjects.Image);
                imageObj.setDisplaySize(ratioWidth, ratioHeight);
                imageObj.setPosition(sprite.x * ratioWidth, newHeight - sprite.displayHeight / 2);
                imageObj.update(); // Refresh the physics body to apply changes
            }

            if (sprite instanceof Phaser.GameObjects.Sprite) {

                const imageObj = (sprite as Phaser.Physics.Arcade.Sprite);
                imageObj.setDisplaySize(ratioWidth, ratioHeight);
                imageObj.setPosition(sprite.x * ratioWidth, newHeight - sprite.displayHeight / 2);
                imageObj.refreshBody(); // Refresh the physics body to apply changes
            }


        });

        // Update the position of the hero sprite, if necessary
        // This assumes you have a method in your SpriteHero class to handle resizing
        this.spriteHero?.resizeWindowEvent(newWidth / 2, newHeight - 190);
    }


    createBackgroundImage() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

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

        this.groundGroup = this.physics.add.staticGroup();

        // Create and add ground sprites to the group
        // Adjust the positioning and sizing as necessary
        this.groundGroup.create(0, screenHeight - 190, 'groundSprite').setScale(1).refreshBody();



    }


    public resizeStarBackground() {
        if (!this.bricksTileSprite || !this.forestTileSprite) {
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
        this.forestTileSprite.setPosition(screenWidth / 2, (screenHeight / 2));

        this.bricksTileSprite.setDisplaySize(screenWidth, 100);
        this.bricksTileSprite.setPosition(screenWidth / 2, screenHeight - 10);
        

        this.spriteHero?.resizeWindowEvent(screenWidth / 2, screenHeight - 190);

    }

}
