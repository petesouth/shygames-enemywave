
ShyHumanGames PROJECT

## Shy Human Games

Downloadable and Web Games for Casual Gaming.

## Tools

- gohttp: Simple golang server super light you can ship with your game for linux users
          so they can play the game.  Compile and include gohttp or gohttp.exe in your zip file
          with the phaser .html


- Note: Each project under tools is self inclusive.  Your meant to take the output and use it in your game distirbutable.  The tools are to aid in shipping a phaser.io or other webapp game as a local downloable game application.

- Checkout tools/gohttp/reademe.md for a quick and dirty filer server for playing a web game locally to a user's computer

- The reason for golang is it requires no infastructure to run.  golang is self inclusive.

     ```https://codesahara.com/blog/how-to-deploy-golang-to-production-step-by-step```
    
     ```https://reactnative.dev/docs/getting-started```

### gohttp
This project is a local application that runs a local webserver and then brins
up a browser windows to display the configured index.  You'd use this to package
a web application as a downloadable game.  Lets the game play in a browser over http
BUT it's running local (not internet).  This is for things like steam, and other downloadable exclusive game services.


### shyhumangamesrunner 
C# Application that renders a browser Window 100% over it's panel area.  It then spawns a webserver internal and navigates it's controlled browser control to the index.html.  To make this you compile release and crate a folder that's and overlay of /release/* from the c# copied in with /index.html and all the root files the web/phaser game requires all at the same dest diretory same game/   then you zip up game as game.zip  they download it and double click shyhumangamesrunner.exe and it runs they're app that in a way that runs just like a downloadable game. They'll never know it's phaser




# For a demo of the games see:

- https://petesouth.github.io/shyhumangames-gamefeed/spacealiensurvival/index.html




### Copyright 2023 ShyHumanGames LLC

License for Use of "This software"

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to view and use the Software solely for educational and personal purposes. The Software may not be used for commercial purposes, including but not limited to selling, distributing, or profiting from the Software or its derivatives.

By using the Software, you agree to the terms and conditions of this license. If you do not agree to these terms, do not use or view the Software.

The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.

You may not sublicense, distribute, sell, or use the Software for commercial purposes other than as explicitly permitted above. You may not modify, reverse-engineer, decompile, or otherwise attempt to extract the source code of the Software, except for educational or personal purposes as permitted above.

All rights, title, and interest in and to the Software (excluding content provided by users) are and will remain the exclusive property of ShyHumanGames LLC. The Software is protected by copyright, trademark, and other laws of both the United States and foreign countries.

If you have questions about this license, please contact pete_south@yahoo.com
