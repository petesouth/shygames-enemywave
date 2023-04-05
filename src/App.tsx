import React, { useEffect, useRef, useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Phaser, { Game, Types } from "phaser";

import { Container, Row, Col, Button } from "react-bootstrap";

interface TheGameProps {

}

const TheGame = ({ }: TheGameProps) => {
  const divRef = useRef(null);
  let time = Date.now();

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
          this.text = this.add.text(10, 10, "Hello there", { color: '#0f0' });
        }

        update(time: number, delta: number): void {
          this.text?.setText("Hello there " + time);
          time = Date.now();
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

const TheGame2 = ({ }: TheGameProps) => {
  const divRef = useRef(null);
  let time = Date.now();

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
          this.text = this.add.text(10, 10, "2Hello there", { color: '#0f0' });
        }

        update(time: number, delta: number): void {
          this.text?.setText("2Hello there " + time);
          time = Date.now();
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

function App() {
  const [game, setGame] = useState<number>(1);

  return (
    <Container className="App">
      <Row>
        <Col>
          { (game === 1 ) ? <TheGame /> : <TheGame2 /> }
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" onClick={() => {
            setGame((game === 1) ? 2 : 1 );
          }}>
            Play me yo
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
