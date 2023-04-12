


# go get github.com/mhale/smtpd
# go install github.com/mhale/smtpd

# go get github.com/go-resty/resty   
# go install github.com/go-resty/resty 

# go get github.com/nsqio/go-nsq
# go install github.com/nsqio/go-nsq

# go get github.com/go-sql-driver/mysql
# go install github.com/go-sql-driver/mysql


go install github.com/petesouth/shygames-gamefeed/3rdparty/gohttp/src/gohttp

mv $GOPATH/bin/gohttp $GOPATH/bin/gohttp
cp $GOPATH/bin/gohttp $GOPATH/src/github.com/petesouth/shygames-gamefeed/3rdparty/gohttp/dist

echo "build was successful"

