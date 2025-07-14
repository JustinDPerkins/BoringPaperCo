FROM --platform=linux/amd64 golang:latest

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application for AMD64 (AKS compatibility)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main .

# Expose port
EXPOSE 5001

# Run the binary
CMD ["./main"] 