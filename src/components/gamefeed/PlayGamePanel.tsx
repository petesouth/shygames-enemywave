import React from "react";
import { Game as FeedGame } from "../../redux/gameAPI";
import { Button, Card, Col, Row, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PlayGamePanel.css";

export const PlayGamePanel = (props: { game: FeedGame, iframeRef: React.RefObject<HTMLIFrameElement>, onBack: () => void }) => {
  const { game, iframeRef } = props;

  return (
    <>

      <Breadcrumb color="aliceblue" style={{ backgroundColor: 'aliceblue' }}>
        <Breadcrumb.Item style={{ backgroundColor: 'aliceblue' }} href="#" onClick={()=>{props.onBack()}}>All Games</Breadcrumb.Item>
        <Breadcrumb.Item active style={{ backgroundColor: 'aliceblue' }}>{game.title}</Breadcrumb.Item>
      </Breadcrumb>

      <div
        className="d-flex justify-content-center"
        style={{ textAlign: "center", marginTop: 70, overflow: "autoscroll", paddingBottom: 20, width: "100%" }}
      >
        <Card style={{ width: "90%" }}>
          <Card.Header>
            {game.title}
          </Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-center">
              <iframe
                ref={iframeRef}
                src={props.game.url}
                width={"80%"}
                height={props.game.height}
                allowFullScreen
                allow="fullscreen" />
            </div>
          </Card.Body>
          <Card.Body>
            <div className="d-flex justify-content-center">
              <Row>
                <Col>
                  <Button
                    style={{ width: 120 }}
                    onClick={() => {
                      if (iframeRef != null && iframeRef.current != null) {
                        iframeRef.current.src += "";
                      }
                    }}
                  >
                    Reload
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: 120, textAlign: "center" }}
                    onClick={() => {
                      if (iframeRef.current) {
                        if ((iframeRef.current as any).requestFullscreen) {
                          (iframeRef.current as any).requestFullscreen();
                        } else if ((iframeRef.current as any).mozRequestFullScreen) {
                          // Firefox
                          (iframeRef.current as any).mozRequestFullScreen();
                        } else if ((iframeRef.current as any).webkitRequestFullscreen) {
                          // Chrome, Safari, and Opera
                          (iframeRef.current as any).webkitRequestFullscreen();
                        } else if ((iframeRef.current as any).msRequestFullscreen) {
                          // IE/Edge
                          (iframeRef.current as any).msRequestFullscreen();
                        }
                      }
                    }}
                  >
                    Fullscreen
                  </Button>
                </Col>
              </Row>
            </div>

          </Card.Body>
        </Card>
      </div>
    </>
  );
};
