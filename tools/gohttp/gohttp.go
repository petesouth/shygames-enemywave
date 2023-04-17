package main

import (
    "flag"
    "log"
    "time"
   // "strconv"
    "net/http"
    "github.com/zserge/lorca"
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


func runAppWindow() {
    ui, err := lorca.New("", "", 800, 600)
	if err != nil {
		log.Fatal(err)
	}
	defer ui.Close()

	// Load your local HTML file or navigate to a URL
	//absPath, _ := filepath.Abs("/tank-survivor/build/index.html")
	//ui.Load(url.PathEscape("file://" + absPath))
	// Or navigate to a URL:
	 ui.Load("http://localhost:8080/tank-survivor/build/index.html")

	// Wait for the UI window to be closed by the user
	<-ui.Done()
}

func main() {
    // Define command line flags for address and port
    addr := flag.String("addr", "", "Address to listen on")
    port := flag.String("port", "8000", "Port to listen on")
    directory := flag.String("directory", ".", "Root directory")
    //websubpath := flag.String("websubpath", ".", "Sub path to the application start page")
    // widthstr := flag.String("width", ".", "Window width")
    // heightstr := flag.String("height", ".", "Window height")
    
    // width, err := strconv.ParseInt(widthstr, 10, 64)
    // if err != nil {
    //     log.Fatal("ParseInt width: ", err)
    //     return 
    // }

    // height, err := strconv.ParseInt(heightstr, 10, 64)
    // if err != nil {
    //     log.Fatal("ParseInt height: ", err)
    //     return 
    // }


    go startServer( *addr, *port, *directory)
    time.Sleep(5000);

    
    runAppWindow();
   
}
