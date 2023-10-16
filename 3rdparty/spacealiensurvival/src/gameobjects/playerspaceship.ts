import Phaser from 'phaser';
import { BaseSpaceship, halfBaseWidth, halfHeight } from './basespaceship';
import { BaseExplodable, BaseExplodableState } from './baseExplodable';
import { ForceField } from './forcefield';


export class PlayerSpaceship extends BaseSpaceship {


    constructor(scene: Phaser.Scene) {
        super(scene, 500);

        this.explosionColors = [0xFFFFFF];
        this.maxPopSize = 40;
        this.state = BaseExplodableState.DESTROYED;  // Starts off in destroed state.

    }

    


}
