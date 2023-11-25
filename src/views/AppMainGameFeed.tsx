import React, { LegacyRef, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Game as FeedGame, fetchGames } from "../redux/gameAPI";
import { getGlobalStyles } from "../style";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AnyAction } from "redux";

import { useNavigate } from "react-router-dom";

import { GameFeedGamePanel } from "../components/gamefeed/GameFeedGamePanel";
import { PlayGamePanel } from "../components/gamefeed/PlayGamePanel";



const appName: string = "ShyHumanGames Software";



export interface AppMainGameFeedProps {
  content?: JSX.Element;
}

export function AppMainGameFeed({ content }: AppMainGameFeedProps) {
  const classes = getGlobalStyles;
  //const navigate = useNavigate();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [gamePanel, setGamePanel] = useState<JSX.Element | null>(null);
  const gameList = useSelector<any, FeedGame[]>((state) => state.games.gameList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGames() as unknown as AnyAction);
  }, [dispatch]);

  
  return (
    <div style={{ ...classes.root }}>
      <div style={{ ...classes.header, display: "flex", alignItems: "center", paddingLeft: "20px" }}>
        <Image width={30} height={30} src={"./images/ShyHumanGamesRobot.png"} />
        <h6 style={{ color: "grey", paddingLeft: "10px", marginTop: 8, cursor: "pointer" }} onClick={()=>{
          setGamePanel(null);
        }}>{appName}</h6>
      </div>
      <div style={{ ...classes.content }}>
        {content ? (
          <div>
            {content}
          </div>
        ) : gamePanel !== null ? (
          gamePanel
        ) : (
          <div>
            <Container>
              <Row>
                <Col>
                  <div style={{textAlign: "center", width: "100%"}}>
                  <h6 style={{ color: "grey", paddingLeft: "10px", marginTop: 8 }}>Browse and Play Our Games!</h6>
                  </div>
                </Col>
              </Row>
              <Row>
                {gameList?.map((game: FeedGame, index: number, array: FeedGame[]) => {
                  return (<Col xs={12} sm={6}><GameFeedGamePanel title={game.title}
                    description={game.description}
                    imageSrc={game.gameImage}
                    onPlay={() => {
                      const gamePanel = <PlayGamePanel game={game} iframeRef={iframeRef} />
                      setGamePanel(gamePanel);
                    }} />
                    </Col>);
                })}
              </Row>
              <Row>
                <Col>
                  <div style={{textAlign: "center", height: 20, width: "100%"}}>
                  </div>
                </Col>
              </Row>

            </Container>
          </div>
        )}
      </div>
    </div>
  );
}
