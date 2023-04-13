



#This bit here simulates go get by copying it local
#in the same way go get does
go install ./gohttp.go

cp $GOPATH/bin/gohttp ./dist

echo "build was successful"

