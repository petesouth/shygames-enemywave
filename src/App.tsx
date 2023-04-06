import React, { useEffect, useRef, useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Phaser, { Game, Types } from "phaser";

import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { Title } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';
import { getGlobalStyles } from './style';

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
  const classes = getGlobalStyles();

  const [game, setGame] = useState<number>(1);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h6>ShyGames Game Feed</h6>
      </div>
      <div style={{padding: 40}}>
        <Container>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((value: number, index: number, array: number[]) => {
            return (<Row>
              <Col>
                <div className="d-flex justify-content-center align-items-center">
                  <Card className={classes.gameCard + " " + classes.content}>
                    <Card.Header>Tank Battle</Card.Header>
                    <Card.Body>
                      <Card.Subtitle>Awesome Dungeon scroller type game with tanks!</Card.Subtitle>
                    </Card.Body>
                    <Card.Body>
                      <Image src='data:image/jpeg;base64,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' />
                    </Card.Body>
                    <Card.Body>
                      <Container>
                        <Row>
                          <Col>
                            <Button>Play</Button>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>);
          })}


        </Container>

      </div>

    </div>
  );
}

export default App;
