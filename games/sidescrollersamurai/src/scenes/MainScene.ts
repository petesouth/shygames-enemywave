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
    public static GROUND_HEIGHT = 50;


    private bricksTileSprite?: Phaser.GameObjects.TileSprite | null;
    private forestTileSprite?: Phaser.GameObjects.TileSprite | null;
    private mainSceneStartGameText: MainSceneStartGameText = new MainSceneStartGameText(this);
    protected spriteHero?: SpriteHero
    protected cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
    protected groundGroup?: Phaser.Physics.Arcade.StaticGroup;
    protected groundGroupBody?: Phaser.Physics.Arcade.Sprite;
    protected floatingPlatformBodies: Phaser.Physics.Arcade.Image[] = [];
    protected colliders: Physics.Arcade.Collider[] = [];
    protected soundPlayer!: SoundPlayer;
    protected distanceLeft: number = 0;
    protected distanceRight: number = 0;


    constructor() {
        super('MainScene');
    }



    generatePlatforms() {
        if (!this.groundGroup) {
            return;
        }

        const { screenWidth, screenHeight } = {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
        };

        const horizontalGapMin = 100;
        const minYPosition = 220;
        const maxYPosition = screenHeight - (MainScene.GROUND_HEIGHT + 40);

        let lastPlatformEndX = 0;

        const displayPlatformHeight = MainScene.GROUND_HEIGHT / 2;


        let isCreated: boolean = (this.floatingPlatformBodies && this.floatingPlatformBodies.length > 0);


        for (let i = 0;
            ((isCreated === false && i < 300) ||
                (isCreated === true && i < this.floatingPlatformBodies.length)); i++) {

            let randomWidth = Phaser.Math.Between(screenWidth * .1, screenWidth * .30);
            const randomYPos = Phaser.Math.Between(minYPosition, maxYPosition);
            let randomXPos = Phaser.Math.Between(lastPlatformEndX + horizontalGapMin, lastPlatformEndX + horizontalGapMin + 200);

            // Create platform, set its position, and anchor point to the center
            let platform = (isCreated) ? this.floatingPlatformBodies[i] : this.groundGroup.create(randomXPos, randomYPos, "bricks2") as Phaser.Physics.Arcade.Sprite;

            platform.setDisplaySize(randomWidth, displayPlatformHeight);
            platform.setPosition(randomXPos, randomYPos);
            platform.x = randomXPos;
            platform.y = randomYPos;
            platform.setVisible(true);
            platform.refreshBody();

            if (isCreated === false) {
                this.floatingPlatformBodies.push(platform);
            }

            // Update for next platform
            lastPlatformEndX = platform.x + platform.displayWidth / 2;
        }

        // Collider for the hero sprite with the platform
        this.spriteHero?.applyToAllSprites((sprite) => {
            if (this.groundGroup) {
                this.physics.add.collider(sprite, this.groundGroup);
            }
        });


    }



    create() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
   
        this.game.scale.resize(screenWidth, screenHeight);
        this.game.scale.refresh();

        this.cursorKeys = (this.input?.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys);
        this.soundPlayer = new SoundPlayer(this);

        this.soundPlayer.playGameSongSound();
        this.handleWindowResize(screenWidth, screenHeight);

        this.mainSceneStartGameText.createStartGameText();


        setTimeout(() => {
            this.mainSceneStartGameText.hideLevelInstructionsText();
        }, 10000);
        // Create Debug Graphics if needed to visualize the bodies
        //this.physics.world.createDebugGraphic();

    }

    update() {

        if (!this.forestTileSprite || !this.bricksTileSprite) {
            return;
        }

        const w = window.innerWidth;
        const h = window.innerHeight;

        this.mainSceneStartGameText.displayGameText();
        const distanceIncrement = 4;

        if (this.cursorKeys?.left.isDown) {
            this.bricksTileSprite.tilePositionX -= distanceIncrement;
            this.forestTileSprite.tilePositionX -= distanceIncrement;

            this.distanceLeft += distanceIncrement;
            this.distanceRight -= distanceIncrement;
            this.floatingPlatformBodies.forEach((gameObject) => {
                gameObject.x += distanceIncrement;
            });
            this.spriteHero?.drawMines(distanceIncrement);
            this.spriteHero?.drawBullets(distanceIncrement);
        } else if (this.cursorKeys?.right.isDown) {
            this.bricksTileSprite.tilePositionX += distanceIncrement;
            this.forestTileSprite.tilePositionX += distanceIncrement;
            this.distanceRight += distanceIncrement;
            this.distanceLeft -= distanceIncrement;
            this.floatingPlatformBodies.forEach((gameObject) => {
                gameObject.x -= distanceIncrement;
            });
            this.spriteHero?.drawMines(-distanceIncrement);
            this.spriteHero?.drawBullets(-distanceIncrement);
        } else {
            this.spriteHero?.drawMines();
            this.spriteHero?.drawBullets();
        }

        this.groundGroup?.refresh();

        this.spriteHero?.drawHeroSprite();

    }

    removeGroupBodies() {

        if (this.groundGroupBody) {

            this.groundGroup?.remove(this.groundGroupBody);

            this.colliders.forEach((collider) => {
                this.physics.world.removeCollider(collider);
                collider.destroy();
            });
            this.colliders = [];
        }
    }

    handleWindowResize(screenWidth: number, screenHeight: number) {
        

        // Destroy existing tiles if they exist
        if (this.bricksTileSprite) {
            this.bricksTileSprite.destroy();
        }

        if (this.forestTileSprite) {
            this.forestTileSprite.destroy();
        }
        this.forestTileSprite = this.add.tileSprite(0, 0, 1792, 948, "background23");
        this.bricksTileSprite = this.add.tileSprite(0, 0, screenWidth, MainScene.GROUND_HEIGHT, "bricks2");
        this.forestTileSprite.setDepth( -10 );
        this.bricksTileSprite.setDepth( 1 );
        this.game.scale.resize(screenWidth, screenHeight);
        this.game.scale.refresh();

        this.mainSceneStartGameText.repositionStartGameText(screenWidth);

        const ThirtyPercent = screenWidth * .3;
        this.physics.world.setBounds(ThirtyPercent, 0, screenWidth - (2 * ThirtyPercent), screenHeight);
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.world.update(0, 0);

        Utils.resizeImateToRatio(this.forestTileSprite, screenWidth, screenHeight);

        this.bricksTileSprite.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT);
        this.bricksTileSprite.setPosition(screenWidth / 2, screenHeight);
        this.bricksTileSprite.tilePositionX = 0;
        this.bricksTileSprite.tilePositionY = 0;
        this.bricksTileSprite.update();

        if (!this.groundGroup || !this.groundGroupBody) {
            // this.removeGroupBodies();
            this.groundGroup = this.physics.add.staticGroup();
            this.groundGroupBody = this.groundGroup.create(0, screenHeight) as Phaser.Physics.Arcade.Sprite;

        }


        this.groundGroupBody.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT);
        this.groundGroupBody.setPosition(screenWidth / 2, screenHeight);
        this.groundGroupBody.setVisible(false);
        this.groundGroupBody.refreshBody(); // Refresh the physics body to apply the size change


          
        if( ! this.spriteHero ) {
            this.spriteHero = new SpriteHero(this, this.cursorKeys, this.soundPlayer);
            this.spriteHero.createHeroSprite();
        } else {
            this.spriteHero.soundPlayer = this.soundPlayer;
        }

        this.spriteHero.resizeEvent(screenWidth / 4, 0);
        this.spriteHero.applyToAllSprites((sprite) => {
            if (this.groundGroup) {
                this.colliders.push(this.physics.add.collider(sprite, this.groundGroup));
            }
        });

        this.generatePlatforms();
        this.repositionPlatforms(screenWidth, screenHeight);

        this.bricksTileSprite.tilePositionX = 0;
        this.forestTileSprite.tilePositionX = 0;
    }


    // New method to reposition platforms
    repositionPlatforms(screenWidth: number, screenHeight: number) {
        // Example logic - you might need to adjust this based on your game's design
        const horizontalGapMin = 100;
        let lastPlatformEndX = 0;

        this.floatingPlatformBodies.forEach((platform, index) => {
            let randomXPos = Phaser.Math.Between(lastPlatformEndX + horizontalGapMin, lastPlatformEndX + horizontalGapMin + 200);
            platform.x = randomXPos;
            lastPlatformEndX = platform.x + platform.displayWidth / 2;
        });
    }


}
