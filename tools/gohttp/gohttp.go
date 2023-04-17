package main

import (
    "flag"
    "log"
    "time"
    "net/http"
    "github.com/zserge/webview"
)

func startServer( addr:string, port: string, directory: string) {
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


func runAppWindow(websubpath:string) {
    w := webview.New(true)
	defer w.Destroy()

	// Set the window title and size
	w.SetTitle("My Webview Window")
	w.SetSize(800, 600, webview.HintNone)

	// Load a webpage
	w.Navigate(websubpath);

	// Run the event loop and display the window
	w.Run()
}

func main() {
    // Define command line flags for address and port
    addr := flag.String("addr", "", "Address to listen on")
    port := flag.String("port", "8000", "Port to listen on")
    directory := flag.String("directory", ".", "Root directory")
    websubpath := flag.String("websubpath", ".", "Sub path to the application start page")
    

    go startServer( addr, port, directory)
    time.Sleep(5000);

    runAppWindow(websubpath);
   
}
