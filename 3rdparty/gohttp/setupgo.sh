#!/usr/bin/env bashpwd .



if [ $# -ne 1 ]; 
then 
    echo "illegal number of parameters.  this utility takes one parameter"
    echo "./setupgo.bash /rootpath/of/goinstall" 
    exit 0
fi


INSTALL_ROOT=$1
export INSTALL_ROOT

echo "======runing the go install.  Using $INSTALL_ROOT as the target directory"


#GOOS=freebsd
GOLANGVER=1.17.13
export GOLANGVER

GOOS=linux
export GOOS

CGO_ENABLED=0
export CGO_ENABLED

GOARCH=amd64
export GOARCH

GOROOT_BOOTSTRAP=$INSTALL_ROOT/go1.4
export GOROOT_BOOTSTRAP


GOSRC=$INSTALL_ROOT/gosrc
export GOSRC

GOROOT=$INSTALL_ROOT/gosrc/go
export GOROOT

GOPATH=$INSTALL_ROOT/go
export GOPATH

#Adding GO BIN to my path.
PATH=./:$PATH:$GOROOT/bin:$GOPATH/bin:$GOROOT_BOOTSTRAP/bin
export path

run_program=true
export run_program

if [ -d "$GOROOT_BOOTSTRAP" ]
then
	echo "Warning you must move or delete your current $GOROOT_BOOTSTRAP for this installation to continue"
	run_program=false
fi

if [ -d "$GOROOT" ]
then
     echo "Warning you must move or delete your current $GOROOT directory for this installation to continue"
     run_program=false
fi

if [ -d "$GOPATH" ]
then
     echo "Warning you must move or delete your current $GOPATH directory for this installation to continue"
     run_program=false
fi


function printEnv {
  echo "=================="
  echo "GOPATH=$GOPATH"
  echo "GORSRC=$GOSRC"
  echo "GOROOT=$GOROOT"
  echo "GOARCH=$GOARCH"
  echo "GOOS=$GOOS"

  echo "CGO_ENABLED=$CGO_ENABLED"
  echo "GOROOT_BOOTSTRAP=$GOROOT_BOOTSTRAP"
  echo "GOPATH=$GOPATH"
  echo "GOLANGVER=$GOLANGVER"
  echo "=================="
  
}

if [ "$run_program" = false ]
then
   echo exiting program.  Pleases make specified modifications.
   printEnv
   exit 1
fi

echo "creating scratch directory (If one is created already it'll be deleted and re-created)"

if [ -d "./scratch" ]
then
    echo "Directory ./scratch exists, going to remove it for recreation"
    rm -rf ./scratch
fi

mkdir ./scratch
cd scratch

echo "currecnt working directory is:"
pwd

echo "setting up go."

echo "******* PHASE 0 - Getting go1.4.3 as a bootstrap"



# FREEBSD - wget https://storage.googleapis.com/golang/go1.4.3.freebsd-amd64.tar.gz
#tar -xvf go1.4.3.freebsd-amd64.tar.gz
wget https://storage.googleapis.com/golang/go1.4.3.linux-amd64.tar.gz
tar -zxvf go1.4.3.linux-amd64.tar.gz

   
echo "UNTAR OF GOLANG 1.4.3 for boot strap \n moving go to GOROOT_BOOTSTRAP=$GOROOT_BOOTSTRAP"


echo "mv ./go GOROOT_BOOTSTRAP=$GOROOT_BOOTSTRAP"
mv ./go $GOROOT_BOOTSTRAP


echo "********************************************************"
echo "***> PHASE 1 Success: all the go directories I installed are in:" 
echo "********************************************************"
ls -all

find $INSTALL_ROOT -maxdepth 1 -name "go*"


echo "******* PHASE 1: Now I have go1.4 in place for bootstrapping building a branch of go1.17.1 for linux"

printEnv
pushd .
mkdir -p $GOSRC
cd $GOSRC

echo "******* PHASE 3: the git clone of latest go build into $GOROOT"
pwd


echo "Doing the clone from GOSRC=$GOSRC then building golang $GOLANGVER"

git clone https://go.googlesource.com/go go
ls -all
cd go
echo "*******This is NOW GOROOT GOSRC=$GOSRC/go diretory from above created from the git clone"
pwd
git checkout go$GOLANGVER
cd src
pwd
echo "*****************Runnnnnning====== ./all.bash"
./all.bash
echo "***********Runnnnnning====== ./all.bash"
./make.bash

popd

echo "******* PHASE 4 That should have build go version $GOLANVER"


if [ -d "$GOPATH" ]
then
     echo "Your $GOPATH exists.. using it.  If you want a fresh $GOPATH move the old one out of the way"
else
    echo "NO $GOPATH exists creating one"
    mkdir $GOPATH
fi


echo "******* PHASE 5 - Gettingthe varius tools like GDM and gocode"
pushd .
cd $GOPATH
pwd

hash on
GOPATH=$GOPATH GOROOT=$GOROOT GOOS=$GOOS GOARCH=$GOARCH go get github.com/sparrc/gdm
GOPATH=$GOPATH GOROOT=$GOROOT GOOS=$GOOS GOARCH=$GOARCH go install github.com/sparrc/gdm

GOPATH=$GOPATH GOROOT=$GOROOT GOOS=$GOOS GOARCH=$GOARCH go get github.com/nsf/gocode
GOPATH=$GOPATH GOROOT=$GOROOT GOOS=$GOOS GOARCH=$GOARCH go install github.com/nsf/gocode
export GOPATH
hash off

popd

printEnv
pwd
ls -all

echo "********* SUCCESS GO IS INSTALLED ********"
echo "For more information see: https://golang.org/doc/install/source"
echo "The environment is as follows:"
echo "******************************************"

echo MAKE SURE YOUR .CSHRC, .BASHRC, .SHRC etc.. are updated for these environment variables. ENJOY !!!


echo "PATH=$PATH"
  

printEnv
pwd
ls -all


