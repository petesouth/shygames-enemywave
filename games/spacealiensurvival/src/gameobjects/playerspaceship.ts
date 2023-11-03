import Phaser from 'phaser';
import { SpaceShipType, BaseSpaceship } from './basespaceship';
import { BaseExplodableState } from './baseExplodable';
import { gameActions } from '../store/gamestore';
import gGameStore from '../store/store';


export class PlayerSpaceship extends BaseSpaceship {
    
    [key: string]: boolean | any; 
    
    constructor(scene: Phaser.Scene) {
        super(scene, SpaceShipType.IMAGE, "playerspaceship", [ 0x96e0da, 0x937ef3 ], window.innerWidth / 2);

        this.explosionColors = [ 'blue', 'yellow', 'green', 'red' ]
        this.maxPopSize = 60;
        this.state = BaseExplodableState.DESTROYED;  // Starts off in destroed state.
    }


    public explode(): void {
        super.explode();
        gGameStore.dispatch( gameActions.incrementEnemiesScore({}) );
        this.playFailSound();
    }


}
