	# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###


Simple HTTP server that serves up local files.  But..

because it's golang it requires 0 dependencies so it's perfect to bundle this
so I can use it as an HTTP server for playing local games off of a harddrive.

This is so I can bundle Phaser.IO games.

Note... Im using http because Im assuming local host/0.0.0.0

If your writing a game that requires a rest API my sugestion is to 
host your game and then ship the bundler poiting to this url.

### How do I get set up? ###

* Summary of set up

* After setting up go.  Get the go get the following: 
(tested with `pkg install go` on FreeBSD 10.3, 11, and -CURRENT)
NOTE: Make sure GOPATH is set correctly:
export GOPATH=Full Path to GO Src Root

cd $GOPATH


* Not installing any libraries but here's an example
* of doing so with some cool ones:

* go get github.com/go-resty/resty   
* go install github.com/go-resty/resty 

* go get github.com/nsqio/go-nsq
* go install github.com/nsqio/go-nsq

* go get github.com/go-sql-driver/mysql
* go install github.com/go-sql-driver/mysql



* cd $GOPATH
* cd src 
* mkdir -r github.com/petesouth
* cd github.com/petesouth
* git clone git@github.com:petesouth/shygames-gamefeed.git shygamesgamefeed
* cd $GOPATH     So your at root again    
* export GOPATH=$GOPATH

* go install github.com/petesouth/shygamesgamefeed/3rdparty/gohttp/src/gohttp 
* cd $GOPATH/bin 

* Type ./gohttp   You'll see the output asking for the location of a json config file.  


* Configuration

None

* Dependencies

None right now. Pure golang net/http, flag, log

Commandline:

 	addr=localhost port=8000 directory=./

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###


* Repo owner or admin
* Other community or team contact

petesouth  erincodepirate


### To run Example:

gohttp -addr=192.168.0.227 -port=8080 -directory=.


