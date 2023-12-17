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


    /*
    generatePlatforms() {
        if (!this.spriteHero ||
            !this.groundGroup ||
            !this.floatingPlatformBodies ||
            this.floatingPlatformBodies.length > 0) {
            return;
        }

        const { screenWidth, screenHeight } = {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight
        };

        let lastPlatformRightEdge = 0;
        const horizontalGapMin = 50; // Minimum horizontal gap between platforms
        const horizontalGapMax = 150; // Maximum horizontal gap
        
        // Define vertical range for platform placement
        const minYPosition = screenHeight - (screenHeight * 0.60); // 60% height from the bottom
        const maxYPosition = screenHeight - 400; // 100 pixels off the ground
        
        for (let i = 0; i < 100; i++) {
            const randomWidth = Phaser.Math.Between(100, 700); // Platform width between 100 and 700
            const randomYPos = Phaser.Math.Between(minYPosition, maxYPosition); // Random Y position within the defined range
        
            // Calculate a random horizontal gap
            const horizontalGap = Phaser.Math.Between(horizontalGapMin, horizontalGapMax);
            
            // Calculate the new platform's left edge
            const newPlatformLeftEdge = lastPlatformRightEdge + horizontalGap;
        
            let platform = this.add.tileSprite(0, 0, randomWidth, MainScene.GROUND_HEIGHT / 2, "bricks2");
            platform.setDisplaySize(randomWidth, MainScene.GROUND_HEIGHT / 2);
            platform.setPosition(newPlatformLeftEdge, randomYPos);
            platform.setVisible(true);
        
            this.floatingPlatformBodies.push(platform);
        
            // Update the right edge for the next iteration
            lastPlatformRightEdge = newPlatformLeftEdge + randomWidth;
        }        
       
    }
*/
    generatePlatforms() {
        if (!this.groundGroup) {
            return;
        }

        const { screenWidth, screenHeight } = {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
        };

        const horizontalGapMin = 100;
        const minYPosition = screenHeight / 1.7
        const maxYPosition = screenHeight - 200;

        let lastPlatformEndX = 0;

        const displayPlatformHeight = Utils.computeRatioValue(MainScene.GROUND_HEIGHT / 2);


        let isCreated:boolean = (this.floatingPlatformBodies && this.floatingPlatformBodies.length > 0);


        for (let i = 0; 
            ((isCreated === false && i < 300) || 
            (isCreated === true && i < this.floatingPlatformBodies.length) ); i++) {

            let randomWidth = Phaser.Math.Between(screenWidth * .1, screenWidth * .30);
            const randomYPos = Phaser.Math.Between(minYPosition, maxYPosition);
            let randomXPos = Phaser.Math.Between(lastPlatformEndX + horizontalGapMin, lastPlatformEndX + horizontalGapMin + 200);

            // Create platform, set its position, and anchor point to the center
            let platform = (isCreated ) ? this.floatingPlatformBodies[i] : this.groundGroup.create(randomXPos, randomYPos, "bricks4") as Phaser.Physics.Arcade.Sprite;

            platform.setDisplaySize(randomWidth, displayPlatformHeight);
            platform.setPosition(randomXPos, randomYPos);
            platform.setVisible(true);
            platform.refreshBody();

            if( isCreated === false ) {
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





        // Create Debug Graphics if needed to visualize the bodies
        //this.physics.world.createDebugGraphic();
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
            this.bricksTileSprite.tilePositionX -= 4;
            this.forestTileSprite.tilePositionX -= 2;
            this.distanceLeft += 4;
            this.distanceRight -= 4;
            this.floatingPlatformBodies.forEach((gameObject) => {
                gameObject.x += 4;
                gameObject.refreshBody();
            });
        } else if (this.cursorKeys?.right.isDown) {
            this.bricksTileSprite.tilePositionX += 4;
            this.forestTileSprite.tilePositionX += 2;
            this.distanceRight += 4;
            this.distanceLeft -= 4;
            this.floatingPlatformBodies.forEach((gameObject) => {
                gameObject.x -= 4;
                gameObject.refreshBody();
            });
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
        if (!this.forestTileSprite || !this.bricksTileSprite || !this.spriteHero) {
            return;
        }



        this.mainSceneStartGameText.repositionStartGameText(screenWidth);

        this.physics.world.setBounds(0, 0, screenWidth, screenHeight);
        this.physics.world.setBoundsCollision(true, true, false, true);

        Utils.resizeImateToRatio(this.forestTileSprite, screenWidth, screenHeight);

        this.bricksTileSprite.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT);
        this.bricksTileSprite.setPosition(screenWidth / 2, screenHeight);

        if (!this.groundGroup || !this.groundGroupBody) {
            // this.removeGroupBodies();
            this.groundGroup = this.physics.add.staticGroup();
            this.groundGroupBody = this.groundGroup.create(0, screenHeight) as Phaser.Physics.Arcade.Sprite;

        }


        this.groundGroupBody.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT);
        this.groundGroupBody.setPosition(screenWidth / 2, screenHeight);
        this.groundGroupBody.setVisible(false);
        this.groundGroupBody.refreshBody(); // Refresh the physics body to apply the size change



        this.spriteHero.resizeEvent(screenWidth / 4, 0);
        this.spriteHero.applyToAllSprites((sprite) => {
            if (this.groundGroup) {
                this.colliders.push(this.physics.add.collider(sprite, this.groundGroup));
            }
        });

        this.generatePlatforms();

    }


}
