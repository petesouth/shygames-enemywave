import { Card, Col, Container, Image, Row } from "react-bootstrap";
import "./AboutPanel.css";
import { getGlobalStyles } from "../../style";

const AboutPanelContent = () => {
  const textStyle = {
    fontSize: '0.8rem',
    lineHeight: '1.4',
    marginBottom: '1rem',
    textShadow: '0px 0px 2px rgba(0, 0, 0, 0.3)'
  };

  return (
    <Container style={{
      textShadow: '0px 0px 2px rgba(0, 0, 0, 0.2)',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px 10px',
      borderRadius: '15px',
    }}>
      <Image rounded={true} style={{ width: "100%" }} src="./images/aboutfunpage.png" />

      <h1 style={{ ...textStyle, paddingTop: 20, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        About ShyHumanGames Software
      </h1>

      <h2 style={{ ...textStyle, fontSize: '1.25rem' }}>
        Our Genesis:
      </h2>
      <p style={textStyle}>
        ShyHumanGames Software began as a spark in the indie game development world, ignited by a passion for crafting interactive experiences that captivate and inspire. With roots planted firmly in Las Vegas, Nevada, our journey started in 2022, with a commitment to blend the thrill of gaming with the precision of software engineering. Today, we stand as a beacon of creativity and innovation in the software consulting arena, with a portfolio that spans across various industries and reaches a global clientele.
      </p>

      <h2 style={{ ...textStyle, fontSize: '1.25rem' }}>
        Our Philosophy:
      </h2>
      <p style={textStyle}>
        Games are not just our products; they are the language through which we express our most imaginative ideas. We believe in pushing boundaries, exploring new horizons of digital interactivity, and providing a playground for the mind where the impossible becomes the next level. Our consulting services mirror this philosophy, as we approach each software challenge with a game developer's creativity and an engineer's precision.
      </p>

      <h2 style={{ ...textStyle, fontSize: '1.25rem' }}>
        Our Battlefield:
      </h2>
      <p style={textStyle}>
        Armed with state-of-the-art technology and an arsenal of experience, our team of Senior Software Engineer Consultants specializes in turning complex software puzzles into user-friendly solutions. We delve deep into the mechanics of game development, from Phaser to Unity and Unreal, while mastering the backend intricacies of server setup, cloud migration, and database architecture.
      </p>

      <h2 style={{ ...textStyle, fontSize: '1.25rem' }}>
        Our Allies:
      </h2>
      <p style={textStyle}>
        We forge alliances with visionaries and enterprises, bringing to the table a treasure trove of skills in React Native, TypeScript, Golang, C#/NET, and more. Our collaborations with the open-source community and support for indie developers reflect our commitment to the collective growth of the software industry.
      </p>

      <h2 style={{ ...textStyle, fontSize: '1.25rem' }}>
        Our Campaigns:
      </h2>
      <p style={textStyle}>
        Our projects are as varied as they are innovative. From web, mobile, and PC games that redefine browser-based gaming to consulting services that orchestrate cloud deployment, microservices architecture, and AI-enhanced operations, we ensure our clients are equipped for success. Our multiplayer server designs are not just about connectivity; they are hubs where strategies unfold and adventures are lived.
      </p>

      <h2 style={{ ...textStyle, fontSize: '1.25rem' }}>
        Our Quest:
      </h2>
      <p style={textStyle}>
        At ShyHumanGames Software, our mission is dual-faceted: to continue pioneering unforgettable gaming experiences and to architect software solutions that propel businesses forward. We are not just developers or consultants; we are storytellers, strategists, and allies in your digital narrative. When you partner with us, you're not just hiring a service; you're engaging with a team that is dedicated to elevating your vision with the latest in software innovation.
      </p>

      <h2 style={{ ...textStyle, fontSize: '1.25rem' }}>
        Service Portfolio
      </h2>
      <p style={textStyle}>
        At ShyHumanGames Software, we leverage a rich tapestry of technological expertise to provide a wide array of software solutions. Here's a glimpse of what we offer:
      </p>

      {/* List of services */}
      <p style={textStyle}>
        <ul>
          <li><strong>Custom Game Development:</strong> Developing engaging and innovative games for web, mobile, and PC platforms, including browser-based and downloadable games. Specializing in casual gaming and extending the realm of web games.</li>
          <li><strong>Cloud Architecture and Management:</strong> Proficient in cloud deployment, migration, and management services. Expertise in AWS, Azure, and GCLOUD platforms, focusing on microservice and container architecture design, setup, and implementation.</li>
          <li><strong>Backend Development:</strong> Crafting robust event-driven applications, managing big data solutions, logging systems, and developing content management systems. Experience in server setup and backend architecture.</li>
          <li><strong>Database Design and Management:</strong> Deep knowledge in SQL and NoSQL database design, scaling, and management, ensuring efficient and optimized data operations.</li>
          <li><strong>Frontend Development and UI/UX Design:</strong> Building immersive frontend experiences with expertise in React Native, React, TypeScript, and other modern web technologies. Focus on creating responsive and user-friendly interfaces.</li>
          <li><strong>IT Administration and DevOps:</strong> Comprehensive IT management, including the setup and administration of HTML and Fragment/Rest servers. Expertise in continuous integration and delivery pipelines, with a focus on scalability and reliability.</li>
          <li><strong>AI Integration and Machine Learning:</strong> Implementing AI-driven solutions, including localized language models and chatbot applications, to enhance business operations and user experiences.</li>
          <li><strong>Full-Stack Software Development:</strong> Extensive experience in full-stack development, including Java, Python, PHP, GoLang, C#, and .NET frameworks, capable of handling complex software solutions from front-end to back-end.</li>
          <li><strong>Agile and Scrum Methodologies:</strong> Proficient in agile project management techniques, ensuring efficient and effective development processes.</li>
          <li><strong>Game Marketing and Distribution:</strong> Experience with game marketing platforms like itch.io, Steam, and YouTube, handling the promotion and distribution of games.</li>
          <li><strong>Multiplayer Server Design/Hosting:</strong> Expertise in designing and hosting multiplayer servers for gaming, ensuring seamless and scalable gaming experiences.</li>
          <li><strong>Backend Languages and Frameworks:</strong> Proficient in Golang, C#/NET, Python, Java, and PHP. Expertise in server-side programming, API development, and application architecture.</li>
          <li><strong>Frontend Frameworks and Languages:</strong> Skilled in React, React Native, TypeScript, JavaScript, HTML5, and CSS. Experienced in crafting dynamic and responsive user interfaces.</li>
        </ul>

      </p>

      <h2 style={{ ...textStyle, fontSize: '1.25rem' }}>
        Connect with Us:
      </h2>
      <p style={textStyle}>
        Embark on your next adventure in gaming or harness the power of bespoke software solutions with ShyHumanGames Software. Connect with us at [contact@example.com], and let's build the future, one epic chapter at a time. Email us at: <a href="mailto:pete_south@yahoo.com">pete_south@yahoo.com</a> for more details!
      </p>


    </Container>
  );
};
export const AboutPanel = () => {
  const classes = getGlobalStyles;



  return (
    <div style={{ ...classes.content, paddingBottom: 20 }}>
      <AboutPanelContent />
    </div>
  );
};
