import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {AUTO, Game, Types} from "phaser";


class TheScene extends Phaser.Scene {
  create() {
    this.add.text(100, 100, 'Hello there', { color: '#0f0' });
  }
}

const TheGame = () => {

  useEffect(() => {
    const config: Types.Core.GameConfig = {
      type: AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
      scene: TheScene

    };

    const game = new Game(config);

    return () => {
      game.destroy(true);
    }
  }, []);

  
  return (
    <div id="game-container"></div>
  );
}

function App() {
  return (
    <div className="App">
        <TheGame />
    </div>
  );
}

export default App;
