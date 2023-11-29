import React from "react";
import { Image, Nav, NavItem, Navbar } from "react-bootstrap";

export function AppNavigationBar({ ongamesclick, onhomeclick, oncontactsclick }: { ongamesclick: () => void, onhomeclick: ()=>void, oncontactsclick: ()=>void }) {
  return (
    <Navbar>
      <Nav className={"container-fluid"}>
        <Nav style={{ cursor: "pointer"}} onClick={() => { onhomeclick(); }}>
          <NavItem style={{ paddingRight: 20 }}>
            <Image width={30} height={30} src={"./images/ShyHumanGamesRobot.png"} />
          </NavItem>
          <NavItem>
            ShyHumanGames Software
          </NavItem>
        </Nav>
        <Nav> {/* This class pushes the Nav to the right */}
        <Nav.Link href="" onClick={() => { onhomeclick(); }}>Home`</Nav.Link>
          <Nav.Link href="" onClick={() => { ongamesclick(); }}>All Games</Nav.Link>
        </Nav>
      </Nav>

    </Navbar>
  );
}
