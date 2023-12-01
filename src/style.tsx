

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
    },
    liPadding: {
        paddingTop: 7,
        paddingBottom: 7
    },
    textStyle: {
        fontSize: '0.8rem',
        lineHeight: '1.4',
        marginBottom: '1rem',
        textShadow: '0px 0px 2px rgba(0, 0, 0, 0.3)'
    },
    textContainer: {
        width: '75%',
        margin: '0 auto',
        padding: '20px 10px',
        borderRadius: '15px',
        minWidth: 300,
        maxWidth: 1024,
        minHeight: "80%"
    },
    darkBackgroundWhiteTextColor: {
        textShadow: '0px 0px 2px rgba(0, 0, 0, 0.2)',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white'
    },
    textShadowMoreClear: {
        textShadow: '0px 0px 8px rgba(0, 0, 0, 0.8)'
    }
};