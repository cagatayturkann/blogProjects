# BFF File Handler API Documentation

## Overview
This service provides a secure and efficient way to handle large CSV file uploads with built-in rate limiting, authentication, and health monitoring capabilities.

## Base URL
```
http://localhost:3000/api
```

## Authentication
The API uses Basic Authentication for securing endpoints. All endpoints except `/health` require authentication.

### Headers
```
Authorization: Basic <base64(username:password)>
```

## Endpoints

### 1. File Upload
`POST /upload`

Handles file uploads with multipart/form-data.

#### Request
- Method: `POST`
- Content-Type: `multipart/form-data`
- Authentication: Required
- Max File Size: 250MB

#### Form Data
| Field | Type | Description |
|-------|------|-------------|
| file  | File | CSV file to upload |

#### Response
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileId": "unique-file-id",
  "metadata": {
    "size": "file-size-in-bytes",
    "filename": "original-filename",
    "uploadedAt": "timestamp"
  }
}
```

#### Error Responses
- `400 Bad Request`: Invalid file format or missing file
- `401 Unauthorized`: Missing or invalid authentication
- `413 Payload Too Large`: File size exceeds limit
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error

### 2. Health Check
`GET /health`

Returns system health status and metrics.

#### Request
- Method: `GET`
- Authentication: Not required

#### Response
```json
{
  "status": "healthy" | "degraded" | "unhealthy",
  "metrics": {
    "cpuPressure": 45.5,
    "memoryUsage": {
      "total": 16384,
      "used": 8192,
      "free": 8192,
      "usagePercentage": 50
    }
  },
  "fileSystem": true,
  "timestamp": "2024-01-26T12:00:00Z"
}
```

## Rate Limiting
- 1 request per 10 seconds per client
- Maximum 5 concurrent file processing operations
- Rate limits are dynamically adjusted based on system load

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  },
  "requestId": "unique-request-id"
}
```

### Common Error Codes
- `FILE_TOO_LARGE`: File size exceeds 250MB limit
- `INVALID_FILE_TYPE`: File is not a CSV
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SYSTEM_OVERLOAD`: System cannot handle more requests
- `UNAUTHORIZED`: Authentication failed
- `INTERNAL_ERROR`: Unexpected server error

## Load Handling and Error Recovery

### Rate Limiting
- Dynamic rate limiting based on system load
- Base limit: 1 request per 10 seconds per client IP
- Window time doubles when system is under high load (CPU > 80% or Memory > 80%)
- Rate limits are returned in response headers:
  - `X-RateLimit-Limit`: Requests allowed per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the current window resets

### Circuit Breaking
- Automatic circuit breaking for file operations when system is stressed
- Circuit opens after 3 consecutive failures
- 30-second cooling period before circuit resets
- Automatic retries with exponential backoff (3 attempts, starting at 1s delay)

### Concurrent Operations
- Maximum 5 concurrent file processing operations
- Requests exceeding this limit receive 429 status with retry-after header
- System automatically queues and processes requests as capacity becomes available

### System Health States
- `healthy`: System operating normally
- `degraded`: System under pressure (CPU > 75% or Memory > 90%)
- `unhealthy`: System cannot accept new requests (CPU > 90% or Memory > 95%)

### Recovery Mechanisms
- Automatic cleanup of temporary files older than 24 hours
- Graceful shutdown with 30-second timeout for pending operations
- Automatic request retries on transient failures
- Health check middleware rejects new requests when system is unhealthy

## Request ID Tracking
Every request is assigned a unique request ID returned in the `X-Request-ID` header. Use this ID for tracking and debugging purposes.

## Best Practices
1. Always include proper authentication headers
2. Handle rate limiting by implementing exponential backoff
3. Monitor the health endpoint for system status
4. Use request IDs in logs for debugging
5. Implement proper error handling for all possible response codes

## Monitoring and Logging
All requests are logged with the following information:
- Request ID
- Timestamp
- Client IP
- Endpoint
- Response status
- Processing time
- File metadata (for uploads)

Access logs are available in the `/logs` directory. 