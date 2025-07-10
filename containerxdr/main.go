// go get github.com/creack/pty
package main

import (
	"log"
	"net/http"
	"os/exec"
	"time"

	"github.com/creack/pty"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Only allow connections from UI frontend
		origin := r.Header.Get("Origin")
		return origin == "http://ui-service" || origin == ""
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
