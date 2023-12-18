import React, { Component } from 'react';
import './App.css';
import Game from './game';


export default class App extends Component {
  game: Game | null = null;


  constructor(props: {}) {
    super(props);
  }

  componentDidMount(): void {

    this.game = new Game();

    window.onresize = () => {
      
      // Update game size
      if( this.game ) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.game.scale.setGameSize(w, h);
      }

      // Additional adjustments if necessary (e.g., repositioning game objects, etc.)
    };
  }

  render() {
    return (
      <div className="App">
        <div id="game" style={{height: "100%", width: "100%"}}/>
      </div>
    );
  }
}
