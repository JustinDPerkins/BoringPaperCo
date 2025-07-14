// go get github.com/creack/pty
package main

import (
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/creack/pty"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		
		// Always allow empty origin (direct connections)
		if origin == "" {
			return true
		}
		
		// Allow internal service connections
		if origin == "http://ui-service" || origin == "https://ui-service" {
			return true
		}
		
		// Check for configured allowed origins from environment
		allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
		if allowedOrigins != "" {
			for _, allowed := range strings.Split(allowedOrigins, ",") {
				if strings.TrimSpace(allowed) == origin {
					return true
				}
			}
		}
		
		// For development/testing: allow localhost and load balancers
		if strings.Contains(origin, "localhost") || 
		   strings.Contains(origin, "127.0.0.1") ||
		   strings.Contains(origin, "192.168.") ||
		   strings.Contains(origin, "10.0.") ||
		   strings.Contains(origin, ".elb.amazonaws.com") ||
		   strings.Contains(origin, ".cloudapp.azure.com") ||
		   strings.Contains(origin, ".run.app") ||
		   strings.Contains(origin, "20.242.248.123") {
			return true
		}
		
		log.Printf("WebSocket origin rejected: %s", origin)
		return false
	},
}

func terminalWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade:", err)
		return
	}
	defer conn.Close()

	// 1. Launch a login shell inside a PTY
	cmd := exec.Command("bash", "-l") // or "sh" on alpine
	ptyFile, err := pty.Start(cmd)
	if err != nil {
		log.Println("pty start:", err)
		return
	}
	defer func() { _ = ptyFile.Close() }()

	// 2. Copy PTY → WS
	go func() {
		buf := make([]byte, 1024)
		for {
			n, err := ptyFile.Read(buf)
			if n > 0 {
				_ = conn.WriteMessage(websocket.BinaryMessage, buf[:n])
			}
			if err != nil {
				return
			}
		}
	}()

	// 3. Copy WS → PTY
	for {
		_, data, err := conn.ReadMessage()
		if err != nil {
			break
		}
		_, _ = ptyFile.Write(data)
	}

	// 4. Give the shell a moment then clean up
	time.Sleep(200 * time.Millisecond)
	_ = cmd.Process.Kill()
}

func main() {
	http.HandleFunc("/terminal", terminalWS)
	log.Println("WS PTY ready on :8081/terminal")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
