import { colors } from "@material-ui/core";
import { Card, Container, Row, Image, Col, Button } from "react-bootstrap";

import { getGlobalStyles } from '../../style';


export interface GameFeedGamePanelProps {
    imageSrc: string,
    title: string,
    description: string,
    onPlay: () => void
}

export const GameFeedGamePanel = ({ imageSrc, title, description, onPlay }: GameFeedGamePanelProps) => {
    const classes = getGlobalStyles();
   
    return (<Row>
        <Col>
            <div className="d-flex justify-content-center align-items-center">
                <Card className={classes.gameCard + " " + classes.content}>
                    <Card.Body><h6 style={{ color: colors.grey[600] }}>{title}</h6></Card.Body>
                    <Card.Body>
                        <div style={{ borderWidth: 1, borderStyle: "solid", borderColor: colors.grey[300], borderRadius: 5 }}>
                            <Image style={{ width: 200, padding: 20 }} src={imageSrc} />
                        </div>
                    </Card.Body>
                    <Card.Body>
                        <div style={{ width: 200, padding: 20 }}>
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