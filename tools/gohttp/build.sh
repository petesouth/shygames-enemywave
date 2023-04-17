



#Using this to show the webserver.
#The purpose of this is to show
#the game in a window so it runs
#as a local application/game (downloadable game)


rm ./dist/gohttp.exe
rm ./dist/gohttplinux

# ******* Make a Linux Distributable
go get -u github.com/zserge/lorca

#in the same way go get does
GOOS=windows go install ./gohttp.go

cp $GOPATH/bin/gohttp.exe ./dist/gohttp.exe


GOOS=linux go install ./gohttp.go

cp $GOPATH/bin/gohttp ./dist/gohttplinux


echo "build was successful pleas check ./dist for your generated files"
ls -all ./dist

