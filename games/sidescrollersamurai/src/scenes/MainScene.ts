import Phaser, { Physics } from 'phaser';
import gGameStore from '../store/store';
import { MainSceneStartGameText } from './MainSceneStartGameText';
import { Utils } from '../utils/utils';
import { SpriteHero, SpriteHeroAnimationState } from '../gameobjects/SpriteHero';
import { SoundPlayer } from './SoundPlayer';


export class MainScene extends Phaser.Scene {

    public static GOLDEN_RATIO = { width: 2065, height: 1047 };
    public static LEVEL_BONUS = 5;
    public static MAX_ENEMIES: number = 14;
    public static GROUND_HEIGHT = 200;
    public static GROUND_BODY_ExTRA = 30;


    private bricksTileSprite?: Phaser.GameObjects.TileSprite | null;
    private forestTileSprite?: Phaser.GameObjects.TileSprite | null;
    private mainSceneStartGameText: MainSceneStartGameText = new MainSceneStartGameText(this);
    protected spriteHero?: SpriteHero
    protected cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
    protected groundGroup?: Phaser.Physics.Arcade.StaticGroup;
    protected groupGroundBody: any;
    protected colliders: Physics.Arcade.Collider[] = [];
    protected soundPlayer!: SoundPlayer;

    constructor() {
        super('MainScene');
    }


    create() {
        this.cursorKeys = (this.input?.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys);
        this.soundPlayer = new SoundPlayer(this);
    
        this.soundPlayer.playGameSongSound();
        this.createBackgroundImage();
        this.mainSceneStartGameText.createStartGameText();
    }

    update() {
        if (!this.forestTileSprite || !this.bricksTileSprite) {
            return;
        }

        const w = window.innerWidth;
        const h = window.innerHeight;

        this.mainSceneStartGameText.displayGameText();

        if (this.cursorKeys?.left.isDown) {
            this.bricksTileSprite.tilePositionX -= 2;
            this.forestTileSprite.tilePositionX -= 2;
        } else if (this.cursorKeys?.right.isDown) {
            this.bricksTileSprite.tilePositionX += 2;
            this.groupGroundBody.refreshBody();
            this.forestTileSprite.tilePositionX += 2;
        }

        this.spriteHero?.drawHeroSprite();

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
        this.bricksTileSprite = this.add.tileSprite(0, 0, screenWidth, MainScene.GROUND_HEIGHT, "bricks2");
        this.spriteHero = new SpriteHero(this, this.cursorKeys);
        this.spriteHero.createHeroSprite();
        
        this.handleWindowResize(screenWidth, screenHeight);

    }

    removeGroupBodies()  {
        if (this.groupGroundBody) {
            this.groundGroup?.remove(this.groupGroundBody);
            this.groupGroundBody.destroy();
            this.groundGroup?.destroy();

            this.colliders.forEach((collider) => {
                this.physics.world.removeCollider(collider);
                collider.destroy();
            });
            this.colliders = [];
        }
        
    }

    handleWindowResize(screenWidth: number, screenHeight: number) {
        if (!this.forestTileSprite || !this.bricksTileSprite || !this.spriteHero) {
            return;
        }

        this.removeGroupBodies();

        this.physics.world.setBounds(0, 0, screenWidth, screenHeight);
        this.physics.world.setBoundsCollision(true, true, false, true);
        this.physics.world.update(0,0);

        this.forestTileSprite.setDisplaySize(screenWidth, screenHeight);
        this.forestTileSprite.setPosition(screenWidth / 2, screenHeight / 2);
        
        this.bricksTileSprite.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT);
        this.bricksTileSprite.setPosition(screenWidth / 2, screenHeight );

        this.groundGroup = this.physics.add.staticGroup();
        this.groupGroundBody = this.groundGroup.create(0, screenHeight);
        this.groupGroundBody.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT);
        this.groupGroundBody.setPosition(screenWidth / 2, screenHeight + MainScene.GROUND_BODY_ExTRA);
        this.groupGroundBody.setVisible(false);
        this.groupGroundBody.refreshBody(); // Refresh the physics body to apply the size change

        this.spriteHero.resizeEvent(screenWidth / 2, 0);
        this.spriteHero.applyToAllSprites((sprite) => {
            if (this.groundGroup) {
                this.colliders.push(this.physics.add.collider(sprite, this.groundGroup));
            }
        });
    }


}
