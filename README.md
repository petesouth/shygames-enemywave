# ShyHumanGames Project

## Shy Human Games

Offering both Downloadable and Web Games for an engaging Casual Gaming experience.

## Tools

- **gohttp**: A lightweight, straightforward golang server you can bundle with your game for Linux users, ensuring they have a seamless gameplay experience. Simply compile and include `gohttp` or `gohttp.exe` in your zip file alongside the phaser `.html`.

- **Note**: Each tool listed under this section is designed to be self-contained. The objective is to utilize the output from these tools in your game distributable. They are crafted to facilitate the packaging of a phaser.io or other web app game into a local downloadable game application.

- For a quick setup of a file server for playing a web game locally on a user's computer, refer to `tools/gohttp/readme.md`.

- The adoption of golang is due to its standalone nature, requiring no additional infrastructure to operate.

     [How to deploy Golang to production step by step](https://codesahara.com/blog/how-to-deploy-golang-to-production-step-by-step)
    
     [React Native Getting Started](https://reactnative.dev/docs/getting-started)

### gohttp
This project encapsulates a local application that initiates a local webserver, subsequently opening a browser window to display the designated index. It is devised for packaging a web application into a downloadable game, enabling gameplay in a browser via http on a local basis (without internet connectivity). This is particularly beneficial for platforms like Steam and other exclusive downloadable game services.

### shyhumangamesrunner 
A C# Application that seamlessly renders a browser window over its panel area, internally launching a webserver and directing its browser control to the `index.html`. To utilize this, compile a release, create a folder as an overlay of `/release/*` from the C#, merged with `/index.html` and all root files the web/phaser game necessitates at the same destination directory `game/`. Subsequently, compress the game folder into `game.zip`. Upon downloading, users can execute `shyhumangamesrunner.exe` to enjoy the game in a manner akin to a traditional downloadable game, unbeknownst to them, it's powered by Phaser.

# For a demo of the games, visit:

- [Shy Human Games - Game Feed Live](https://petesouth.github.io/shyhumangames-gamefeed/)
- [games/spacealiensurvival](https://petesouth.github.io/shyhumangames-gamefeed/spacealiensurvival/index.html)

### Copyright 2023 ShyHumanGames Software

License for the Use of "This Software"

Permission is graciously extended, without charge, to any individual procuring a copy of this software and associated documentation files (the "Software"), to view and utilize the Software strictly for educational and personal endeavors. The Software is not to be employed for commercial objectives, including but not limited to, selling, distribution, or deriving profit from the Software or its derivatives.

By engaging with the Software, you are in agreement with the terms and stipulations of this license. Disagreement with these terms warrants abstention from using or viewing the Software.

The Software is furnished "as is", devoid of any warranties, either expressed or implied, including, but not limited to, the warranties of merchantability, suitability for a particular purpose, and noninfringement. In no instance shall the authors or copyright holders be held accountable for any claim, damages, or other liabilities, whether in an action of contract, tort, or otherwise, emanating from, out of, or in connection with the Software or the utilization or other dealings in the Software.

Sublicensing, distribution, sale, or commercial utilization of the Software beyond the explicit permissions granted herein is prohibited. Modification, reverse-engineering, decompilation, or any attempts to extract the source code of the Software are forbidden, save for educational or personal purposes as permitted herein.

All rights, title, and interest in and to the Software (excluding content provided by users) are, and will remain the exclusive property of ShyHumanGames Software. The Software is safeguarded by copyright, trademark, and other laws both within the United States and foreign jurisdictions.

For inquiries regarding this license, please reach out to pete_south@yahoo.com.
