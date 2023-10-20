
ShyHumanGames PROJECT

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

### ShyHumanGames native
Excatly the same purpose as gohttp except as a localhost on the phone app. Doin this using react-native-webview and react-native-http-server

### Window Browser 
is a CSharp .net WebForm app program.  It's a Native Window that wraps the Chrome Browser Control over the window body 100percent in both directions x and y.
It gets launched by gohttp.

#### Here's how you can use this to bundle your game.
##### Purpose is so you can bundle a web game as a downloadable game and it plays on the users box.  Sorta like Electron.  but this is way more light wieght. Doesn't require npm etc. to be installed on a box.  Golang and Windows browser CSHarp will support Ubuntu, Windows (default) and Mac IOS.
- Compile gohttp copy that you your webgames root directory (index.html should live there).
- Compile and copy the shyhumangamesrunner into the same directory.
- Run gohttp this will start up a local host web server and launch the shyhumangamesrunner to play the game in the window broser.
- Same deal with the shyhumangames Native.  This is just a react-native program running react-native-http-server and react-native-browser streteched over. Running a web game url




### Copyright 2023 ShyHumanGames LLC

License for Use of "This software"

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to view and use the Software solely for educational and personal purposes. The Software may not be used for commercial purposes, including but not limited to selling, distributing, or profiting from the Software or its derivatives.

By using the Software, you agree to the terms and conditions of this license. If you do not agree to these terms, do not use or view the Software.

The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.

You may not sublicense, distribute, sell, or use the Software for commercial purposes other than as explicitly permitted above. You may not modify, reverse-engineer, decompile, or otherwise attempt to extract the source code of the Software, except for educational or personal purposes as permitted above.

All rights, title, and interest in and to the Software (excluding content provided by users) are and will remain the exclusive property of ShyHumanGames LLC. The Software is protected by copyright, trademark, and other laws of both the United States and foreign countries.

If you have questions about this license, please contact pete_south@yahoo.com





test
