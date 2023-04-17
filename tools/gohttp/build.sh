



#Using this to show the webserver.
#The purpose of this is to show
#the game in a window so it runs
#as a local application/game (downloadable game)


# ****** Make a windows Distributable
GOARCH=windows go get github.com/zserge/webview
GOARCH=windows go install github.com/zserge/webview

#in the same way go get does
GOARCH=windows go install ./gohttp.go

cp $GOPATH/bin/gohttp ./dist/gohttpwindows



# ******* Make a Linux Distributable
GOARCH=linux go get github.com/zserge/webview
GOARCH=linux go install github.com/zserge/webview

#in the same way go get does
GOARCH=linux go install ./gohttp.go

cp $GOPATH/bin/gohttp ./dist/gohttplinux


echo "build was successful pleas check ./dist for your generated files"
ls -all ./dist

