import Phaser from 'phaser';




export class SoundPlayer {
    private gamesongSound?: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.gamesongSound = this.scene.sound.add('gamesong', { loop: false, volume: 1 });
    }

    public playGameSongSound(): void {
        if (this.gamesongSound && !this.gamesongSound.isPlaying) {
            //  this.gamesongSound.play();
        }
    }

    public stopGameSongSound(): void {
        if (this.gamesongSound && this.gamesongSound.isPlaying) {
            this.gamesongSound.stop();
        }
    }

    public playSuccessSound(): void {
        let sound = this.scene.sound.add('levelcomplete', { loop: false });
        sound.play();
    }

    public playLevelComplete(): void {
        let sound = this.scene.sound.add('success', { loop: false });
        sound.play();
    }

}
