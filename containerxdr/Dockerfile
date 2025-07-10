FROM --platform=linux/amd64 golang:latest

# Set noninteractive installation mode
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Update the package list and install necessary packages including cron and openssl
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    openssh-client \
    sudo \
    cron \
    openssl && \
    rm -rf /var/lib/apt/lists/*


# Build the application for AMD64 (AKS compatibility)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main .

# Expose the port the app runs on
EXPOSE 8081

# Command to run the executable
CMD ["./main"] 