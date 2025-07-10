package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	amaasclient "github.com/trendmicro/tm-v1-fs-golang-sdk"
)

const (
	uploadFolder = "./uploads"
	maxUploadSize = 10 << 20 // 10 MB
)

func main() {
	// Ensure upload directory exists
	if err := os.MkdirAll(uploadFolder, os.ModePerm); err != nil {
		log.Fatalf("Failed to create upload directory: %v", err)
	}

	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/upload", uploadHandler)

	log.Println("Starting server on :5000")
	log.Fatal(http.ListenAndServe(":5000", nil))
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/login", http.StatusSeeOther)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		fmt.Fprintln(w, "Login Page")
	case http.MethodPost:
		http.Redirect(w, r, "/upload", http.StatusSeeOther)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS for testing
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight requests
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		fmt.Fprintln(w, "Upload Page")
		return
	case http.MethodPost:
		// Log request details
		log.Printf("Received upload request. Content-Type: %s", r.Header.Get("Content-Type"))

		// Parse multipart form
		r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)
		if err := r.ParseMultipartForm(maxUploadSize); err != nil {
			log.Printf("Form parse error: %v", err)
			http.Error(w, fmt.Sprintf("Cannot parse form: %v", err), http.StatusBadRequest)
			return
		}

		// Get the file
		file, handler, err := r.FormFile("file")
		if err != nil {
			log.Printf("File retrieval error: %v", err)
			http.Error(w, fmt.Sprintf("Error retrieving file: %v", err), http.StatusBadRequest)
			return
		}
		defer file.Close()

		// Check filename
		if handler.Filename == "" {
			log.Println("No selected file")
			http.Error(w, "No selected file", http.StatusBadRequest)
			return
		}

		// Log file details
		log.Printf("Uploaded file: %s, Size: %d bytes", handler.Filename, handler.Size)

		// Save file
		filename := filepath.Base(handler.Filename)
		filePath := filepath.Join(uploadFolder, filename)
		
		dst, err := os.Create(filePath)
		if err != nil {
			log.Printf("File creation error: %v", err)
			http.Error(w, fmt.Sprintf("Cannot create file: %v", err), http.StatusInternalServerError)
			return
		}
		defer dst.Close()
		defer os.Remove(filePath)

		// Copy file
		bytesWritten, err := io.Copy(dst, file)
		if err != nil {
			log.Printf("File write error: %v", err)
			http.Error(w, fmt.Sprintf("Cannot write file: %v", err), http.StatusInternalServerError)
			return
		}

		log.Printf("File saved: %s, Bytes written: %d", filePath, bytesWritten)

		// Scan file
		scanResult, err := scanUploadedFile(filePath)
		if err != nil {
			log.Printf("Scan error: %v", err)
			http.Error(w, fmt.Sprintf("Scan failed: %v", err), http.StatusInternalServerError)
			return
		}

		// Render results
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(scanResult))

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func scanUploadedFile(filePath string) (string, error) {
	// Get API key and region from environment
	apiKey := os.Getenv("API_KEY")
	region := os.Getenv("REGION")

	start := time.Now()

	// Initialize client
	c, err := amaasclient.NewClient(apiKey, region)
	if err != nil {
		log.Printf("Failed to create client: %v", err)
		return "", err
	}
	defer c.Destroy()

	// Scan file
	tags := []string{"upload"}
	result, err := c.ScanFile(filePath, tags)
	if err != nil {
		log.Printf("Scan failed: %v", err)
		return "", err
	}

	elapsed := time.Since(start)
	log.Printf("Scanning completed in %.2f seconds.", elapsed.Seconds())
	log.Printf("Scanning complete: %s", result)

	// Parse result to check scan status
	var resultMap map[string]interface{}
	if err := json.Unmarshal([]byte(result), &resultMap); err != nil {
		log.Printf("Failed to parse scan result: %v", err)
		return "", err
	}

	// Mimic Python version's result handling
	scanResultCode := 0
	if val, ok := resultMap["scanResult"].(float64); ok && val == 1 {
		scanResultCode = 1
		log.Println("File is malicious")
	}

	// Prepare response similar to Python version
	response := map[string]interface{}{
		"scan_result_code": scanResultCode,
		"scan_results":     resultMap,
	}

	responseJSON, _ := json.Marshal(response)
	return string(responseJSON), nil
}