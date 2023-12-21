import Phaser from 'phaser';
import { Utils } from '../utils/utils';




export class SplashScreen extends Phaser.Scene {

    public static TEXT_TOP_PADDING = 10;
    public static IMAGE_BORDER_PADDING = 60;

    public splashText?: Phaser.GameObjects.Text;
    public gamescreenBackgroundImage?: Phaser.GameObjects.Image;

    public static textureNames = ["bricks",
        "bricks2",
        "rockwall",
        "metal"];


    constructor() {
        super('SplashScreen');

    }

    preload() {

        this.splashText = this.add.text(
            this.scale.width / 2,
            SplashScreen.TEXT_TOP_PADDING,
            'Loading Game Data...',
            { font: '900 16px Arial', color: '#ffffff' }
        );
        this.splashText?.setOrigin(.5);
        this.splashText?.setDepth(1);


        this.load.audio('thrust', 'sound/thrust.mp3');
        this.load.audio('running', 'sound/running.mp3');
        this.load.audio('sword', 'sound/sword.mp3');
        this.load.audio('missile', 'sound/missile.mp3');
        this.load.audio('impact', 'sound/impact.mp3');
        this.load.audio('sword2', 'sound/sword2.mp3');
        this.load.audio('flying', 'sound/flying.mp3');
        this.load.audio('explosion', 'sound/explosion.mp3');
        this.load.audio('gamesong', 'sound/gamesong.mp3');
        this.load.audio('fail', 'sound/fail.mp3');
        this.load.audio('success', 'sound/success.mp3');
        this.load.audio('levelcomplete', 'sound/levelcomplete.mp3');


        this.load.atlas('flares', 'images/flares.png', 'images/flares.json');
        this.load.image('gamescreen', 'images/gamescreen.png');
        this.load.image("bricks2", 'textures/bricks2.png');
        this.load.image("bricks4", 'textures/bricks4.png');


        for (let i = 21; i <= 23; ++i) {
            this.load.image("background" + i, 'backgrounds/background' + i + '.png');
        };

        this.load.atlas('heroidle', 'images/herosamurai/IDLE.png', 'images/herosamurai/IDLE.json');
        this.load.atlas('herorun', 'images/herosamurai/RUN.png', 'images/herosamurai/RUN.json');
        this.load.atlas('herojump', 'images/herosamurai/JUMP.png', 'images/herosamurai/JUMP.json');
        this.load.atlas('heroattack', 'images/herosamurai/BASICATTACK.png', 'images/herosamurai/BASICATTACK.json');
        this.load.atlas('herospecialattack', 'images/herosamurai/SPECIALATTACK.png', 'images/herosamurai/SPECIALATTACK.json');


    }

    create() {
        this.createBackgroundImage();
        this.splashText?.setText('ShyHumanGames Software - Click to Start');
        this.splashText?.setOrigin(0.5);
        this.splashText?.setDepth(1);



        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            this.scene.start('MainScene');
            pointer.event.preventDefault();
        });

    }


    public handleWindowResize(w: number, h: number) {
        this.splashText?.setPosition(w / 2, SplashScreen.TEXT_TOP_PADDING);
        this.splashText?.setDepth(1);

        if (this.gamescreenBackgroundImage) {
            Utils.resizeImateToRatio(this.gamescreenBackgroundImage, window.innerWidth, window.innerHeight);
        }
    }



    createBackgroundImage() {
        this.gamescreenBackgroundImage = this.add.image(window.innerWidth / 2,
            window.innerHeight / 2, "gamescreen"
        );

        Utils.resizeImateToRatio(this.gamescreenBackgroundImage, window.innerWidth, window.innerHeight);
    }



}
