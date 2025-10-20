package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	amaasclient "github.com/trendmicro/tm-v1-fs-golang-sdk"
)

const (
	uploadFolder = "./uploads"
	maxUploadSize = 10 << 20 // 10 MB
)

// setCORSHeaders sets appropriate CORS headers for multi-cloud support
func setCORSHeaders(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	
	// Define allowed origins
	allowedOrigins := []string{
		"http://ui-service",
		"https://ui-service",
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

		"http://boringpapercompany.com",
		"https://boringpapercompany.com",
		"http://gcp.boringpapercompany.com",
		"https://gcp.boringpapercompany.com",
		"http://azure.boringpapercompany.com",
		"https://azure.boringpapercompany.com",
	}
	
	// Add specific load balancer IP for GCP
	if loadBalancerIP := os.Getenv("LOAD_BALANCER_IP"); loadBalancerIP != "" {
		allowedOrigins = append(allowedOrigins, "http://"+loadBalancerIP, "https://"+loadBalancerIP)
	}
	
	// Check if origin is allowed
	allowed := false
	for _, allowedOrigin := range allowedOrigins {
		if origin == allowedOrigin {
			allowed = true
			break
		}
	}
	
	if allowed {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	} else {
		w.Header().Set("Access-Control-Allow-Origin", "http://ui-service") // Default fallback
	}
}

func main() {
	// Ensure upload directory exists
	if err := os.MkdirAll(uploadFolder, os.ModePerm); err != nil {
		log.Fatalf("Failed to create upload directory: %v", err)
	}

	http.HandleFunc("/", rootHandler)
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/upload", uploadHandler)           // Protected upload with scanning
	http.HandleFunc("/upload-vulnerable", vulnerableUploadHandler) // Vulnerable upload without scanning

	log.Println("Starting server on :5000")
	log.Fatal(http.ListenAndServe(":5000", nil))
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/upload", http.StatusSeeOther)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for health endpoint
	setCORSHeaders(w, r)
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintln(w, `{"status":"healthy","service":"sdk"}`)
}



func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for multi-cloud support
	setCORSHeaders(w, r)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With")
	w.Header().Set("Access-Control-Expose-Headers", "Content-Length")
	w.Header().Set("Access-Control-Max-Age", "86400")

	// Handle preflight requests
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		fmt.Fprintln(w, "Protected Upload Page - Files will be scanned")
		return
	case http.MethodPost:
		// Log request details
		log.Printf("Received PROTECTED upload request. Content-Type: %s", r.Header.Get("Content-Type"))

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

		// Scan file (ALWAYS scan in protected endpoint)
		scanResult, err := scanUploadedFile(filePath, handler.Size)
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

func vulnerableUploadHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for multi-cloud support
	setCORSHeaders(w, r)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With")
	w.Header().Set("Access-Control-Expose-Headers", "Content-Length")
	w.Header().Set("Access-Control-Max-Age", "86400")

	// Handle preflight requests
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		fmt.Fprintln(w, "VULNERABLE Upload Page - Files will NOT be scanned")
		return
	case http.MethodPost:
		// Log request details
		log.Printf("Received VULNERABLE upload request. Content-Type: %s", r.Header.Get("Content-Type"))

		// SECURITY ISSUE: No file size limits
		// SECURITY ISSUE: No file type validation
		// SECURITY ISSUE: No malware scanning
		
		// Parse multipart form (no size limit!)
		if err := r.ParseMultipartForm(100 << 20); err != nil { // 100MB limit
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

		// SECURITY ISSUE: No filename validation - allows path traversal
		if handler.Filename == "" {
			log.Println("No selected file")
			http.Error(w, "No selected file", http.StatusBadRequest)
			return
		}

		// Log file details
		log.Printf("VULNERABLE upload: %s, Size: %d bytes", handler.Filename, handler.Size)

		// SECURITY ISSUE: No filename sanitization - allows path traversal attacks
		filename := handler.Filename // Use original filename without sanitization!
		filePath := filepath.Join(uploadFolder, filename)
		
		// SECURITY ISSUE: No directory traversal protection
		dst, err := os.Create(filePath)
		if err != nil {
			log.Printf("File creation error: %v", err)
			http.Error(w, fmt.Sprintf("Cannot create file: %v", err), http.StatusInternalServerError)
			return
		}
		defer dst.Close()
		// SECURITY ISSUE: File is NOT deleted after processing - persists on disk!

		// Copy file
		bytesWritten, err := io.Copy(dst, file)
		if err != nil {
			log.Printf("File write error: %v", err)
			http.Error(w, fmt.Sprintf("Cannot write file: %v", err), http.StatusInternalServerError)
			return
		}

		log.Printf("VULNERABLE file saved: %s, Bytes written: %d", filePath, bytesWritten)

		// SECURITY ISSUE: NO SCANNING - File is uploaded without any security checks
		response := map[string]interface{}{
			"scan_result_code": -4, // -4 indicates vulnerable upload (no scanning)
			"scan_results": map[string]interface{}{
				"status": "vulnerable",
				"reason": "Vulnerable endpoint - no scanning performed",
				"message": "File uploaded successfully but NO security scanning was performed",
				"file_path": filePath,
				"file_size": bytesWritten,
			},
		}
		responseJSON, _ := json.Marshal(response)
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(responseJSON))

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func scanUploadedFile(filePath string, fileSize int64) (string, error) {
	// Get API key and region from environment
	apiKey := os.Getenv("API_KEY")
	region := os.Getenv("REGION")

	// Log API configuration (without exposing the key)
	log.Printf("API configuration - Region: %s, Key length: %d", region, len(apiKey))

	// Check if API key is available
	if apiKey == "" {
		log.Println("Warning: API_KEY not set; file scanning will be skipped")
		response := map[string]interface{}{
			"scan_result_code": -1, // -1 indicates scan was skipped
			"scan_results": map[string]interface{}{
				"status": "skipped",
				"reason": "No API key configured",
				"message": "File uploaded successfully but not scanned due to missing API key",
			},
		}
		responseJSON, _ := json.Marshal(response)
		return string(responseJSON), nil
	}

	start := time.Now()

	// Initialize client
	c, err := amaasclient.NewClient(apiKey, region)
	if err != nil {
		log.Printf("Failed to create client: %v", err)
		// Return error response but don't fail the upload
		response := map[string]interface{}{
			"scan_result_code": -2, // -2 indicates scan failed
			"scan_results": map[string]interface{}{
				"status": "error",
				"reason": "Failed to create scan client",
				"error": err.Error(),
			},
		}
		responseJSON, _ := json.Marshal(response)
		return string(responseJSON), nil
	}
	defer c.Destroy()

	// Log file details before scanning
	log.Printf("Scanning file: %s (size: %d bytes)", filePath, fileSize)
	
	// Validate file before scanning
	if fileSize == 0 {
		log.Printf("Warning: File is empty, skipping scan")
		response := map[string]interface{}{
			"scan_result_code": -3, // -3 indicates empty file
			"scan_results": map[string]interface{}{
				"status": "skipped",
				"reason": "Empty file",
				"message": "File is empty, no scan needed",
				"file_name": filepath.Base(filePath),
				"file_size": fileSize,
			},
		}
		responseJSON, _ := json.Marshal(response)
		return string(responseJSON), nil
	}
	
	// Check file size limits (Trend Micro has limits)
	if fileSize > 100*1024*1024 { // 100MB limit
		log.Printf("Warning: File too large for scanning (%d bytes), skipping", fileSize)
		response := map[string]interface{}{
			"scan_result_code": -3, // -3 indicates file too large
			"scan_results": map[string]interface{}{
				"status": "skipped",
				"reason": "File too large",
				"message": "File exceeds maximum size for scanning",
				"file_name": filepath.Base(filePath),
				"file_size": fileSize,
			},
		}
		responseJSON, _ := json.Marshal(response)
		return string(responseJSON), nil
	}
	
	// Scan file
	tags := []string{"bpc-uploads"}
	result, err := c.ScanFile(filePath, tags)
	if err != nil {
		log.Printf("Scan failed: %v", err)
		// Check if this is a specific API error that should be retried
		if strings.Contains(err.Error(), "unknown error") || strings.Contains(err.Error(), "Ecountered") {
			log.Printf("API returned unknown error, this might be a transient issue")
		}
		// Return error response but don't fail the upload
		response := map[string]interface{}{
			"scan_result_code": -2, // -2 indicates scan failed
			"scan_results": map[string]interface{}{
				"status": "error",
				"reason": "File scan failed",
				"error": err.Error(),
				"file_name": filepath.Base(filePath),
				"file_size": fileSize,
			},
		}
		responseJSON, _ := json.Marshal(response)
		return string(responseJSON), nil
	}

	elapsed := time.Since(start)
	log.Printf("Scanning completed in %.2f seconds.", elapsed.Seconds())
	log.Printf("Scanning complete: %s", result)

	// Parse result to check scan status
	var resultMap map[string]interface{}
	if err := json.Unmarshal([]byte(result), &resultMap); err != nil {
		log.Printf("Failed to parse scan result: %v", err)
		// Return error response but don't fail the upload
		response := map[string]interface{}{
			"scan_result_code": -2, // -2 indicates scan failed
			"scan_results": map[string]interface{}{
				"status": "error",
				"reason": "Failed to parse scan result",
				"error": err.Error(),
			},
		}
		responseJSON, _ := json.Marshal(response)
		return string(responseJSON), nil
	}

	// Mimic Python version's result handling
	scanResultCode := 0
	if val, ok := resultMap["scanResult"].(float64); ok && val == 1 {
		scanResultCode = 1
		log.Println("File is malicious")
	} else if val, ok := resultMap["scanResult"].(float64); ok && val == 0 {
		log.Println("File is clean")
	} else {
		log.Printf("Unexpected scanResult value: %v (type: %T)", resultMap["scanResult"], resultMap["scanResult"])
	}
	
	// Also check foundMalwares array for additional detection
	if malwares, ok := resultMap["foundMalwares"].([]interface{}); ok && len(malwares) > 0 {
		scanResultCode = 1
		log.Printf("File is malicious - found malwares: %v", malwares)
	}

	// Prepare response similar to Python version
	response := map[string]interface{}{
		"scan_result_code": scanResultCode,
		"scan_results":     resultMap,
	}

	responseJSON, _ := json.Marshal(response)
	return string(responseJSON), nil
}