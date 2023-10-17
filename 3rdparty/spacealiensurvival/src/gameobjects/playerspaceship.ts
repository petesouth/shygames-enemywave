import Phaser from 'phaser';
import { BaseSpaceship } from './basespaceship';
import { BaseExplodableState } from './baseExplodable';
import { gameActions } from '../store/gamestore';
import gGameStore from '../store/store';


export class PlayerSpaceship extends BaseSpaceship {
    
    
    constructor(scene: Phaser.Scene) {
        super(scene, 500);

        this.explosionColors = [0xFFFFFF];
        this.maxPopSize = 40;
        this.state = BaseExplodableState.DESTROYED;  // Starts off in destroed state.

    }


    public explode(): void {
        super.explode();
        gGameStore.dispatch( gameActions.incrementEnemiesScore({}) );
    }


}
