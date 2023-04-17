



#Using this to show the webserver.
#The purpose of this is to show
#the game in a window so it runs
#as a local application/game (downloadable game)


rm ./dist/gohttp.exe
rm ./dist/gohttp
ls -all ./dist

# ******* Make a Linux Distributable
# go get -u github.com/gotk3/gotk3/gtk


# Build Windows server
GOOS=windows go install ./gohttp.go
cp $GOPATH/bin/gohttp.exe ./dist/gohttp.exe


#Build Linux Server
GOOS=linux go install ./gohttp.go

cp $GOPATH/bin/gohttp ./dist/gohttp


echo "build was successful pleas check ./dist for your generated files"
ls -all ./dist

