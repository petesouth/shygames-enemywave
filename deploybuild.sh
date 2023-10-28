rm -rf node_modules
rm -rf build
find docs/ -mindepth 1 ! -name "spacealiensurvival" -exec rm -rf {} \;
find docs/ -mindepth 1 ! -name "spacealiensurvival" -exec rm -r {} \;

npm install --save --force
npm run build

cp -r ./build/* ./docs/
ls docs --all