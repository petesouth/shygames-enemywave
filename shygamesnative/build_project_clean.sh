
rm -rf node_modules

npm install --save --force

echo Node Installed.  Now Building the ios and bundle.....

cd ios

bundle clean --force
bundle 

echo cleanning up pod cache and then running pod install
rm -rf ~/Library/Caches/CocoaPods
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm -rf Pods
pod deintegrate 
pod setup 
pod install

echo built ios bundle pod install.  Now doing android gradle build...

cd ../android
./gradlew clean
./gradlew build
./gradlew bundleRelease

cd ..


echo Finished Gradle commands in android your currently in directory:

pwd

echo here is the android/app/build/outputs directory:

ls -all ./android/app/build/outputs

echo Builed should have completed:  cd CareMate.   Run npm run ios   or  npm run android
