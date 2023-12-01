import React, { useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Game as FeedGame, fetchGames } from "../redux/gameAPI";
import { getGlobalStyles } from "../style";
import { useEffect, useState } from "react";
import { AnyAction } from "redux";

import { GetGameFeed } from "./GetGameFeed";
import { PlayGamePanel } from "../components/gamefeed/PlayGamePanel";
import { AppNavigationBar } from "./AppNavigationBar";
import { HomePanel } from "../components/home/HomePanel";
import { AboutPanel } from "../components/contact/AboutPanel";


export function AppMainGameFeed() {
  const classes = getGlobalStyles;
  //const navigate = useNavigate();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [gamePanel, setGamePanel] = useState<JSX.Element | null>(null);
  const gameList = useSelector<any, FeedGame[]>((state) => state.games.gameList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGames() as unknown as AnyAction);
  }, []);

  useEffect(() => {
    setGamePanel(homePanel);
  }, [gameList]);


  
  const gameFeedList = <GetGameFeed gameList={gameList} onplaygame={(game: FeedGame): void => {
    const gamePlayPanel = <PlayGamePanel game={game} iframeRef={iframeRef} onBack={() => {
      setGamePanel(gameFeedList);
    }} />;
  
    setGamePanel(gamePlayPanel);
  }} />;

  const homePanel = <HomePanel onShipClicked={()=>{
    setGamePanel(aboutPanel)
  }}/>

  const aboutPanel = <AboutPanel />

  
  return (
    <div style={{ ...classes.root }}>
      <div style={{ ...classes.header }}>
        <AppNavigationBar ongamesclick={() => { setGamePanel(gameFeedList) }} 
                          onhomeclick={() => { setGamePanel(homePanel) }}
                          onaboutclick={() => { setGamePanel(aboutPanel) }} />
      </div>
      {gamePanel}
    </div>
  );
}
