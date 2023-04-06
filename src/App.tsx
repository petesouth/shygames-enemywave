import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Phaser, { Game, Types } from "phaser";

import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import { Title } from '@material-ui/icons';
import { colors, makeStyles } from '@material-ui/core';
import { getGlobalStyles } from './style';

import shyGamesRobotImage from "./assets/ShyGamesRobot.png";
import { GameFeedState, fetchGames, Game as FeedGame } from './redux/gameAPI';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

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


interface GameFeedGamePanelProps {
  imageSrc: string,
  title: string,
  description: string,
  onPlay: () => void
}

const GameFeedGamePanel = ({ imageSrc, title, description, onPlay }: GameFeedGamePanelProps) => {
  const classes = getGlobalStyles();

  return (<Row>
    <Col>
      <div className="d-flex justify-content-center align-items-center">
        <Card className={classes.gameCard + " " + classes.content}>
          <Card.Body><h6 style={{ color: colors.grey[600] }}>{title}</h6></Card.Body>
          <Card.Body>
            <div style={{ borderWidth: 1, borderStyle: "solid", borderColor: colors.grey[300], borderRadius: 5 }}>
              <Image style={{ width: 300, padding: 20 }} src={imageSrc} />
            </div>
          </Card.Body>
          <Card.Body>
            <div style={{ width: 300, padding: 20 }}>
              <p style={{ fontSize: 12 }}>
                {description}
              </p>
            </div>
          </Card.Body>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  <Button onClick={() => {
                    onPlay();
                  }}>Play</Button>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </div>
    </Col>
  </Row>)
}


function AppMainGameFeed() {
  const classes = getGlobalStyles();

  const gameList = useSelector<any, FeedGame[]>((state) => state.games.gameList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGames() as unknown as AnyAction);
  }, [dispatch]);

  return (
    <div className={classes.root}>

      <div className={classes.header}>
        <h4 style={{ color: "grey" }}>Shy Games</h4>
        <Image width={30} height={30} src={shyGamesRobotImage} />
      </div>

      <div style={{ padding: 40 }}>
        <Container>
          {gameList?.map((game: FeedGame, index: number, array: FeedGame[]) => {
            return <GameFeedGamePanel title={game.title}
              description={game.description}
              imageSrc={game.gameImage}
              onPlay={() => {
                alert("Go to the Games Summary page for game:" + game.title);
              }}
            />;
          })}

        </Container>

      </div>

    </div>
  );
}



const App = () => {


  return (<Router >
    <Routes>
      <Route path="/" element={<AppMainGameFeed />} />
    </Routes>
  </Router>)
}

export default App;

