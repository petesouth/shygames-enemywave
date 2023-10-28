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

    return (
        <Row>
            <Col>
                <div className="d-flex justify-content-center align-items-center">
                    <Card className={classes.gameCard + " " + classes.content}>
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={10} lg={8} xl={6} className="mx-auto">
                                <h6 style={{ color: colors.grey[600] }}>{title}</h6>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={10} lg={8} xl={6} className="mx-auto">
                                    <Image style={{ width: "100%", padding: 20 }} src={imageSrc} />
                                </Col>
                            </Row>

                        </Card.Body>
                        <Card.Body>
                            <Row>
                                <Col xs={12} md={10} lg={8} xl={6} className="mx-auto">
                                    <p style={{ padding: 20, fontSize: 12, textAlign: 'left' }}>
                                        {description}
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Body>
                            <Container>
                                <Row>
                                    <Col>
                                        <Button onClick={() => onPlay()}>View Details</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Card.Body>
                    </Card>
                </div>
            </Col>
        </Row>
    );
};
