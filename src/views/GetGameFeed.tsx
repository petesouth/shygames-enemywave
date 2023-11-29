import React from "react";
import { Game as FeedGame } from "../redux/gameAPI";
import { Col, Container, Row } from "react-bootstrap";
import { GameFeedGamePanel } from "../components/gamefeed/GameFeedGamePanel";
import { getGlobalStyles } from "../style";




export const GetGameFeed = ({ gameList, onplaygame }: { gameList: FeedGame[], onplaygame: (game: FeedGame) => void }) => {
  const classes = getGlobalStyles;

  return (
    <Container fluid style={{ ...classes.content, paddingBottom: 20 }}>
      <Row>
        <Col>
          <div style={{ textAlign: "center", width: "100%" }}>
            <h6 style={{ color: "grey", paddingLeft: "10px", marginTop: 8 }}>Browse and Play Our Games!</h6>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {gameList?.map((game: FeedGame, index: number) => (
          <Col xs={12} md={6} lg={4} key={game.id} className="mb-4"> {/* Adjust the key to be a unique identifier */}
            <GameFeedGamePanel
              title={game.title}
              description={game.description}
              imageSrc={game.gameImage}
              onPlay={() => onplaygame(game)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
