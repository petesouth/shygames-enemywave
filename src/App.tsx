import React, { useEffect, useRef, useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Phaser, { Game, Types } from "phaser";

import { Container, Row, Col, Button, Carousel, Navbar, Nav } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { globalStyles } from './style';

const appName: string = (process.env.REACT_APP_APP_NAME) ? process.env.REACT_APP_APP_NAME : "REACT_APP_APP_NAME NOT FOUND PLEASE DEFINE"

interface TheGameProps {
  gameName: string
}

const TheGame = ({ gameName }: TheGameProps) => {
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


interface TheGameProps2 {

}

const TheGame2 = ({ }: TheGameProps2) => {
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
  const classes = globalStyles();

  const [game, setGame] = useState<number>(1);

  return (
    <div className={[classes.app, classes.container].join(' ')}>
        <div>
                <h1>Your header content here</h1>
        </div>
        <Container>
          <Row>
            <Col>
              <h2>Your page content here</h2>
            </Col>
          </Row>
        </Container>
    
    </div>
  );
}

export default App;
