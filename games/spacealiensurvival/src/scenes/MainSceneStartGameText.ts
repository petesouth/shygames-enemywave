import Phaser from 'phaser';
import { BaseExplodableState } from '../gameobjects/baseExplodable';
import gGameStore from '../store/store';

export class MainSceneStartGameText {
    private levelAnnounceText: Phaser.GameObjects.Text | undefined;
    
    private gameNameText: Phaser.GameObjects.Text | undefined;
    private instructions: Phaser.GameObjects.Text[] = [];
    private scoreText: Phaser.GameObjects.Text | undefined;


    constructor(private scene: Phaser.Scene) { }

    setLevelAnnounceText(text:string) {
        this.levelAnnounceText?.setText(text);
    }

    showLevelAnnounceText() {
        this.levelAnnounceText?.setVisible(true);
    }

    hideLevelAnnounceText() {
        this.levelAnnounceText?.setVisible(false);
    }


    createStartGameText() {
        this.scoreText = this.scene.add.text(
            20,
            20,
            'Player Kills: 0 - Level: 0',
            { font: '16px Arial', color: '#ffffff' }
        );
        this.scoreText.setDepth(1);

        this.levelAnnounceText = this.scene.add.text(
            (window.innerWidth / 2),
            20,
            'Starting level 1',
            { font: '16px Arial', color: '#ffffff' }
        );
        this.levelAnnounceText.setOrigin(0.5);
        this.levelAnnounceText.setVisible(false);
        this.levelAnnounceText.setDepth(1);
        
        let offset = 60;

        this.gameNameText = this.scene.add.text(
            (window.innerWidth / 2),
            offset,
            'ShyHumanGames LLC - Space Alien Survival',
            { font: '16px Arial', color: '#ffffff' }
        );
        this.gameNameText.setOrigin(0.5);
        this.gameNameText.setDepth(1);
        offset += 30;

        const instructionTexts = [
            'Game', 'R - Start Game / Re-spawn', 'CTRL-E - Fullscreen',
            'Movement', '\u2191 - Thrust Forward', '\u2190 - Rotate Left', '\u2192 - Rotate Right',
            'Weapons', 'Space - Fire Cannon', 'G - Guided Missiles', 'M - Floating Mines', 'S - Shields'
        ];

        instructionTexts.forEach(instruction => {
            let text = this.scene.add.text(
                (window.innerWidth / 2),
                offset,
                instruction,
                { font: '12px Arial', color: '#ffffff' }
            );
            text.setOrigin(0.5);
            text.setDepth(1);
            this.instructions.push(text);
            offset += 15;
        });
    }

    repositionStartGameText(w: number) {
        let offset = 60;
        this.gameNameText?.setPosition(w / 2, offset);
        this.gameNameText?.setDepth(1);
        offset += 30;

        this.instructions.forEach(instruction => {
            instruction.setPosition(w / 2, offset);
            instruction.setDepth(1);
            offset += 15;
        });
    }

    displayGameText(playerSpaceship: any) {
        if (playerSpaceship.state === BaseExplodableState.DESTROYED) {
            this.gameNameText?.setVisible(true);
            this.instructions.forEach(instruction => instruction.setVisible(true));
        } else {
            this.gameNameText?.setVisible(false);
            this.instructions.forEach(instruction => instruction.setVisible(false));
        }

        const game = gGameStore.getState().game;


        if (playerSpaceship?.state === BaseExplodableState.ALIVE) {
            this.scoreText?.setText(`Level: ${game.currentLevel} - Player Kills: ${game.playerSpaceShipKilled} - HitPoints: ${playerSpaceship.hitpoints}`);
        } else {
            this.scoreText?.setText(`Level: ${game.currentLevel} - Player Kills: ${game.playerSpaceShipKilled} - Highest Level: ${game.highestLevel}`);
        }
        this.scoreText?.setDepth(1);
    }
}
