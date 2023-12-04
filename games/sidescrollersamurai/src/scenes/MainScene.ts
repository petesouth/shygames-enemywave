import Phaser, { Physics } from 'phaser';
import gGameStore from '../store/store';
import { MainSceneStartGameText } from './MainSceneStartGameText';
import { Utils } from '../utils/utils';
import { SpriteHero } from '../gameobjects/SpriteHero';


export class MainScene extends Phaser.Scene {


    public static GOLDEN_RATIO = { width: 2065, height: 1047 };
    public static LEVEL_BONUS = 5;
    public static MAX_ENEMIES: number = 14;
    public static GROUND_HEIGHT = 200;

    private bricksTileSprite?: Phaser.GameObjects.TileSprite | null;
    private forestTileSprite?: Phaser.GameObjects.TileSprite | null;
    private gamesongSound?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private mainSceneStartGameText: MainSceneStartGameText = new MainSceneStartGameText(this);
    protected spriteHero?: SpriteHero
    protected cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
    protected groundGroup?: Phaser.Physics.Arcade.StaticGroup;
    protected groupGroundBody: any;

    constructor() {
        super('MainScene');
    }


    create() {

        this.cursorKeys = this.input?.keyboard?.createCursorKeys();

        this.gamesongSound = this.sound.add('gamesong', { loop: true, volume: 1 });


        this.createBackgroundImage();
        this.mainSceneStartGameText.createStartGameText();

        if (this.cursorKeys && this.groundGroup) {
            this.spriteHero = new SpriteHero(this, this.cursorKeys, this.groundGroup);
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
            this.groupGroundBody.refreshBody();
            this.forestTileSprite.tilePositionX += 1;
        }

        this.spriteHero?.drawHeroSprite();

    }

    public playGameSongSound(): void {
        if (this.gamesongSound && !this.gamesongSound.isPlaying) {
        //    this.gamesongSound.play();
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

    createBackgroundImage() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        this.game.scale.resize(screenWidth, screenHeight);
        this.game.scale.refresh();

        // Destroy existing tiles if they exist
        if (this.bricksTileSprite) {
            this.bricksTileSprite.destroy();
        }

        if (this.forestTileSprite) {
            this.forestTileSprite.destroy();
        }

        // Create the forest background, covering the entire screen
        this.forestTileSprite = this.add.tileSprite(0, 0, 1420, 528, "background22");
        this.forestTileSprite.setDisplaySize(screenWidth, screenHeight);
        this.forestTileSprite.setPosition(screenWidth / 2, screenHeight / 2);


        this.bricksTileSprite = this.add.tileSprite(0, 0, screenWidth, MainScene.GROUND_HEIGHT, "bricks2");
        this.bricksTileSprite.setPosition(screenWidth / 2, screenHeight - (MainScene.GROUND_HEIGHT - 228));

        this.groundGroup = this.physics.add.staticGroup();
        this.groupGroundBody = this.groundGroup.create(screenWidth / 2, screenHeight - (MainScene.GROUND_HEIGHT - 260) / 2);
        this.groupGroundBody.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT); // Make the physics body match the size of the bricksTileSprite
        this.groupGroundBody.setPosition(screenWidth / 2, screenHeight - (MainScene.GROUND_HEIGHT - 260));
        this.groupGroundBody.setVisible(false);
        this.groupGroundBody.refreshBody(); // Refresh the physics body to apply the size change

    }

    handleWindowResize() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        this.game.scale.resize(screenWidth, screenHeight);
        this.game.scale.refresh();

        this.forestTileSprite?.setDisplaySize(screenWidth, screenHeight);
        this.forestTileSprite?.setPosition(screenWidth / 2, screenHeight / 2);

        this.bricksTileSprite?.setDisplaySize( screenWidth, MainScene.GROUND_HEIGHT );
        this.bricksTileSprite?.setPosition(screenWidth / 2, screenHeight - (MainScene.GROUND_HEIGHT - 228));

        this.groupGroundBody?.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT); // Make the physics body match the size of the bricksTileSprite
        this.groupGroundBody?.setPosition(screenWidth / 2, screenHeight - (MainScene.GROUND_HEIGHT - 260));
        this.groupGroundBody?.refreshBody();
        
        this.spriteHero?.resizeEvent();
    }


}
