rm -rf node_modules
rm -rf build 


npm install --save
npm run build
rm sidescrollersamurai.sip
cd build 
zip -r ../sidescrollersamurai.zip ./
cd ..

rm -rf ../../docs/sidescrollersamurai
mv build ../../docs/sidescrollersamurai
