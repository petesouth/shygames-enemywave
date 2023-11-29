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
        paddingLeft: 20, 
        paddingRight: 20
    }, 
    gameCard: {

    },
    buttonStyle: {
        padding: '6px 12px', // Reduced padding for less bulkiness
        fontSize: '0.8rem', // Smaller font size for the text
        border: 'none', // Remove border for a flat design
        borderRadius: '15px', // Rounded corners, but not too pill-shaped
        backgroundColor: '#1c1c1e', // Flat color, you can adjust as needed
        color: 'white', // Text color for contrast
        boxShadow: 'none', // No shadow for a flatter design
        width: '100px', // Fixed width for uniformity
        textAlign: 'center',
      }
};