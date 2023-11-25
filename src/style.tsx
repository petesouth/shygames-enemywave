import { createTheme } from '@material-ui/core/styles';

import { makeStyles } from "@material-ui/core";





export const getGlobalStyles = makeStyles({
  root: {
    display: "realative",
    zIndex: 0,
    flexDirection: "column",
    minHeight: "100vh"
  },
  
  header: {
    position: "fixed",
    top: 0,
    zIndex: 1, // Apply higher z-index value
    width: "100%",
    backgroundColor: "white",
    padding: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center"
  },
  content: {
    flex: "d-flex",
    marginTop: "40px",
    maxWidth: "100%",
    width: "100%",
    textAlign: "center",
    
  },
  gameCard: {
   // width: "90%"
  }
});


const theme = createTheme({
  
});

export default theme;