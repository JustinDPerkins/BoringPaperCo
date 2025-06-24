# BPC File Scanning Service

## Prerequisites
- Docker
- Docker Compose
- Trend Micro File Security SDK API Key

## Configuration

1. Set environment variables:
```bash
export API_KEY=your_trend_micro_api_key
export REGION=your_trend_micro_region
```

## Running the Service

### Development Mode
```bash
# Build and start the service
docker-compose up --build

# Stop the service
docker-compose down
```

### Testing File Upload
```bash
# Upload a file using curl
curl -X POST -F "file=@/path/to/your/file" http://localhost:5000/upload
```

## Environment Variables
- `API_KEY`: Your Trend Micro File Security SDK API key
- `REGION`: The region for your Trend Micro SDK (default: us-east-1)

## Security Notes
- The service runs as a non-root user
- Uploads are stored in a volume-mounted directory
- Environment variables are used for sensitive configuration

## Troubleshooting
- Ensure API_KEY and REGION are correctly set
- Check Docker logs for detailed error messages
```bash
docker-compose logs file-scanner
``` 