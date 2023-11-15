rm -rf node_modules
rm -rf build 


npm install --save
npm run build
rm spacealiensurvival.sip
cd build 
zip -r ../spacealiensurvival.zip ./
cd ..

rm -rf ../../docs/spacealiensurvival
mv build ../../docs/spacealiensurvival
