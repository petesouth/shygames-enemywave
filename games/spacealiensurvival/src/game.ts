import Phaser from 'phaser';
import { SplashScreen } from './scenes/SplashScreen';
import { MainScene } from './scenes/MainScene';



const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
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
            gravity: { y: 0 },
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
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();
        this.input.addPointer();
        

    }

    handleWindowResize() {
        const mainScene = this.scene.getScene("MainScene") as MainScene;
        mainScene.handleWindowResize();
        const splashScreen = this.scene.getScene("SplashScreen") as MainScene;
        splashScreen.handleWindowResize();

    }

    

   
    
}
