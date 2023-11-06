rm -rf node_modules
rm -rf build
rm -rf docs/static
rm -rf docs/images
rm -rf docs/asset-manifest.json
rm -rf docs/images/ShyHumanGameRobot.png
rm -rf docs/index.html
rm -rf docs/manifest.json
rm -rf docs/robots.txt


npm install --save --force
npm run build

cp -r ./build/* ./docs/
ls docs --all
