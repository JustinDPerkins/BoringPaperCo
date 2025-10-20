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
		
		// Define allowed origins (matching aichat's secure pattern)
		allowedOrigins := []string{
			// Internal service communication
			"http://ui-service",
			"https://ui-service", 
			"http://ollama-service",
			"https://ollama-service",
			// AWS ELB patterns
			"http://*.elb.amazonaws.com",
			"https://*.elb.amazonaws.com",
			// Azure patterns
			"http://*.cloudapp.azure.com",
			"https://*.cloudapp.azure.com",
			// GCP patterns  
			"http://*.run.app",
			"https://*.run.app",
					// Development - allow localhost with any port
			"http://localhost",
			"https://localhost",
			"http://localhost:*",
			"https://localhost:*",

			"http://boringpapercompany.com",
			"https://boringpapercompany.com",
			"https://*.boringpapercompany.com",
			"http://*.boringpapercompany.com",
		}
		
		// Check exact matches first
		for _, allowed := range allowedOrigins {
			if allowed == origin {
				return true
			}
		}
		
		// Check wildcard patterns (for cloud load balancers and localhost)
		for _, allowed := range allowedOrigins {
			if strings.Contains(allowed, "*") {
				// Handle localhost:* pattern
				if strings.Contains(allowed, "localhost:*") {
					if strings.HasPrefix(origin, "http://localhost:") || strings.HasPrefix(origin, "https://localhost:") {
						return true
					}
					continue
				}
				
				// Extract the domain part after the wildcard
				// "http://*.cloudapp.azure.com" → ".cloudapp.azure.com"
				parts := strings.Split(allowed, "*")
				if len(parts) == 2 && strings.Contains(origin, parts[1]) {
					// Also check the protocol matches
					if strings.HasPrefix(origin, parts[0]) {
						return true
					}
				}
			}
		}
		
		// Check for configured allowed origins from environment
		if envOrigins := os.Getenv("ALLOWED_ORIGINS"); envOrigins != "" {
			for _, allowed := range strings.Split(envOrigins, ",") {
				if strings.TrimSpace(allowed) == origin {
					return true
				}
			}
		}
		
		// Allow development IPs and localhost with common ports
		if strings.Contains(origin, "127.0.0.1") ||
		   strings.Contains(origin, "192.168.") ||
		   strings.Contains(origin, "10.0.") {
			return true
		}
		
		// Allow localhost with any port for development
		if strings.HasPrefix(origin, "http://localhost:") || strings.HasPrefix(origin, "https://localhost:") {
			return true
		}
		
		// Allow specific load balancer IP from environment (for GCP/direct IP access)
		if loadBalancerIP := os.Getenv("LOAD_BALANCER_IP"); loadBalancerIP != "" {
			if origin == "http://"+loadBalancerIP || origin == "https://"+loadBalancerIP {
				return true
			}
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