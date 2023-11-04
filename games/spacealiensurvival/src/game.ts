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
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.getElementById("game")?.focus();

    }

    handleWindowResize() {
        const mainScene = this.scene.getScene("MainScene") as MainScene;
        mainScene.handleWindowResize();
        const splashScreen = this.scene.getScene("SplashScreen") as MainScene;
        splashScreen.handleWindowResize();

    }

    handleKeyDown(event: KeyboardEvent) {
        // Check if the Ctrl key is pressed (key code 17) and the "E" key (key code 69)
        if (event.ctrlKey && event.keyCode === 69) {
            Game.toggleFullscreen();
        } else if (event.keyCode === 82) {
            const mainScene = this.scene.getScene("MainScene") as MainScene;
            mainScene.startPlayerGame();
        } else if (event.key === "Escape") {
            this.exitFullscreen();
        }
    }

    public static toggleFullscreen() {
        const doc: any = document;
        if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
            const canvas = doc.querySelector('canvas');
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen().catch((err) => {
                    console.error("Fullscreen request failed:", err);
                });
            } else if (canvas.webkitRequestFullscreen) {
                canvas.webkitRequestFullscreen().catch((err) => {
                    console.error("Fullscreen request failed:", err);
                });
            }
        } else {
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            } else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            }
        }
    }
    
    exitFullscreen() {
        const doc: any = document;
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        }
    }
    
}
