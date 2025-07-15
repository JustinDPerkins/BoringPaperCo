package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type OllamaRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
}

type OllamaResponse struct {
	Response string `json:"response"`
	Done     bool   `json:"done"`
}

type ChatRequest struct {
	Message string `json:"message"`
}

func pullModel() error {
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}
	pullURL := ollamaURL + "/api/pull"

	// Prepare pull request
	pullReq := map[string]string{
		"name": "phi:latest",
	}
	jsonReq, err := json.Marshal(pullReq)
	if err != nil {
		return fmt.Errorf("failed to prepare pull request: %v", err)
	}

	// Send pull request
	resp, err := http.Post(pullURL, "application/json", bytes.NewBuffer(jsonReq))
	if err != nil {
		return fmt.Errorf("failed to send pull request: %v", err)
	}
	defer resp.Body.Close()

	// Read response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read pull response: %v", err)
	}

	// Log pull response
	fmt.Printf("Model Pull Response: %s\n", string(body))

	return nil
}

func main() {
	// Pull model before starting server
	if err := pullModel(); err != nil {
		fmt.Printf("Model pull error: %v\n", err)
		// Continue even if pull fails
	}

	// Create Echo instance
	e := echo.New()

	// Build allowed origins dynamically
	allowedOrigins := []string{
		"http://ui-service", 
		"http://ollama-service",
		// AWS ELB patterns
		"http://*.elb.amazonaws.com",
		"https://*.elb.amazonaws.com",
		// Azure patterns
		"http://*.cloudapp.azure.com",
		"https://*.cloudapp.azure.com",
		// GCP patterns  
		"http://*.run.app",
		"https://*.run.app",
		// Development
		"http://localhost",
		"https://localhost",
	}
	
	// Add specific load balancer IP for GCP
	if loadBalancerIP := os.Getenv("LOAD_BALANCER_IP"); loadBalancerIP != "" {
		allowedOrigins = append(allowedOrigins, "http://"+loadBalancerIP, "https://"+loadBalancerIP)
	}

	// CORS Middleware - allow multiple cloud platforms
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: allowedOrigins, // Allow UI frontend, ollama service, and cloud load balancers
		AllowMethods: []string{
			http.MethodGet, 
			http.MethodPost, 
			http.MethodOptions,
		},
		AllowHeaders: []string{
			echo.HeaderOrigin,
			echo.HeaderContentType,
			echo.HeaderAccept,
			echo.HeaderAuthorization,
			"X-Requested-With",
		},
		AllowCredentials: false, // Set to false when using wildcard origins
		MaxAge: 86400,
	}))

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// Routes
	e.GET("/health", handleHealth)
	e.POST("/chat", handleChat)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "5001"
	}
	e.Logger.Fatal(e.Start(":" + port))
}

func handleHealth(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"status":  "healthy",
		"service": "aichat",
	})
}

func handleChat(c echo.Context) error {
	// Parse request
	var chatReq ChatRequest
	if err := c.Bind(&chatReq); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	// Ollama URL from environment
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}
	ollamaURL += "/api/generate"

	// Prepare Ollama request
	ollamaReq := OllamaRequest{
		Model:  "phi:latest", // Small, fast model
		Prompt: fmt.Sprintf("You are a helpful assistant for the Boring Paper Company. Respond to the following message: %s", chatReq.Message),
	}

	// Convert request to JSON
	jsonReq, err := json.Marshal(ollamaReq)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to prepare request"})
	}

	// Send request to Ollama
	resp, err := http.Post(ollamaURL, "application/json", bytes.NewBuffer(jsonReq))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to send request to Ollama"})
	}
	defer resp.Body.Close()

	// Read and combine response
	var fullResponse strings.Builder
	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		var ollamaResp OllamaResponse
		line := scanner.Text()
		if err := json.Unmarshal([]byte(line), &ollamaResp); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{
				"error":       "Failed to parse Ollama response",
				"raw_response": line,
			})
		}
		
		// Append response parts
		fullResponse.WriteString(ollamaResp.Response)

		// Stop if done
		if ollamaResp.Done {
			break
		}
	}

	if err := scanner.Err(); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Error reading Ollama response"})
	}

	// Return the full response
	return c.JSON(http.StatusOK, map[string]string{
		"response": fullResponse.String(),
	})
} 