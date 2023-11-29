import React from "react";
import { Image, Nav, NavItem, Navbar } from "react-bootstrap";

export function AppNavigationBar({ ongamesclick }: { ongamesclick: () => void; }) {
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
          <Nav.Link target="_blank" href="#home">Home</Nav.Link>
          <Nav.Link href="#link" onClick={() => { ongamesclick(); }}>Games</Nav.Link>
          <Nav.Link href="#link">About</Nav.Link>
          <Nav.Link href="#link">Contact</Nav.Link>
        </Nav>
      </Nav>

    </Navbar>
  );
}
