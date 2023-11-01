import Phaser from 'phaser';




export class SplashScreen extends Phaser.Scene {

    public static TEXT_TOP_PADDING = 60;
    public static IMAGE_BORDER_PADDING = 40;

    public splashText?: Phaser.GameObjects.Text;
    public image?: Phaser.GameObjects.Image;

    public static textureNames = ["bricks", 
                                  "bricks2", 
                                  "rockwall", 
                                  "metal"];

    public static enemySpaceships = ["enemyspaceship4", 
                                     "enemyspaceship4B", 
                                     "bossenemyspaceship4", 
                                     "enemysaucer1", 
                                     "enemysaucer2", 
                                     "darthvader", 
                                     "enemyspacejet" ];

    public static backgrounds = ["background1", "background2", "background3", "background4", "background5", 
                                 "background6", "background7", "background8", "background9", "background10",
                                 "background11", "background12", "background13", "background14", "background15",
                                 "background16", "background17", "background18", "background19", "background20"];


    constructor() {
        super('SplashScreen');

    }

    preload() {

        this.splashText = this.add.text(
            this.scale.width / 2,
            SplashScreen.TEXT_TOP_PADDING,
            'Loading...',
            { font: 'bold 18px Arial', color: '#ffffff' }
        );

        this.splashText.setOrigin(0.5);
        this.splashText.setDepth(1);

        this.splashText.setText("Loading sound...")
        this.load.audio('thrust', 'sound/thrust.mp3');
        this.load.audio('bullet', 'sound/bullet.mp3');
        this.load.audio('missile', 'sound/missile.mp3');
        this.load.audio('impact', 'sound/impact.mp3');
        this.load.audio('shield', 'sound/shield.mp3');
        this.load.audio('explosion', 'sound/explosion.mp3');
        this.load.audio('gamesong', 'sound/gamesong.mp3');
        this.load.audio('fail', 'sound/fail.mp3');
        this.load.audio('success', 'sound/success.mp3');
        this.load.audio('levelcomplete', 'sound/levelcomplete.mp3');
        

        this.splashText.setText("Loading Player...")
        this.load.atlas('flares', 'images/flares.png', 'images/flares.json');
        this.load.image('playerspaceship', 'images/playerspaceship4.png');

        this.splashText.setText("SplashScreen...")
        this.load.image('gamescreen', 'images/gamescreen.png');
        
        SplashScreen.enemySpaceships.forEach((spaceship) => {
            this.splashText?.setText("Loading enemies: " + spaceship + "...");
            this.load.image(spaceship, 'images/' + spaceship + '.png');
        
        });

        SplashScreen.backgrounds.forEach((background) => {
            this.splashText?.setText("Loading backgrounds " + background + "...");
            this.load.image(background, 'backgrounds/' + background + '.png');
        });



        SplashScreen.textureNames.forEach((texture) => {
            this.splashText?.setText("Loading textures " + texture + "...");
            this.load.image(texture, 'textures/' + texture + '.png');
        });


    }

    create() {
        this.image = this.add.image(this.scale.width / 2,
            this.scale.height / 2,
            "gamescreen");
        this.image?.setDisplaySize((this.scale.width) - SplashScreen.IMAGE_BORDER_PADDING, (this.scale.height) - SplashScreen.IMAGE_BORDER_PADDING);

        this.splashText?.setText('ShyHumanGames LLC - Click to Start');
        this.splashText?.setOrigin(0.5);
        this.splashText?.setDepth(1);


        this.input.on('pointerdown', () => {
            this.scene.start('MainScene');
        });

        setInterval(() => {
            if (this.scale.width < window.innerWidth ||
                this.scale.height < window.innerHeight) {
                this.handleWindowResize();
            }
        }, 500);
    
    }


    handleWindowResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;


        this.scale.setGameSize(w, h);
        this.splashText?.setPosition(w / 2, SplashScreen.TEXT_TOP_PADDING);
        this.splashText?.setDepth(1);


        this.image?.setPosition(w / 2, h / 2);
        this.image?.setDisplaySize((w) - SplashScreen.IMAGE_BORDER_PADDING, (h) - SplashScreen.IMAGE_BORDER_PADDING);
    }
}
