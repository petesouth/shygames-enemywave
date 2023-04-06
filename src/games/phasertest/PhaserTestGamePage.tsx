import { Game, Types } from "phaser";
import { useEffect, useRef } from "react";
import {v4 as uuidv4} from "uuid";

interface PhaserTestGamePageProps {
  gameName: string
}

export const PhaserTestGamePage = ({ gameName }: PhaserTestGamePageProps) => {
  const divRef = useRef(null);
  let time = Date.now();
  const key = "game-container_" + uuidv4();

  useEffect(() => {
    const config: Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      scene: class extends Phaser.Scene {
        text: Phaser.GameObjects.Text | undefined;

        create() {
          this.text = this.add.text(10, 10, gameName, { color: '#0f0' });
        }
      },
      parent: (divRef?.current) ? divRef.current : 'game-container'

    };

    const game = new Game(config);
    const update = () => {
      game.scene.scenes.forEach((scene) => {
        scene.update(time, Date.now());
        requestAnimationFrame(update);
      });
    }
    requestAnimationFrame(update);

    return () => {
      game.destroy(true);
    }
  });

  return (
    <div id="game-container" ref={divRef}></div>
  );
}