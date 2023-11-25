import Phaser from 'phaser';
import { SpaceShipType, BaseSpaceship } from './basespaceship';
import { BaseExplodableState } from './baseExplodable';
import { gameActions } from '../store/gamestore';
import gGameStore from '../store/store';


export class PlayerSpaceship extends BaseSpaceship {
    
    constructor(scene: Phaser.Scene) {
        super(scene, SpaceShipType.IMAGE, "playerspaceship", [ 0x96e0da, 0x937ef3 ], window.innerWidth / 2);

        this.bulletColorsOverride = [0xFFFFFF];
        this.missileColorsOverride = [0xffffff, 0x000FFF];
        this.explosionColors = [ 'blue', 'yellow', 'green', 'red' ]
        this.maxPopSize = 60;
        this.state = BaseExplodableState.DESTROYED;  // Starts off in destroed state.

        // Set up the event listener for mouse clicks
        //this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        //    this.handleMouseClick(pointer);
        //});
    }


    public explode(): void {
        super.explode();
        gGameStore.dispatch( gameActions.incrementEnemiesScore({}) );
        this.playFailSound();
    }


}
