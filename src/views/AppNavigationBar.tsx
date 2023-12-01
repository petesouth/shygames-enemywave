import React from "react";
import { Image, Nav, NavItem, Navbar } from "react-bootstrap";

export function AppNavigationBar({ ongamesclick, onhomeclick, onaboutclick: onaboutclick }: { ongamesclick: () => void, onhomeclick: () => void, onaboutclick: () => void }) {
  return (
    <Navbar>
      <Nav className={"container-fluid"}>
        <Nav style={{ cursor: "pointer" }} onClick={() => { onhomeclick(); }}>
          <NavItem style={{ paddingRight: 10 }}>
            <Image width={15} height={15} src={"./images/ShyHumanGamesRobot.png"} />
          </NavItem>
          <NavItem>
            <h6 style={{marginTop: 5}}>ShyHumanGames</h6>
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
