# ContainerXDR WebSocket Terminal Service

## Overview
This service provides a WebSocket-based terminal interface for executing commands remotely.

## Features
- WebSocket terminal connection
- HTTP POST endpoint for command execution
- Secure, non-root container deployment

## Running the Service

### Local Development
```bash
# Build and run
go run main.go

# Access the service
# WebSocket: ws://localhost:8081/terminal
# HTTP POST: http://localhost:8081/execute
```

### Docker Deployment
```bash
# Build and start the service
docker-compose up --build

# Stop the service
docker-compose down
```

## Endpoints
- `/terminal`: WebSocket endpoint for interactive terminal
- `/execute`: HTTP POST endpoint for single command execution

## Security Considerations
- Runs as a non-root user
- Minimal container with dropped capabilities
- No new privileges mode enabled

## Environment Configuration
No specific environment variables required.

## Potential Use Cases
- Remote command execution
- Container management
- Debugging and administration interfaces

## Warning
⚠️ This service provides powerful remote execution capabilities. 
Ensure proper network security and access controls are in place. 