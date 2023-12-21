import Phaser from 'phaser';




export class SoundPlayer {
    private gamesongSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private runningSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private flyingSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private swordSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private sword2Sound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private playingSword: boolean = false;
    private playingSword2: boolean = false;

    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.gamesongSound = this.scene.sound.add('gamesong', { loop: false, volume: 1 });
        this.runningSound = this.scene.sound.add('running', { loop: true });
        this.flyingSound = this.scene.sound.add('flying', { loop: true });

        this.swordSound = this.scene.sound.add('sword', { loop: false });
        this.sword2Sound = this.scene.sound.add('sword2', { loop: false});

    }

    public playGameSongSound(): void {
        if (this.gamesongSound && !this.gamesongSound.isPlaying) {
            this.gamesongSound.play();
        }
    }

    public stopGameSongSound(): void {
        if (this.gamesongSound && this.gamesongSound.isPlaying) {
            this.gamesongSound.stop();
        }
    }

    public playSwordSound(): void {

        if( this.swordSound.isPlaying || this.playingSword ) {
            return;
        }
        this.playingSword = true;
        setTimeout(()=>{
            if (this.swordSound && !this.swordSound.isPlaying) {
                this.swordSound.play();
                this.playingSword = false;
            }
        }, 200 );
            
    }

    public playSword2Sound(): void {

        if( this.sword2Sound.isPlaying || this.playingSword2 ) {
            return;
        }
        this.playingSword2 = true;
        setTimeout(()=>{
            if (this.sword2Sound && !this.sword2Sound.isPlaying) {
                this.sword2Sound.play();
                this.playingSword2 = false;
            }
        }, 400);
    }

    public playSuccessSound(): void {
        let sound = this.scene.sound.add('levelcomplete', { loop: false });
        sound.play();
    }

    public playMissileSound(): void {
        let sound = this.scene.sound.add('missile', { loop: false });
        sound.play();
    }

    public playLevelComplete(): void {
        let sound = this.scene.sound.add('success', { loop: false });
        sound.play();
    }


    public playRunningSound(): void {
        if (!this.runningSound.isPlaying) {
            this.runningSound.play();
        }
    }

    public stopRunningSound(): void {
        if (this.runningSound.isPlaying) {
            this.runningSound.stop();
        }
    }


    public playFlyingSound(): void {
        if (!this.flyingSound.isPlaying) {
            this.flyingSound.play();
        }
    }

    public stopFlyingSound(): void {
        if (this.flyingSound.isPlaying) {
            this.flyingSound.stop();
        }
    }

}
