


# go get github.com/mhale/smtpd
# go install github.com/mhale/smtpd

# go get github.com/go-resty/resty   
# go install github.com/go-resty/resty 

# go get github.com/nsqio/go-nsq
# go install github.com/nsqio/go-nsq

# go get github.com/go-sql-driver/mysql
# go install github.com/go-sql-driver/mysql


#This bit here simulates go get by copying it local
#in the same way go get does
cd $GOPATH/src
mkdir -r github.com/petesouth/gohttp
cp -r ./* $GOPATH/src/github.com/petesouth/gohttp/

go install github.com/petesouth/gohttp/src/gohttp

cp $GOPATH/bin/gohttp ./dist

echo "build was successful"

