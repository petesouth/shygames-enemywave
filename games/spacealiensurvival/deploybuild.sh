rm -rf node_modules
rm -rf build 


npm install --save
npm run build


rm -rf ../../docs/spacealiensurvival
mv build ../../docs/spacealiensurvival
