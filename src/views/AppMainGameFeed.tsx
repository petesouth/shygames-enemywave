import React, { useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Game as FeedGame, fetchGames } from "../redux/gameAPI";
import { getGlobalStyles } from "../style";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { GameFeedGamePanel } from "../components/gamefeed/GameFeedGamePanel";
import { useEffect, useState } from "react";
import { AnyAction } from "redux";

import { useNavigate } from "react-router-dom";

const appName: string = "Shy Human Games"


export interface AppMainGameFeedProps {
  content?: JSX.Element
}

export function AppMainGameFeed({ content }: AppMainGameFeedProps) {
  const classes = getGlobalStyles();
  const navigate = useNavigate();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [gamePanel, setGamePanel] = useState<JSX.Element | null>(null);
  const gameList = useSelector<any, FeedGame[]>((state) => state.games.gameList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGames() as unknown as AnyAction);
  }, [dispatch]);

  const getGamePanel = (game: FeedGame) => {
    return (<>
      <Row>
        <Col>
          <div className="d-flex justify-content-center" style={{ marginTop: 70, paddingBottom: 20, width: "100%" }}>
            <Card style={{ width: "90%" }}>
              <Card.Header>{game.title}</Card.Header>
              <Card.Body>
                <iframe ref={iframeRef}
                  src={game.url}
                  width={"80%"}
                  height={game.height}
                  allowFullScreen
                  allow="fullscreen" />
              </Card.Body>
              <Card.Body>
                <div className="d-flex justify-content-center">
                  <Row>
                    <Col>
                      <Button className="d-flex align-items-center" style={{ width: 120 }} onClick={() => {
                        setGamePanel(null);
                      }}>
                        <span className="material-icons mr-2">arrow_back</span>
                        Games
                      </Button>
                    </Col>
                    <Col>
                      <Button style={{ width: 120 }} onClick={() => {
                        if (iframeRef.current) {
                          iframeRef.current.src += '';
                        }
                      }}>Reload</Button>
                    </Col>
                    <Col>
                      <Button style={{ width: 120 }} onClick={() => {
                        if (iframeRef.current) {
                          if ((iframeRef.current as any).requestFullscreen) {
                            (iframeRef.current as any).requestFullscreen();
                          } else if ((iframeRef.current as any).mozRequestFullScreen) { // Firefox
                            (iframeRef.current as any).mozRequestFullScreen();
                          } else if ((iframeRef.current as any).webkitRequestFullscreen) { // Chrome, Safari, and Opera
                            (iframeRef.current as any).webkitRequestFullscreen();
                          } else if ((iframeRef.current as any).msRequestFullscreen) { // IE/Edge
                            (iframeRef.current as any).msRequestFullscreen();
                          }
                        }
                      }}>Fullscreen</Button>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

    </>)
  }


  return (
    <div className={classes.root}>

      <div className={classes.header}>
        <h4 style={{ color: "grey" }}>{appName}</h4>
        <Image width={30} height={30} src={"./images/ShyHumanGamesRobot.png"} />
      </div>

      <div className={classes.content}>
        {(content) ? (<div>
          {content}
        </div>) : (gamePanel !== null) ? gamePanel : (<div>
          <Container>
            {gameList?.map((game: FeedGame, index: number, array: FeedGame[]) => {
              return <GameFeedGamePanel title={game.title}
                description={game.description}
                imageSrc={game.gameImage}
                onPlay={() => {
                  const gamePanel = getGamePanel(game);
                  setGamePanel(gamePanel);
                }}
              />;
            })}

          </Container>
        </div>)}

      </div>


    </div>
  );
}
