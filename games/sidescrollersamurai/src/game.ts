import Phaser from 'phaser';
import { SplashScreen } from './scenes/SplashScreen';
import { MainScene } from './scenes/MainScene';



const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: "100%",
    height: "100%",
    parent: 'game',
    fps: {
        limit: 40,  // This will limit the game to 60 frames per second
    },
    scene: [SplashScreen, MainScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    input: {
        touch: {
            capture: true
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x:0 },
            debug: false,  // Set true if you want to see the physics debug info
            checkCollision: {
                up: true,
                down: true,
                left: true,
                right: true
            }
        }
    },
};



export default class Game extends Phaser.Game {
    constructor() {
        super(config);

        // Add event listeners for key presses
        window.addEventListener("resize", this.handleWindowResize.bind(this));
        document.getElementById("game")?.focus();
        this.input.addPointer();
        
        
        this.scale.on(Phaser.Scale.Events.ENTER_FULLSCREEN, () => {
            this.handleWindowResize();
        })


        this.scale.on(Phaser.Scale.Events.FULLSCREEN_FAILED, () => {
            this.handleWindowResize();
        })

        this.scale.on(Phaser.Scale.Events.FULLSCREEN_UNSUPPORTED, () => {
            this.handleWindowResize();
        })

        this.scale.on(Phaser.Scale.Events.LEAVE_FULLSCREEN, () => {
            this.handleWindowResize();
        })


    }

    handleWindowResize() {

        const { width, height }: { width: number, height: number } = { width: window.innerWidth, height: window.innerHeight };
        const mainScene = this.scene.getScene("MainScene") as MainScene;
        mainScene.scale.setGameSize(width, height);
        mainScene.handleWindowResize(width, height);

        const splashScreen = this.scene.getScene("SplashScreen") as SplashScreen;
        splashScreen.scale.setGameSize(width, height);
        splashScreen.handleWindowResize(width, height);

    }





}
