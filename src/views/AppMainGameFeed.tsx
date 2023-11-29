import React, { LegacyRef, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Game as FeedGame, fetchGames } from "../redux/gameAPI";
import { getGlobalStyles } from "../style";
import { Container, Image, Nav, NavDropdown, NavItem, Navbar } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AnyAction } from "redux";

import { useNavigate } from "react-router-dom";
import { GetGameFeed } from "./GetGameFeed";
import { PlayGamePanel } from "../components/gamefeed/PlayGamePanel";





function AppNavigationBar({ ontitleclick }: { ontitleclick: () => void }) {
  return (
    <Navbar>
      <Nav className={"container-fluid"}>
        <Nav>
          <NavItem style={{ paddingRight: 20 }}>
            <Image width={30} height={30} src={"./images/ShyHumanGamesRobot.png"} />
          </NavItem>
          <NavItem>
            ShyHumanGames Software
          </NavItem>
        </Nav>
        <Nav> {/* This class pushes the Nav to the right */}
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Games</Nav.Link>
          <Nav.Link href="#link">About</Nav.Link>
          <Nav.Link href="#link">Contact</Nav.Link>
        </Nav>
      </Nav>

    </Navbar>
  );
}



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
      <div style={{ ...classes.header }}>
        <AppNavigationBar ontitleclick={() => { setGamePanel(null) }} />
      </div>
      <div style={{ ...classes.content }}>
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
