import React from "react";
import { Game as FeedGame } from "../../redux/gameAPI";
import { Button, Card, Col, Row, Breadcrumb, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HomePanel.css";
import { getGlobalStyles } from "../../style";


const LandingPageContent = () => {
  // Define a base style for text elements to avoid repetition
  const textStyle = {
    fontSize: '0.8rem', // Smaller base font size for text
    lineHeight: '1.4',  // Adjusted line height for readability
    marginBottom: '1rem', // Space between paragraphs
  };

  return (
    <Container style={{
      color: 'white',
      textShadow: '0px 0px 8px rgba(0, 0, 0, 0.8)',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px 10px',
      background: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '15px',
    }}>
      <h1 style={{ ...textStyle, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        Welcome to ShyHumanGames
      </h1>
      <h2 style={{ ...textStyle, fontSize: '1.25rem' }}>
        Empowering Your Gaming Vision
      </h2>
      <p style={textStyle}>
        At ShyHumanGames, we're not just passionate about games; we're revolutionizing them. As a leading provider in software consulting and custom game development, we specialize in bringing unique gaming experiences to life. Whether it's for web, mobile, or PC platforms, our expertise is your gateway to extraordinary gaming solutions.
      </p>

      <h3 style={{ ...textStyle, fontSize: '1.1rem' }}>
        Our Expertise at Your Fingertips
      </h3>
      <p style={textStyle}>
        <strong>Cutting-Edge Game Development:</strong> Dive into the world of browser-based and downloadable games with us. Our focus spans across major platforms like iOS, Android, PCs, and Mac, with a special emphasis on browser gaming. We're pushing boundaries in casual gaming, redefining what's possible in web games, and supporting indie developers globally.
      </p>
      <p style={textStyle}>
        <strong>Tailored Software Solutions:</strong> From server setup and cloud migration to building dynamic dashboards and portals, we handle it all. Our proficiency in HTML, serverless microservices, and DevOps ensures your project's backbone is strong and scalable.
      </p>
      <p style={textStyle}>
        <strong>Tech That Powers Your Game:</strong> Our tech stack is diverse and robust. We're skilled in React Native, React, Redux/Toolkit, TypeScript, Golang, C#/NET, Phaser.IO, Unity, Unreal, BabylonJS, and more. Whether it's frontend or backend development, we've got you covered.
      </p>
      <p style={textStyle}>
        <strong>Strategic Game Marketing:</strong> Leverage our expertise in game marketing across platforms like itch.io, Steam, and YouTube. We know the ins and outs of making your game a success in the digital marketplace.
      </p>
      <p style={textStyle}>
        <strong>Innovative Multiplayer and Cloud Services:</strong> From designing multiplayer server architectures to managing cloud deployments on AWS, Azure, and GCLOUD, we ensure your games are accessible, scalable, and engaging.
      </p>

      <h3 style={{ ...textStyle, fontSize: '1.1rem' }}>
        Join Our Journey
      </h3>
      <p style={textStyle}>
        At ShyHumanGames, we're more than just a company; we're a community of innovators. We're committed to supporting and enhancing the open-source gaming community. Partner with us, and let's create gaming experiences that captivate and inspire.
      </p>

      <h3 style={{ ...textStyle, fontSize: '1.1rem' }}>
        Ready to Elevate Your Game?
      </h3>
      <p style={textStyle}>
        Connect with us to explore how we can transform your gaming ideas into reality.
      </p>
    </Container>
  );
};


export const HomePanel = () => {
  const classes = getGlobalStyles;

  return (
    <div style={{
      backgroundImage: "url('./images/sitebackground.png')",
      backgroundSize: 'cover', // This ensures the image covers the entire div
      backgroundRepeat: 'no-repeat', // This prevents the image from repeating
      backgroundPosition: 'center', // This centers the image in the div
      width: '100%', // This sets the width of the div to full width of its parent
      height: '100%', // This sets the height of the div to full height of its parent
      minHeight: '100vh' // This ensures the div stretches to at least the height of the viewport
    }}>
      <LandingPageContent />
    </div>
    
  );
};
