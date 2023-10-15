import Phaser from 'phaser';
import { BaseSpaceship } from './basespaceship';



export class EnemySpaceship extends BaseSpaceship {


    private playerSpaceship?: BaseSpaceship;

    constructor(scene: Phaser.Scene, distanceFromLeftCorner: number, playerSpaceship?: BaseSpaceship) {
        super( scene, distanceFromLeftCorner, 0xFF0000);
    
        if (playerSpaceship) {
            this.playerSpaceship = playerSpaceship;
        }

        this.fireKey = undefined;
        this.missileKey = undefined;
        this.mineKey = undefined;
        this.colors = [0xFF0000];
        this.maxPopSize = 40;
    

    }


    public updateSpaceshipState() {
        if( !this.playerSpaceship || this.hit === true) {
            this.exhaustFlame.hide();
            this.forceField.hide();
            this.exhaustFlame.render();
            this.forceField.render();
                
            super.updateSpaceshipState();
        } else {
            this.chasePlayerSpaceship();
        }
    }

   

    private chasePlayerSpaceship() {
        if (!this.playerSpaceship) {
            return;
        }

        const centroid = Phaser.Geom.Triangle.Centroid(this.spaceShipShape);
        const directionX = this.playerSpaceship.getPositionX() - centroid.x;
        const directionY = this.playerSpaceship.getPositionY() - centroid.y;
        const distanceToPlayer = Phaser.Math.Distance.Between(centroid.x, centroid.y, this.playerSpaceship.getPositionX(), this.playerSpaceship.getPositionY());
        const angle = Math.atan2(directionY, directionX);

        // Rotate the spaceship to point towards the player
        const currentRotation = Math.atan2(this.spaceShipShape.y1 - centroid.y, this.spaceShipShape.x1 - centroid.x);
        const rotationDifference = angle - currentRotation;

        Phaser.Geom.Triangle.RotateAroundPoint(this.spaceShipShape, centroid, rotationDifference);
        Phaser.Geom.Triangle.RotateAroundPoint(this.innerSpaceShipShape, centroid, rotationDifference);

        // If the enemy is closer than 40 pixels to the player, reduce its speed
        let effectiveThrust = this.thrust;
        if (distanceToPlayer < 80) { // Considering 80 because 40 pixels is the buffer, so we start slowing down when we are 80 pixels away
            effectiveThrust *= (distanceToPlayer - 80) / 80;
        }

        this.velocity.x += effectiveThrust * Math.cos(angle);
        this.velocity.y += effectiveThrust * Math.sin(angle);

        this.velocity.x *= this.damping;
        this.velocity.y *= this.damping;

        Phaser.Geom.Triangle.Offset(this.spaceShipShape, this.velocity.x, this.velocity.y);
        Phaser.Geom.Triangle.Offset(this.innerSpaceShipShape, this.velocity.x, this.velocity.y);
        this.exhaustFlame.show();
        

    }

    
    
}
