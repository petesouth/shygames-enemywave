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
        mode: Phaser.Scale.RESIZE,
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
    private scaleManager: Phaser.Scale.ScaleManager;

    constructor() {
        super(config);

        // Add event listeners for key presses
        window.addEventListener("resize", this.handleWindowResize.bind(this));
        document.getElementById("game")?.focus();
        this.input.addPointer();

        
        

        this.scaleManager = new Phaser.Scale.ScaleManager(this);

        this.scaleManager.on( Phaser.Scale.Events.ENTER_FULLSCREEN, ()=>{
            this.handleWindowResize();
        })

        
        this.scaleManager.on( Phaser.Scale.Events.FULLSCREEN_FAILED, ()=>{
            this.handleWindowResize();
        })

        this.scaleManager.on( Phaser.Scale.Events.FULLSCREEN_UNSUPPORTED, ()=>{
            this.handleWindowResize();
        })

        this.scaleManager.on( Phaser.Scale.Events.LEAVE_FULLSCREEN, ()=>{
            this.handleWindowResize();
        })


        this.scaleManager.on( Phaser.Scale.Events.ORIENTATION_CHANGE, ()=>{
            this.handleWindowResize();
        })

        this.scaleManager.on( Phaser.Scale.Events.RESIZE, ()=>{
            this.handleWindowResize(); 
        })

        setInterval(() => {
            if (this.scale.width < window.innerWidth ||
                this.scale.height < window.innerHeight) {
                this.handleWindowResize();
            }
        }, 500);

       

    }

    handleWindowResize() {
        const { width, height } : { width:number, height: number } = { width: window.innerWidth, height: window.innerHeight };
        // this.scale.setGameSize(width, height);
        // this.scale.setParentSize(width, height);
        // this.scale.resize(width, height);
        // this.scale.updateScale();
        // this.scale.refresh();

        const mainScene = this.scene.getScene("MainScene") as MainScene;
        mainScene.handleWindowResize(width, height);
        const splashScreen = this.scene.getScene("SplashScreen") as SplashScreen;
        splashScreen.handleWindowResize(width, height);

    }





}
