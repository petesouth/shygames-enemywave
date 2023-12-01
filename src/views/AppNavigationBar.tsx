import React from "react";
import { Image, Nav, NavItem, Navbar } from "react-bootstrap";

export function AppNavigationBar({ ongamesclick, onhomeclick, onaboutclick: onaboutclick }: { ongamesclick: () => void, onhomeclick: () => void, onaboutclick: () => void }) {
  return (
    <Navbar>
      <Nav className={"container-fluid"}>
        <Nav style={{ cursor: "pointer" }} onClick={() => { onhomeclick(); }}>
          <NavItem style={{ paddingRight: 20 }}>
            <Image width={30} height={30} src={"./images/ShyHumanGamesRobot.png"} />
          </NavItem>
          <NavItem>
            <h5>ShyHumanGames&nbsp;Software</h5>
          </NavItem>
        </Nav>
        <Nav> {/* This class pushes the Nav to the right */}
          <Nav.Link href="" onClick={() => { onhomeclick(); }}>Home</Nav.Link>
          <Nav.Link href="" onClick={() => { onaboutclick(); }}>About</Nav.Link>
          <Nav.Link href="" onClick={() => { ongamesclick(); }}>Games</Nav.Link>
        </Nav>
      </Nav>

    </Navbar>
  );
}
