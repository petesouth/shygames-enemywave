import Phaser from 'phaser';





export enum SpriteHeroAnimationState {
    IDLE = 0,
    RUN = 1,
    JUMPING = 2,
    ATTACK = 3,
    SPECIAL_ATTACK = 4
}


export class SpriteHero {


    protected spriteRun?: Phaser.Physics.Arcade.Sprite | null;
    protected spriteIdle?: Phaser.Physics.Arcade.Sprite | null;
    protected spriteJump?: Phaser.Physics.Arcade.Sprite | null;
    protected spriteAttack?: Phaser.Physics.Arcade.Sprite | null;
    protected spriteSpecialAttack?: Phaser.Physics.Arcade.Sprite | null;

    protected cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    protected scene: Phaser.Scene;

    protected animationState: SpriteHeroAnimationState = SpriteHeroAnimationState.IDLE;

    constructor(scene: Phaser.Scene,
        cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.scene = scene;
        this.cursors = cursors;
    }

    applyToAllSprites(applyHandler: (sprite: Phaser.Physics.Arcade.Sprite) => void) {
        if (!this.spriteIdle || !this.spriteJump || !this.spriteRun || !this.spriteAttack || !this.spriteSpecialAttack) {
            return;
        }
        const sprites: Phaser.Physics.Arcade.Sprite[] = [this.spriteIdle, this.spriteJump, this.spriteRun, this.spriteAttack, this.spriteSpecialAttack];
        sprites.forEach((sprite) => {
            applyHandler(sprite);
        });

    }

    showSpriteFromState(animationState: SpriteHeroAnimationState) {
        this.animationState = animationState;
        switch (this.animationState) {
            case SpriteHeroAnimationState.IDLE:
                this.spriteAttack?.setVisible(false);
                this.spriteRun?.setVisible(false);
                this.spriteJump?.setVisible(false);
                this.spriteSpecialAttack?.setVisible(false);
                this.spriteIdle?.setVisible(true);
                this.spriteIdle?.play("heroidle", true);
                break;
            case SpriteHeroAnimationState.RUN:
                this.spriteAttack?.setVisible(false);
                this.spriteIdle?.setVisible(false);
                this.spriteJump?.setVisible(false);
                this.spriteSpecialAttack?.setVisible(false);
                this.spriteRun?.setVisible(true);
                this.spriteRun?.play("herorun", true);
                break;
            case SpriteHeroAnimationState.JUMPING:
                this.spriteAttack?.setVisible(false);
                this.spriteRun?.setVisible(false);
                this.spriteIdle?.setVisible(false);
                this.spriteSpecialAttack?.setVisible(false);
                this.spriteJump?.setVisible(true);
                this.spriteJump?.play("herojump", true);
                break;
            case SpriteHeroAnimationState.ATTACK:
                this.spriteRun?.setVisible(false);
                this.spriteIdle?.setVisible(false);
                this.spriteJump?.setVisible(false);
                this.spriteSpecialAttack?.setVisible(false);
                this.spriteAttack?.setVisible(true);
                this.spriteAttack?.play("heroattack", true);
                break;
            case SpriteHeroAnimationState.SPECIAL_ATTACK:
                this.spriteRun?.setVisible(false);
                this.spriteIdle?.setVisible(false);
                this.spriteJump?.setVisible(false);
                this.spriteAttack?.setVisible(false);
                this.spriteSpecialAttack?.setVisible(true);
                this.spriteSpecialAttack?.play("herospecialattack", true);
                break;
        }

    }


    drawHeroSprite() {
        if (!this.spriteRun || !this.spriteIdle || !this.spriteIdle.body) {
            return;
        }
    
        // Check if the sprite is touching a platform
    
        // Handle left and right movements
        if (this.cursors.left.isDown) {
            this.applyToAllSprites(sprite => sprite.setFlipX(true));
            if (this.spriteIdle.body.touching.down) {
                this.showSpriteFromState(SpriteHeroAnimationState.RUN);
                this.applyToAllSprites(sprite => sprite.setVelocityX(-160)); // Move left
            }
        } else if (this.cursors.right.isDown) {
            this.applyToAllSprites(sprite => sprite.setFlipX(false));
            if (this.spriteIdle.body.touching.down) {
                this.showSpriteFromState(SpriteHeroAnimationState.RUN);
                this.applyToAllSprites(sprite => sprite.setVelocityX(160)); // Move right
            }
        } else {
            // Idle state
            this.applyToAllSprites(sprite => sprite.setVelocityX(0));
            if (this.spriteIdle.body.touching.down) {
                this.showSpriteFromState(SpriteHeroAnimationState.IDLE);
            } else {
                this.showSpriteFromState(SpriteHeroAnimationState.JUMPING);
            }
        }
    
        // Handle jumping
        if (this.cursors.up.isDown && (this.spriteIdle.body.touching.down)) {
            this.applyToAllSprites(sprite => sprite.setVelocityY(-480));
            this.showSpriteFromState(SpriteHeroAnimationState.JUMPING);
        }
    
        
        // Handle other actions (down and space)
        if (this.cursors.down.isDown) {
            this.showSpriteFromState(SpriteHeroAnimationState.SPECIAL_ATTACK);
        } else if (this.cursors.space.isDown) {
            this.showSpriteFromState(SpriteHeroAnimationState.ATTACK);
        }
    }
    
    
    

    protected loadAnimationConfiguration() {
        this.scene.anims.create({
            key: 'herorun', // This is the key for the animation itself
            frames: this.scene.anims.generateFrameNames('herorun', {
                prefix: 'run/frame000', // Adjusted to match the frame names in the JSON
                start: 0, // Starting frame index is 0
                end: 8, // Ending at frame index 2 for a total of 3 frames
                zeroPad: 1 // Adjust if your frame names have leading zeros
            }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'herojump', // This is the key for the animation itself
            frames: this.scene.anims.generateFrameNames('herojump', {
                prefix: 'jump/frame000', // Adjusted to match the frame names in the JSON
                start: 0, // Starting frame index is 0
                end: 8, // Ending at frame index 2 for a total of 3 frames
                zeroPad: 1 // Adjust if your frame names have leading zeros
            }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'heroidle', // This is the key for the animation itself
            frames: this.scene.anims.generateFrameNames('heroidle', {
                prefix: 'idle/frame000', // Adjusted to match the frame names in the JSON
                start: 0, // Starting frame index is 0
                end: 2, // Ending at frame index 2 for a total of 3 frames
                zeroPad: 1 // Adjust if your frame names have leading zeros
            }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'heroattack', // This is the key for the animation itself
            frames: this.scene.anims.generateFrameNames('heroattack', {
                prefix: 'basicattack/frame000', // Adjusted to match the frame names in the JSON
                start: 0, // Starting frame index is 0
                end: 13, // Ending at frame index 2 for a total of 3 frames
                zeroPad: 1 // Adjust if your frame names have leading zeros
            }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'herospecialattack', // This is the key for the animation itself
            frames: this.scene.anims.generateFrameNames('herospecialattack', {
                prefix: 'specialattack/frame000', // Adjusted to match the frame names in the JSON
                start: 0, // Starting frame index is 0
                end: 13, // Ending at frame index 2 for a total of 3 frames
                zeroPad: 1 // Adjust if your frame names have leading zeros
            }),
            frameRate: 10,
            repeat: -1
        });

    }

    getStaticXPosition() {
        return (window.innerWidth / 4);
    }

    createHeroSprite() {
        this.loadAnimationConfiguration();
    
        const xPos = window.innerWidth / 4;
        const yPos = 0; // Modify as needed, perhaps to `window.innerHeight - MainScene.GROUND_HEIGHT`
    
        // Create sprites and set common properties
        this.spriteRun = this.scene.physics.add.sprite(xPos, yPos, 'herorun');
        this.spriteJump = this.scene.physics.add.sprite(xPos, yPos, 'herojump');
        this.spriteIdle = this.scene.physics.add.sprite(xPos, yPos, 'heroidle');
        this.spriteAttack = this.scene.physics.add.sprite(xPos, yPos, 'heroattack');
        this.spriteSpecialAttack = this.scene.physics.add.sprite(xPos, yPos, 'herospecialattack');
    
        this.applyToAllSprites((sprite) => {
            sprite.setDisplaySize(300, 300); // Set the display size of the sprite
            sprite.setBodySize(25,36);
            sprite.setOffset(66,80); // Offset to move the body up so it aligns with the character's feet
            sprite.setVisible(false);
            sprite.setBounce(0.1);
            sprite.setCollideWorldBounds(true);
        });
    }
    
    resizeEvent(x: number, y: number) {
        this.applyToAllSprites((sprite) => {
            sprite.setPosition(x, y);
            sprite.setDepth(10);
            sprite.setGravityY(300);
            sprite.refreshBody();
        });
    
        // Resetting the animation state to ensure correct display
        this.showSpriteFromState(this.animationState);
    }
    




}
