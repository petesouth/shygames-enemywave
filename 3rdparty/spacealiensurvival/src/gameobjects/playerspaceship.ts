import Phaser from 'phaser';
import { BaseSpaceship, halfBaseWidth, halfHeight } from './basespaceship';
import { BaseExplodable, BaseExplodableState } from './baseExplodable';
import { ForceField } from './forcefield';
import { useGameState } from '../store/hooks';
import { gameActions } from '../store/gamestore';
import gGameStore from '../store/store';


export class PlayerSpaceship extends BaseSpaceship {
    
    private store = gGameStore;    
    
    constructor(scene: Phaser.Scene) {
        super(scene, 500);

        this.explosionColors = [0xFFFFFF];
        this.maxPopSize = 40;
        this.state = BaseExplodableState.DESTROYED;  // Starts off in destroed state.

    }

    
    public destroy(): void {
        super.destroy();    
        
        this.store.dispatch( gameActions.incrementPlayersScore({}) );
    }

}
