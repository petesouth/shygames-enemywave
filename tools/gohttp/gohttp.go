package main

import (
    "fmt"
    "time"
    "flag"
    "log"
    "os/exec"
    "net/http"
)

func startServer( addr string, port string, directory string) {
    flag.Parse()

    // Serve files from current directory
    fs := http.FileServer(http.Dir(directory))

    // Register handler for requests to "/"
    http.Handle("/", fs)

    // Start the server
    log.Printf("listening on %s:%s...", addr, port)
    err := http.ListenAndServe(addr+":"+port, nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}

func main() {
    // Define command line flags for address and port
    addr := flag.String("addr", "127.0.0.1", "Address to listen on")
    port := flag.String("port", "3636", "Port to listen on")
    directory := flag.String("directory", ".", "Root directory")
    flag.Parse();


    go func () {
        time.Sleep(15000)
        app := "./shyhumangamesrunner.exe"
        arg0 := "http://" + (*addr) + ":" + (*port) + "/index.html"
        fmt.Println("Executing: App %s %s", app, arg0 )
        cmd := exec.Command(app, arg0)
        stdout, err := cmd.Output()

        if err != nil {
            fmt.Println(err.Error())
            return
        }

        // Print the output
        fmt.Println(string(stdout))

    }()
    
    startServer( *addr, *port, *directory)

}
