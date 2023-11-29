type CSSProperty = string | number;

export const getGlobalStyles = {
    root: {
        display: "relative",
        zIndex: 0,
        minHeight: "100vh"
    },
    
    header: {
        top: 0,
        zIndex: 1,
        width: "100%",
        backgroundColor: "white",
        padding: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
    content: {
        marginTop: "40px",
        maxWidth: "100%",
        width: "100%", 
        paddingLeft: 10, 
        paddingRight: 10
    }, 
    gameCard: {

    }
};