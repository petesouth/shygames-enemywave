import React from "react";
import { Game as FeedGame } from "../redux/gameAPI";
import { Col, Container, Row } from "react-bootstrap";
import { GameFeedGamePanel } from "../components/gamefeed/GameFeedGamePanel";




export const GetGameFeed = ({ gameList, onplaygame }: { gameList: FeedGame[], onplaygame: (game: FeedGame) => void }) => {
  return (
    <>
      <Row>
        <Col>
          <div style={{ textAlign: "center", width: "100%" }}>
            <h6 style={{ color: "grey", paddingLeft: "10px", marginTop: 8 }}>Browse and Play Our Games!</h6>
          </div>
        </Col>
      </Row>
      <Row>
        {gameList?.map((game: FeedGame, index: number, array: FeedGame[]) => {
          return (<Col xs={12} sm={6} ><GameFeedGamePanel title={game.title}
            description={game.description}
            imageSrc={game.gameImage}
            onPlay={() => {
              onplaygame(game);
            }} />
          </Col>);
        })}
      </Row>
      <Row>
        <Col>
          <div style={{ textAlign: "center", height: 20, width: "100%" }}>
          </div>
        </Col>
      </Row>

    </>
  );
};
