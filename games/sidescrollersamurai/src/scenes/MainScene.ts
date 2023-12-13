import Phaser, { Physics } from 'phaser';
import gGameStore from '../store/store';
import { MainSceneStartGameText } from './MainSceneStartGameText';
import { Utils } from '../utils/utils';
import { SpriteHero } from '../gameobjects/SpriteHero';
import { SoundPlayer } from '../gameobjects/SoundPlayer';


export class MainScene extends Phaser.Scene {

    public static GOLDEN_RATIO = { width: 2065, height: 1047 };
    public static LEVEL_BONUS = 5;
    public static MAX_ENEMIES: number = 14;
    public static GROUND_HEIGHT = 100;
    public static GROUND_BODY_ExTRA = 30;


    private bricksTileSprite?: Phaser.GameObjects.TileSprite | null;
    private forestTileSprite?: Phaser.GameObjects.TileSprite | null;
    private mainSceneStartGameText: MainSceneStartGameText = new MainSceneStartGameText(this);
    protected spriteHero?: SpriteHero
    protected cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
    protected groundGroup?: Phaser.Physics.Arcade.StaticGroup;
    protected groupGroundBody: any[] = [];
    protected colliders: Physics.Arcade.Collider[] = [];
    protected soundPlayer!: SoundPlayer;
    protected distanceLeft: number = 0;
    protected distanceRight: number = 0;

    constructor() {
        super('MainScene');
    }

    generatePlatforms() {
        if (!this.groundGroup || !this.groupGroundBody || this.distanceRight < 1 || this.groupGroundBody.length > 2) return;

        const { screenWidth, screenHeight } = {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight
        };

        const howManyPerScreen = 5;
        const screenDiv = (this.distanceRight / screenWidth);

        const randomPlatforms = Phaser.Math.Between(1, 6);

        for (let i = 0; i < randomPlatforms; i++) {
            this.groupGroundBody.push(this.groundGroup.create(0, screenHeight));
        }

        this.groupGroundBody.forEach((body) => {
            const randomWidth = Phaser.Math.Between(screenWidth / 6, screenWidth / 2);
            const randomYPos = screenHeight - (screenHeight * .20);
            body.setDisplaySize(randomWidth, MainScene.GROUND_HEIGHT);
            body.setPosition(screenWidth + 100, randomYPos);
            body.setVisible(true);
            body.refreshBody(); // Refresh the physics body to apply the size change
        });


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

        this.generatePlatforms();


        this.mainSceneStartGameText.displayGameText();

        if (this.cursorKeys?.left.isDown) {
            this.bricksTileSprite.tilePositionX -= 2;
            this.forestTileSprite.tilePositionX -= 2;
            this.distanceLeft += 4;
            this.distanceRight -= 4;
            for( let i = 1; i < this.groupGroundBody.length; ++ i ){
                let gameObject = this.groupGroundBody[i];
                if ((gameObject instanceof Phaser.Physics.Arcade.Sprite) === false) {
                    return;
                }
                let tGameObject = (gameObject as Phaser.Physics.Arcade.Sprite);
                tGameObject.x += 4;
            };
        } else if (this.cursorKeys?.right.isDown) {
            this.bricksTileSprite.tilePositionX += 2;
            this.forestTileSprite.tilePositionX += 2;
            this.distanceRight += 4;
            this.distanceLeft -= 4;
            for( let i = 1; i < this.groupGroundBody.length; ++ i ){
                let gameObject = this.groupGroundBody[i];
                if ((gameObject instanceof Phaser.Physics.Arcade.Sprite) === false) {
                    return;
                }
                let tGameObject = (gameObject as Phaser.Physics.Arcade.Sprite);
                tGameObject.x -= 4;
            };
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
        this.forestTileSprite = this.add.tileSprite(0, 0, 1792, 948, "background23");
        this.bricksTileSprite = this.add.tileSprite(0, 0, screenWidth, MainScene.GROUND_HEIGHT, "bricks2");
        this.spriteHero = new SpriteHero(this, this.cursorKeys);
        this.spriteHero.createHeroSprite();

        this.handleWindowResize(screenWidth, screenHeight);

    }

    removeGroupBodies() {
        if (this.groupGroundBody) {

            this.groupGroundBody.forEach((body) => {
                this.groundGroup?.remove(body);
                body.destroy();
            });

            this.groupGroundBody = [];

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

        this.mainSceneStartGameText.repositionStartGameText(screenWidth);

        this.physics.world.setBounds(0, 0, screenWidth, screenHeight);
        this.physics.world.setBoundsCollision(true, true, false, true);
        this.physics.world.update(0, 0);

        Utils.resizeStarBackground(this.forestTileSprite, screenWidth, screenHeight);

        this.bricksTileSprite.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT);
        this.bricksTileSprite.setPosition(screenWidth / 2, screenHeight);

        this.removeGroupBodies();
        this.groundGroup = this.physics.add.staticGroup();

        this.groupGroundBody.push(this.groundGroup.create(0, screenHeight));

        this.groupGroundBody.forEach((body) => {
            body.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT);
            body.setPosition(screenWidth / 2, screenHeight + MainScene.GROUND_BODY_ExTRA);
            body.setVisible(true);
            body.refreshBody(); // Refresh the physics body to apply the size change
        });



        this.spriteHero.resizeEvent(screenWidth / 4, 0);
        this.spriteHero.applyToAllSprites((sprite) => {
            if (this.groundGroup) {
                this.colliders.push(this.physics.add.collider(sprite, this.groundGroup));
            }
        });
    }


}
