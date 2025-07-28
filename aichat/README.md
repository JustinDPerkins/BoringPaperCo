# BPC AI Chat Service

A microservice for AI-powered chat interactions using Ollama.

## Features
- Simple chat API
- Ollama integration
- Configurable AI model with size optimization
- Trend Vision One AI guard integration

## Environment Variables
- `PORT`: Service port (default: 5001)
- `OLLAMA_URL`: Ollama service URL
- `OLLAMA_MODEL`: Model to use (default: tinyllama:1.1b-chat)
- `API_KEY`: Trend Vision One API key for content filtering

## Model Optimization

The service now supports multiple model sizes for different use cases:

### Small Models (Recommended for most use cases)
- `tinyllama:1.1b-chat` (~1.1GB) - **Default**, fast, good for chat
- `phi:2.7b` (~1.7GB) - Good balance of size and quality

### Larger Models (Better quality, more resources)
- `phi:latest` (~2.7GB) - Original choice, highest quality

### Usage Examples
```bash
# Use default small model
docker run -e OLLAMA_URL=http://ollama:11434 aichat-service

# Use specific model
docker run -e OLLAMA_URL=http://ollama:11434 -e OLLAMA_MODEL=phi:2.7b aichat-service

# Use smallest model for resource-constrained environments
docker run -e OLLAMA_URL=http://ollama:11434 -e OLLAMA_MODEL=tinyllama:1.1b-chat aichat-service
```

## Endpoints
- `POST /chat`: Send a message, receive AI response
- `GET /health`: Health check endpoint

## Performance Benefits

Switching from `phi:latest` to `tinyllama:1.1b-chat`:
- **~60% smaller download** (1.1GB vs 2.7GB)
- **Faster startup** and model loading
- **Lower memory usage** (~2GB vs ~4GB RAM)
- **Faster inference** for chat responses
- **Still maintains good chat quality** for business use cases 