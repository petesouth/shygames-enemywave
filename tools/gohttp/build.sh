



#Using this to show the webserver.
#The purpose of this is to show
#the game in a window so it runs
#as a local application/game (downloadable game)
go get github.com/zserge/webview
go install github.com/zserge/webview

#in the same way go get does
go install ./gohttp.go

cp $GOPATH/bin/gohttp ./dist

echo "build was successful"

