FROM --platform=linux/amd64 golang:1.21-alpine AS builder

# Install necessary tools
RUN apk add --no-cache git curl

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application for AMD64 (AKS compatibility)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main

# Final stage
FROM --platform=linux/amd64 alpine:latest

# Install necessary runtime dependencies
RUN apk add --no-cache ca-certificates

# Create uploads directory
RUN mkdir -p /app/uploads

# Set working directory
WORKDIR /app

# Copy the built binary from the builder stage
COPY --from=builder /app/main .

# Expose the port the app runs on
EXPOSE 5000

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of the uploads directory
RUN chown -R appuser:appgroup /app/uploads

# Switch to non-root user
USER appuser

# Command to run the executable
CMD ["./main"] 