package main

import (
    "flag"
    "log"
    "net/http"
)

func main() {
    // Define command line flags for address and port
    addr := flag.String("addr", "", "Address to listen on")
    port := flag.String("port", "8000", "Port to listen on")
    directory := flag.String("directory", ".", "Root directory")
    flag.Parse()

    // Serve files from current directory
    fs := http.FileServer(http.Dir(*directory))

    // Register handler for requests to "/"
    http.Handle("/", fs)

    // Start the server
    log.Printf("listening on %s:%s...", *addr, *port)
    err := http.ListenAndServe(*addr+":"+*port, nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}
