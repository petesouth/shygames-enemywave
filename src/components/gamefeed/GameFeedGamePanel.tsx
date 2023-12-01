import { Card, Container, Row, Image, Col, Button } from "react-bootstrap";
import { getGlobalStyles } from '../../style';
import * as colors from "../../colors/index";
import { Utils } from "../../utils/Utils";

export interface GameFeedGamePanelProps {
    imageSrc: string,
    title: string,
    description: string,
    onPlay: () => void
}

export const GameFeedGamePanel = ({ imageSrc, title, description, onPlay }: GameFeedGamePanelProps) => {
    const classes = getGlobalStyles;

    return (
        <div className="d-flex justify-content-center" style={{width: "100%"}}>
            <Card style={{
                ...classes.gameCard,
                ...classes.content,
                textAlign: "center",
                width: 380,
                height: 500,
                minWidth: 300,
                minHeight: 500,
                cursor: "pointer"
            }}
                onClick={() => {
                    onPlay();
                }}>
                <Card.Body>
                    <Image style={{ width: "100%", height: 340 }} src={imageSrc} />
                </Card.Body>
                <Card.Body>
                    <h6 style={{ color: colors.grey[600] }}>{title}</h6>
                    <p style={{ fontSize: 12, textAlign: 'left' }}>
                        {Utils.displayLongString(description, 150)}
                    </p>
                </Card.Body>
            </Card>
        </div>
    );
};
