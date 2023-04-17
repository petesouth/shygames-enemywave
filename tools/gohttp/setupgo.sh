#!/usr/bin/env bashpwd .



if [ $# -ne 1 ]; 
then 
    echo "illegal number of parameters.  this utility takes one parameter"
    echo "./setupgo.bash /rootpath/of/goinstall" 
    exit 0
fi


function setupEnvironment {
    # This is the root of where this installation of GO
    # will be compiled and set to run from
    # you can think of this as like python environments.
    # This way allows me to run whatever version of go i need
    # and to isolate them if need be per project
    # everything this file does ends up in this directory as the parent.
    INSTALL_ROOT=$1
    export INSTALL_ROOT

    echo "======runing the go install.  Using $INSTALL_ROOT as the target directory"

    #THE VERSION OF GO LANG THAT WERE GOING TO COMPILE
    #AND SETUP.
    GOLANGVER=1.17.13
    export GOLANGVER

    # Operating system.
    # This works on Freebsd as well
    #GOOS=freebsd
    GOOS=linux
    export GOOS

    #1 allows for C/C++ code to be called from golang
    CGO_ENABLED=0
    export CGO_ENABLED

    #Type of Binary distributables.  X86 and so forth.
    GOARCH=amd64
    export GOARCH

    # GO uses go1.4 to compile whatever latest 
    # version before the latest is installed.
    # This version of go creates the latest
    # version of go.  Confusing but how it works.
    # this directory is the compile lib that building
    # a version of go needs for the build tools it uses 
    # according to (GOLANGVER)
    GOROOT_BOOTSTRAP=$INSTALL_ROOT/go1.4
    export GOROOT_BOOTSTRAP

    # DIRECTORY THAT HOLDS THE LATEST GO TO BE BUILT
    # AND INSTALLED ACCORDING TO GOLANGVER.
    # a sub directory will be created called go from 
    # git clonning the latest golang build
    GOSRC=$INSTALL_ROOT/gosrc
    export GOSRC

    #The checked out version of go that is to be setup compiled
    # and installed.
    GOROOT=$GOSRC/go
    export GOROOT

    # Once I use the go 1.4 to compile the latest go in GOSRC and GOROOT
    # I copy the resulting GO executables to this directory
    # which is where they run from when I run my env.sh (see ./env.sh.template)
    GOPATH=$INSTALL_ROOT/go
    export GOPATH
    
    #Adding GO BIN to my path.
    PATH=./:$PATH:$GOROOT/bin:$GOPATH/bin:$GOROOT_BOOTSTRAP/bin
    export path

}

function generateBuildDirectories {
    # Needed
    mkdir -p $GOSRC
    mkdir -p $GOPATH
}

#Use this to tell me message outputs 
#and inform me of where everything is configured 
#to go.
function printEnv {
local message="$1"

  
  echo "=================="
  echo "message=$message"
  echo "INSTALL_ROOT=$INSTALL_ROOT"

  echo "GOPATH=$GOPATH"
  echo "GOSRC=$GOSRC"
  echo "GOROOT=$GOROOT"
  echo "GOARCH=$GOARCH"
  echo "GOOS=$GOOS"

  echo "CGO_ENABLED=$CGO_ENABLED"
  echo "GOROOT_BOOTSTRAP=$GOROOT_BOOTSTRAP"
  echo "GOPATH=$GOPATH"
  echo "GOLANGVER=$GOLANGVER"
  echo "=================="
  
}



# ===== INPUT VALIDATION ====
# Making sure I have the right parameters
# before I kick it all off.

function validate {

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


    if [ "$run_program" = false ]
    then
        echo exiting program.  Pleases make specified modifications.
        printEnv "exit run_program was false"
        exit 1
    fi

    if [ -d "$GOPATH" ]
    then
        echo "Your $GOPATH exists.. using it.  If you want a fresh $GOPATH move the old one out of the way"
    else
        echo "NO $GOPATH exists creating one"
        mkdir $GOPATH
    fi

}



function setupGoBootStrapGoTools {
    echo "setupGoBootStrap - Executing setting up go."
    
    # FREEBSD - wget https://storage.googleapis.com/golang/go1.4.3.freebsd-amd64.tar.gz
    #tar -xvf go1.4.3.freebsd-amd64.tar.gz
    wget https://storage.googleapis.com/golang/go1.4.3.linux-amd64.tar.gz
    tar -zxvf go1.4.3.linux-amd64.tar.gz
 
    echo "UNTAR OF GOLANG 1.4.3 for boot strap \n moving go to GOROOT_BOOTSTRAP=$GOROOT_BOOTSTRAP"

    echo "mv ./go GOROOT_BOOTSTRAP=$GOROOT_BOOTSTRAP"
    mv ./go $GOROOT_BOOTSTRAP
    rm go1.4.3.linux-amd64.tar.gz
}

function compileLatestVersionOfGoLang {
    echo "Doing the clone from GOSRC=$GOSRC into GOROOT=$GO then building golang $GOLANGVER"
    cd $GOSRC
    git clone https://go.googlesource.com/go go
    cd go
    git checkout go$GOLANGVER

    cd src
    pwd
    echo "*****************Runnnnnning====== ./all.bash"
    ./all.bash
    echo "***********Runnnnnning====== ./make.bash"
    ./make.bash

    echo "****back to INSTALL_ROOT=$INSTALL_ROOT***"
    cd $INSTALL_ROOT
    pwd 
    
}

function installGoLangToolsToGoPath {
    echo begin ===== installGoLangToolsToGoPath ===

    pushd .
    cd $GOPATH
    pwd

    echo "running go get and install for github.com/sparrc/gdm@latest"
    GOPATH=$GOPATH GOROOT=$GOROOT GOOS=$GOOS GOARCH=$GOARCH go get github.com/sparrc/gdm@latest
    GOPATH=$GOPATH GOROOT=$GOROOT GOOS=$GOOS GOARCH=$GOARCH go install github.com/sparrc/gdm@latest

    echo "running go get and install for github.com/sparrc/gocode@latest"
    GOPATH=$GOPATH GOROOT=$GOROOT GOOS=$GOOS GOARCH=$GOARCH go get github.com/nsf/gocode@latest
    GOPATH=$GOPATH GOROOT=$GOROOT GOOS=$GOOS GOARCH=$GOARCH go install github.com/nsf/gocode@latest
    export GOPATH
    
    echo finished === installGoLangToolsToGoPath ===
    popd

}

setupEnvironment $1

printEnv "**** Phase 1 -----  VALIDATION -----"
validate


printEnv "**** Phase 2 -----  Creation Of Go 1.4.7 boot strap build tools -----"
setupGoBootStrapGoTools
generateBuildDirectories

printEnv "******* PHASE 3: Begin Now I have go1.4 in place for bootstrapping building a branch of go1.17.1 for linux"
compileLatestVersionOfGoLang
printEnv "******* PHASE 3 Finished go lang build version $GOLANVER"


printEnv "******* PHASE 4 - BEGIN Getting the varius tools like GDM and gocode"
installGoLangToolsToGoPath
printEnv echo "********* Phase 4 FINISHED SUCCESS ----- GO SHOULD BE/IS INSTALLED ********" \
"\n\nFor more information see: https://golang.org/doc/install/source" \
"\nThe environment is as follows:" \
"\n******************************************" \
"\nMAKE SURE YOUR .CSHRC, .BASHRC, .SHRC etc.. are updated for these environment variables." \
"\nENJOY !!!"

echo "PATH=$PATH"
  
pwd
ls -all


