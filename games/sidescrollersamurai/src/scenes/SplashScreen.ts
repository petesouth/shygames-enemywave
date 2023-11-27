import Phaser from 'phaser';




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
        this.load.audio('bullet', 'sound/bullet.mp3');
        this.load.audio('missile', 'sound/missile.mp3');
        this.load.audio('impact', 'sound/impact.mp3');
        this.load.audio('shield', 'sound/shield.mp3');
        this.load.audio('explosion', 'sound/explosion.mp3');
        this.load.audio('gamesong', 'sound/gamesong.mp3');
        this.load.audio('fail', 'sound/fail.mp3');
        this.load.audio('success', 'sound/success.mp3');
        this.load.audio('levelcomplete', 'sound/levelcomplete.mp3');


        this.load.atlas('flares', 'images/flares.png', 'images/flares.json');
        this.load.image('gamescreen', 'images/gamescreen.png');
        this.load.image("bricks2", 'textures/bricks2.png');
        
        
        for( let i = 21; i <= 22; ++ i ) {
            this.load.image("background" + i, 'backgrounds/background' + i + '.png');
        };

        this.load.atlas('heroidle', 'images/herosamurai/IDLE.png', 'images/herosamurai/IDLE.json');
        this.load.atlas('herorun', 'images/herosamurai/RUN.png', 'images/herosamurai/RUN.json');
        

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


        this.resizeStarBackground();
    }



    createBackgroundImage() {
        this.gamescreenBackgroundImage = this.add.image(window.innerWidth / 2,
            window.innerHeight / 2, "gamescreen"
        );

        this.resizeStarBackground();
    }


    public resizeStarBackground() {
        if (!this.gamescreenBackgroundImage) {
            return;
        }
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        const imageWidth = this.gamescreenBackgroundImage.width;
        const imageHeight = this.gamescreenBackgroundImage.height;
        const imageAspectRatio = imageWidth / imageHeight;

        let newWidth, newHeight;

        // The image is wider relative to the screen, set the image width to match the screen width
        newWidth = screenWidth;
        newHeight = newWidth / imageAspectRatio;  // Adjust height proportionally

        // Check if the new height is less than the screen height, if so adjust the dimensions
        if (newHeight < screenHeight) {
            newHeight = screenHeight;
            newWidth = newHeight * imageAspectRatio;  // Adjust width proportionally
        }
        this.gamescreenBackgroundImage.setDisplaySize(newWidth, newHeight);

        // Ensure the image is positioned in the center of the screen
        this.gamescreenBackgroundImage.setPosition(screenWidth / 2, screenHeight / 2);

    }
}
