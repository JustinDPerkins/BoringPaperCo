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

type ChatRequest struct {
	Message         string `json:"message"`
	SecurityEnabled *bool  `json:"securityEnabled,omitempty"`
}

type AIGuardConfig struct {
	APIKey string
	Base   string
}

// OllamaRequest includes Stream:true
type OllamaRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"`
}

type OllamaResponse struct {
	Response string `json:"response"`
	Done     bool   `json:"done"`
}

func initAIGuard() *AIGuardConfig {
	apiKey := os.Getenv("API_KEY")
	if apiKey == "" {
		fmt.Fprintln(os.Stderr, "Warning: API_KEY not set; guard checks will be skipped")
	}
	return &AIGuardConfig{
		APIKey: apiKey,
		Base:   "https://api.xdr.trendmicro.com/beta/aiSecurity",
	}
}

// getModelName returns the model to use, with fallback to smaller models
func getModelName() string {
	// Check for environment variable first
	if model := os.Getenv("OLLAMA_MODEL"); model != "" {
		return model
	}

	// Default to a smaller, efficient model
	// Options in order of preference (smallest to largest):
	// - tinyllama:1.1b-chat: ~1.1GB, fast, good for chat
	// - phi:2.7b: ~1.7GB, good balance
	// - phi:latest: ~2.7GB, original choice
	return "tinyllama:1.1b-chat"
}

// checkAIGuard POSTs to TrendVisionOne, logs and returns true if action=="Block"
func checkAIGuard(label, content string, cfg *AIGuardConfig) (bool, error) {
	fmt.Printf("[VisionOne] checking %s: %q\n", label, content)
	if cfg.APIKey == "" {
		fmt.Println("[VisionOne] no API key; skipping guard")
		return false, nil
	}

	url := cfg.Base + "/guard?detailedResponse=false"
	payload, _ := json.Marshal(map[string]string{"guard": content})
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	if err != nil {
		return false, err
	}
	req.Header.Set("Authorization", "Bearer "+cfg.APIKey)
	req.Header.Set("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return false, err
	}
	defer res.Body.Close()

	fmt.Printf("[VisionOne] HTTP %d %s\n", res.StatusCode, res.Status)
	body, _ := io.ReadAll(res.Body)
	fmt.Printf("[VisionOne] raw body: %s\n", body)

	var gr struct {
		Action string `json:"action"`
		Reason string `json:"reason"`
	}
	if err := json.Unmarshal(body, &gr); err != nil {
		return false, err
	}
	fmt.Printf("[VisionOne] action: %s; reason: %s\n", gr.Action, gr.Reason)

	return strings.EqualFold(gr.Action, "Block"), nil
}

func pullModel() error {
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}
	pullURL := ollamaURL + "/api/pull"

	modelName := getModelName()
	fmt.Printf("[Ollama] Pulling model: %s\n", modelName)

	reqBody, _ := json.Marshal(map[string]string{"name": modelName})
	res, err := http.Post(pullURL, "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return err
	}
	defer res.Body.Close()
	io.Copy(os.Stdout, res.Body)
	return nil
}

func handleHealth(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "healthy", "service": "aichat"})
}

func handleChat(c echo.Context, guardCfg *AIGuardConfig) error {
	var req ChatRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"response": "Invalid request"})
	}

	// Check if security is enabled (default to true if not specified)
	securityEnabled := true
	if req.SecurityEnabled != nil {
		securityEnabled = *req.SecurityEnabled
	}

	// 1) Guard the **prompt** only (if security is enabled)
	if securityEnabled {
		if blocked, err := checkAIGuard("prompt", req.Message, guardCfg); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"response": "Error checking policy"})
		} else if blocked {
			return c.JSON(http.StatusForbidden, map[string]string{"response": "Blocked: Trend Vision One"})
		}
	}

	// 2) Call Ollama with streaming enabled
	ollamaURL := os.Getenv("OLLAMA_URL")
	if ollamaURL == "" {
		ollamaURL = "http://localhost:11434"
	}
	genURL := ollamaURL + "/api/generate"

	modelName := getModelName()
	ollReq := OllamaRequest{
		Model:  modelName,
		Prompt: fmt.Sprintf("You are a helpful assistant for the Boring Paper Company. %s", req.Message),
		Stream: true,
	}
	reqBody, _ := json.Marshal(ollReq)
	res, err := http.Post(genURL, "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"response": "Failed to call LLM"})
	}
	defer res.Body.Close()

	// 3) Assemble streamed chunks
	var replyBuilder strings.Builder
	scanner := bufio.NewScanner(res.Body)
	for scanner.Scan() {
		var chunk OllamaResponse
		if err := json.Unmarshal(scanner.Bytes(), &chunk); err != nil {
			continue
		}
		replyBuilder.WriteString(chunk.Response)
		if chunk.Done {
			break
		}
	}
	if err := scanner.Err(); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"response": "Error reading LLM response"})
	}

	// 4) Guard the **response** as well (if security is enabled)
	response := replyBuilder.String()
	if securityEnabled {
		if blocked, err := checkAIGuard("response", response, guardCfg); err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"response": "Error checking policy"})
		} else if blocked {
			return c.JSON(http.StatusForbidden, map[string]string{"response": "Blocked: Trend Vision One"})
		}
	}

	// 5) Return the allowed reply
	return c.JSON(http.StatusOK, map[string]string{"response": response})
}

func main() {
	guardCfg := initAIGuard()
	if err := pullModel(); err != nil {
		fmt.Fprintf(os.Stderr, "pullModel error: %v\n", err)
	}

	e := echo.New()
	e.Use(middleware.Logger(), middleware.Recover(), middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://ui-service", "http://ollama-service", "http://localhost", "https://localhost"},
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodOptions},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: false,
		MaxAge:           86400,
	}))

	e.GET("/health", handleHealth)
	e.POST("/chat", func(c echo.Context) error {
		return handleChat(c, guardCfg)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "5001"
	}
	e.Logger.Fatal(e.Start(":" + port))
}