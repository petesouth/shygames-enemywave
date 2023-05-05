
SHYGAMES PROJECT

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).



## tools

*Note: Each project under tools is self inclusive.  Your meant to take the output and use it in your game distirbutable.  The tools are to aid in shipping a phaser.io or other webapp game as a local downloable game application.

Checkout tools/gohttp/reademe.md for a quick and dirty filer server for playing
a web game locally to a user's computer

The reason for golang is it requires no infastructure to run.  golang is self inclusive.

     https://codesahara.com/blog/how-to-deploy-golang-to-production-step-by-step/
     
     https://reactnative.dev/docs/getting-started

### gohttp
This project is a local application that runs a local webserver and then brins
up a browser windows to display the configured index.  You'd use this to package
a web application as a downloadable game.  Lets the game play in a browser over http
BUT it's running local (not internet).  This is for things like steam, and other downloadable exclusive game services.

### Shygames native
Excatly the same purpose as gohttp except as a localhost on the phone app. Doin this using react-native-webview and react-native-http-server

### Window Browser 
is a CSharp .net WebForm app program.  It's a Native Window that wraps the Chrome Browser Control over the window body 100percent in both directions x and y.
It gets launched by gohttp.

#### Here's how you can use this to bundle your game.
##### Purpose is so you can bundle a web game as a downloadable game and it plays on the users box.  Sorta like Electron.  but this is way more light wieght.
- Compile gohttp copy that you your webgames root directory (index.html should live there).
- Compile and copy the Windowbrowser into the same directory.
- Run gohttp this will start up a local host web server and launch the Windowbrowser to play the game in the window broser.

