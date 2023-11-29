import React, { useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Game as FeedGame, fetchGames } from "../redux/gameAPI";
import { getGlobalStyles } from "../style";
import { useEffect, useState } from "react";
import { AnyAction } from "redux";

import { GetGameFeed } from "./GetGameFeed";
import { PlayGamePanel } from "../components/gamefeed/PlayGamePanel";
import { AppNavigationBar } from "./AppNavigationBar";



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
      <div style={{ ...classes.header }}>
        <AppNavigationBar ongamesclick={() => { setGamePanel(null) }} />
      </div>
      <div style={{...classes.content, paddingBottom: 20}}>
        {content ? (
          <div>
            {content}
          </div>
        ) : (gamePanel !== null) ? (
          gamePanel
        ) : (<GetGameFeed gameList={gameList} onplaygame={(game: FeedGame): void => {
          const gamePanel = <PlayGamePanel game={game} iframeRef={iframeRef} onBack={() => {
            setGamePanel(null);
          }} />;
          setGamePanel(gamePanel);
        }} />)}
      </div>
    </div>
  );
}
