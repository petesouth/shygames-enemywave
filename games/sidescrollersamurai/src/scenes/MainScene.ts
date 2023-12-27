import Phaser, { Physics } from 'phaser';
import gGameStore from '../store/store';
import { MainSceneStartGameText } from './MainSceneStartGameText';
import { Utils } from '../utils/utils';
import { SpriteHero } from '../gameobjects/SpriteHero';
import { SoundPlayer } from '../gameobjects/SoundPlayer';
import { EnemyAntiHero } from '../gameobjects/EnemyAntiHero';
import { js as EasyStarJs } from 'easystarjs';

export class MainScene extends Phaser.Scene {

    public static GOLDEN_RATIO = { width: 2065, height: 1047 };
    public static LEVEL_BONUS = 5;
    public static MAX_ENEMIES: number = 14;
    public static GROUND_HEIGHT = 50;

    private bricksTileSprite?: Phaser.GameObjects.TileSprite | null;
    private mountainRangeSprite?: Phaser.GameObjects.TileSprite | null;
    private skySprite?: Phaser.GameObjects.TileSprite | null;
    private cloudsSprite?: Phaser.GameObjects.TileSprite | null;
    private mainSceneStartGameText: MainSceneStartGameText = new MainSceneStartGameText(this);
    protected spriteHero?: SpriteHero;
    protected enemyAntiHero?: EnemyAntiHero;

    protected cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
    protected groundGroup?: Phaser.Physics.Arcade.StaticGroup;
    protected groundGroupBody?: Phaser.Physics.Arcade.Sprite;
    protected floatingPlatformBodies: Phaser.Physics.Arcade.Image[] = [];
    protected colliders: Physics.Arcade.Collider[] = [];
    protected soundPlayer!: SoundPlayer;
    protected distanceLeft: number = 0;
    protected distanceRight: number = 0;
    protected easyJs: EasyStarJs = new EasyStarJs();

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
                this.enemyAntiHero?.applyToAllSprites((enemySprite)=>{
                    if( this.groundGroup ) this.physics.add.collider(enemySprite, this.groundGroup);
                    this.physics.add.collider(sprite, enemySprite );
                });
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
        }, 20000);
        // Create Debug Graphics if needed to visualize the bodies
        // this.physics.world.createDebugGraphic();

    }

    update() {

        if (!this.mountainRangeSprite || !this.cloudsSprite || !this.skySprite || !this.bricksTileSprite) {
            return;
        }

        const w = window.innerWidth;
        const h = window.innerHeight;

        this.mainSceneStartGameText.displayGameText();
        const distanceIncrement = 4;

        if (this.cursorKeys?.left.isDown) {
            this.bricksTileSprite.tilePositionX -= distanceIncrement;
            this.mountainRangeSprite.tilePositionX -= distanceIncrement / 2;
            this.skySprite.tilePositionX -= distanceIncrement / 6;
            this.cloudsSprite.tilePositionX -= distanceIncrement / 4;

            this.distanceLeft += distanceIncrement;
            this.distanceRight -= distanceIncrement;
            this.floatingPlatformBodies.forEach((gameObject) => {
                gameObject.x += distanceIncrement;
            });
            this.spriteHero?.drawMines(distanceIncrement);
            this.spriteHero?.drawBullets(distanceIncrement);

            this.enemyAntiHero?.drawMines(distanceIncrement);
            this.enemyAntiHero?.drawBullets(distanceIncrement);


            
        } else if (this.cursorKeys?.right.isDown) {
            this.bricksTileSprite.tilePositionX += distanceIncrement;
            this.mountainRangeSprite.tilePositionX += distanceIncrement / 2;
            this.skySprite.tilePositionX += distanceIncrement / 6;
            this.cloudsSprite.tilePositionX += distanceIncrement / 4;

            this.distanceRight += distanceIncrement;
            this.distanceLeft -= distanceIncrement;
            this.floatingPlatformBodies.forEach((gameObject) => {
                gameObject.x -= distanceIncrement;
            });
            this.spriteHero?.drawMines(-distanceIncrement);
            this.spriteHero?.drawBullets(-distanceIncrement);

            this.enemyAntiHero?.drawMines(-distanceIncrement);
            this.enemyAntiHero?.drawBullets(-distanceIncrement);
            
        } else {
            this.spriteHero?.drawMines();
            this.spriteHero?.drawBullets();

            this.enemyAntiHero?.drawMines();
            this.enemyAntiHero?.drawBullets();
        }

        this.groundGroup?.refresh();

        this.spriteHero?.drawHeroSprite();
        this.enemyAntiHero?.drawHeroSprite();

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

    public handleWindowResize(screenWidth: number, screenHeight: number) {
        
        if( ! this.cursorKeys ) return;
        
        this.repositionResizeTheGameAndWorld(screenWidth, screenHeight);
        
        this.resizeCreateUpdateMountainsSkyClouds(screenWidth, screenHeight);
        
        this.resizeCrateUpdateTheGround(screenWidth, screenHeight); // Refresh the physics body to apply the size change
          
        this.resizeCreateUpdateCharacters(screenWidth);
        

        this.generatePlatforms();
        this.repositionPlatforms(screenWidth, screenHeight);

        this.mainSceneStartGameText.repositionStartGameText(screenWidth);

        
    }


    protected repositionResizeTheGameAndWorld(screenWidth: number, screenHeight: number) {
        const ThirtyPercent = screenWidth * .3;
        this.physics.world.setBounds(ThirtyPercent, 0, screenWidth - (2 * ThirtyPercent), screenHeight);
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.physics.world.update(0, 0);
    }

    protected resizeCreateUpdateMountainsSkyClouds(screenWidth: number, screenHeight: number) {
        if (this.mountainRangeSprite) {
            this.mountainRangeSprite.destroy();
        }

        if (this.cloudsSprite) {
            this.cloudsSprite.destroy();
        }

        if (this.skySprite) {
            this.skySprite.destroy();
        }

        this.mountainRangeSprite = this.add.tileSprite(0, 0, screenWidth, 320, "grassmountains");
        this.mountainRangeSprite.setDepth(-10);
        this.mountainRangeSprite.setDisplaySize(screenWidth, screenHeight + (screenHeight * .4) );
        this.mountainRangeSprite.setPosition(screenWidth / 2, (screenHeight / 2) - (screenHeight * .2) );
        this.mountainRangeSprite.update();
        this.mountainRangeSprite.setVisible(true);
        

        this.skySprite = this.add.tileSprite(0, 0, screenWidth, 320, "sky");
        this.skySprite.setDepth(-11);
        Utils.resizeImateToRatio(this.skySprite, screenWidth, screenHeight * .8);
        
        
        this.cloudsSprite = this.add.tileSprite(0, 0, screenWidth, 320, "clouds");
        this.cloudsSprite.setDepth(-11);
        Utils.resizeImateToRatio(this.cloudsSprite, screenWidth, screenHeight * .8);
        
  
    }

    protected resizeCrateUpdateTheGround(screenWidth: number, screenHeight: number) {
        if (this.bricksTileSprite) {
            this.bricksTileSprite.destroy();
        }


        this.bricksTileSprite = this.add.tileSprite(0, 0, screenWidth, MainScene.GROUND_HEIGHT, "bricks2");
        this.bricksTileSprite.setDepth( 1 );
        
        this.bricksTileSprite.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT);
        this.bricksTileSprite.setPosition(screenWidth / 2, screenHeight);
        this.bricksTileSprite.tilePositionX = 0;
        this.bricksTileSprite.tilePositionY = 0;
        this.bricksTileSprite.update();

        if (!this.groundGroup || !this.groundGroupBody) {
            this.groundGroup = this.physics.add.staticGroup();
            this.groundGroupBody = this.groundGroup.create(0, screenHeight) as Phaser.Physics.Arcade.Sprite;

        }


        this.groundGroupBody.setDisplaySize(screenWidth, MainScene.GROUND_HEIGHT);
        this.groundGroupBody.setPosition(screenWidth / 2, screenHeight);
        this.groundGroupBody.setVisible(false);
        this.groundGroupBody.refreshBody();
        this.bricksTileSprite.tilePositionX = 0;
        
    }

    protected resizeCreateUpdateCharacters(screenWidth: number) {
        if (!this.spriteHero) {
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


        if (!this.enemyAntiHero) {
            this.enemyAntiHero = new EnemyAntiHero(this, this.cursorKeys, this.soundPlayer);
            this.enemyAntiHero.createHeroSprite();
        } else {
            this.enemyAntiHero.soundPlayer = this.soundPlayer;
        }

        this.enemyAntiHero.resizeEvent(screenWidth / 2, 0);
        this.enemyAntiHero.applyToAllSprites((sprite) => {
            if (this.groundGroup) {
                this.colliders.push(this.physics.add.collider(sprite, this.groundGroup));
            }
        });
    }

    // New method to reposition platforms
    protected repositionPlatforms(screenWidth: number, screenHeight: number) {
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
