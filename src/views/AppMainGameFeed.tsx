import { useDispatch, useSelector } from "react-redux";
import {Game as FeedGame, fetchGames} from "../redux/gameAPI";
import { getGlobalStyles } from "../style";
import { Container, Image } from "react-bootstrap";
import { GameFeedGamePanel } from "../components/gamefeed/GameFeedGamePanel";
import { useEffect } from "react";
import { AnyAction } from "redux";

import shyGamesRobotImage from "../assets/ShyGamesRobot.png";

const appName: string = (process.env.REACT_APP_APP_NAME) ? process.env.REACT_APP_APP_NAME : "REACT_APP_APP_NAME NOT FOUND PLEASE DEFINE"


export interface AppMainGameFeedProps {
  content?: JSX.Element
}

export function AppMainGameFeed({ content }: AppMainGameFeedProps) {
  const classes = getGlobalStyles();

  const gameList = useSelector<any, FeedGame[]>((state) => state.games.gameList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGames() as unknown as AnyAction);
  }, [dispatch]);

  return (
    <div className={classes.root}>

      <div className={classes.header}>
        <h4 style={{ color: "grey" }}>{appName}</h4>
        <Image width={30} height={30} src={shyGamesRobotImage} />
      </div>

      <div className={classes.content}>
        {(content) ? (<div style={{ padding: 40 }}>
          {content}
        </div>) : (<div style={{ padding: 40 }}>
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
        </div>)}

      </div>


    </div>
  );
}
