# AI Chat Model Optimization Guide

## Overview

The Boring Paper Co AI Chat service has been optimized to use smaller, more efficient models while maintaining good chat quality. This reduces resource usage, startup time, and download size.

## Model Comparison

| Model | Size | Memory Usage | Speed | Quality | Use Case |
|-------|------|--------------|-------|---------|----------|
| `tinyllama:1.1b-chat` | ~1.1GB | ~2GB RAM | ⚡ Fast | ✅ Good | **Default** - Most use cases |
| `phi:2.7b` | ~1.7GB | ~3GB RAM | 🚀 Medium | ✅ Better | Balanced performance |
| `phi:latest` | ~2.7GB | ~4GB RAM | 🐌 Slower | ⭐ Best | High-quality responses |

## Performance Benefits

Switching from `phi:latest` to `tinyllama:1.1b-chat` provides:

- **60% smaller download** (1.1GB vs 2.7GB)
- **50% less memory usage** (~2GB vs ~4GB RAM)
- **Faster startup** and model loading
- **Quicker response times** for chat interactions
- **Lower resource costs** in cloud deployments

## Configuration

### Environment Variable

Set the `OLLAMA_MODEL` environment variable to choose your model:

```bash
# Use the default small model (recommended)
export OLLAMA_MODEL=tinyllama:1.1b-chat

# Use medium model for better quality
export OLLAMA_MODEL=phi:2.7b

# Use large model for highest quality
export OLLAMA_MODEL=phi:latest
```

### Docker Compose

```yaml
services:
  aichat-service:
    environment:
      - OLLAMA_MODEL=tinyllama:1.1b-chat  # Fast, efficient
      - OLLAMA_URL=http://ollama-service:11434
```

### Kubernetes

```yaml
env:
- name: OLLAMA_MODEL
  value: "tinyllama:1.1b-chat"
```

## Testing Different Models

You can test different models by changing the environment variable and restarting the service:

```bash
# Test with small model
docker run -e OLLAMA_MODEL=tinyllama:1.1b-chat -e OLLAMA_URL=http://ollama:11434 aichat-service

# Test with medium model
docker run -e OLLAMA_MODEL=phi:2.7b -e OLLAMA_URL=http://ollama:11434 aichat-service

# Test with large model
docker run -e OLLAMA_MODEL=phi:latest -e OLLAMA_URL=http://ollama:11434 aichat-service
```

## Model Quality Assessment

All models are capable of handling the Boring Paper Co chat use case:

- **Business queries**: All models perform well
- **Product information**: All models provide accurate responses
- **Customer service**: All models maintain helpful tone
- **Technical questions**: Larger models may provide more detailed answers

## Recommendations

### For Development/Testing
- Use `tinyllama:1.1b-chat` for fast iteration and testing

### For Production (Most Use Cases)
- Use `tinyllama:1.1b-chat` for cost-effective, responsive chat

### For High-Quality Requirements
- Use `phi:2.7b` for better response quality while maintaining reasonable performance

### For Maximum Quality
- Use `phi:latest` when response quality is paramount and resources are available

## Migration Guide

If you're currently using `phi:latest` and want to switch to a smaller model:

1. **Update environment variables** in your deployment
2. **Restart the aichat service**
3. **Test chat functionality** to ensure quality meets your needs
4. **Monitor resource usage** to confirm improvements

The service will automatically pull the new model on startup. 