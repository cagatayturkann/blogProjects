# Testing with Postman

## Setup

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new Collection called "BFF File Handler"

## Environment Setup

Create a new Environment in Postman with these variables:

| Variable | Initial Value | Description |
|----------|--------------|-------------|
| baseUrl | http://localhost:3000/api | Base URL of the API |
| username | your-username | Basic Auth username |
| password | your-password | Basic Auth password |

## Requests

### 1. Health Check

```
GET {{baseUrl}}/health
```

No authentication required.

### 2. File Upload

```
POST {{baseUrl}}/upload
```

#### Authentication
1. Go to the "Authorization" tab
2. Select "Basic Auth" type
3. Enter:
   - Username: {{username}}
   - Password: {{password}}

#### Request Setup
1. Go to the "Body" tab
2. Select "form-data"
3. Add a key "file" (Type: File)
4. Click "Select File" and choose your CSV file (up to 250MB)

#### Headers
The following headers are automatically set by Postman when you use form-data:
- Content-Type: multipart/form-data

## Testing Steps

1. Health Check Test:
   - Send the Health Check request
   - Expected response: 200 OK with health metrics

2. Authentication Test:
   - Send File Upload request without auth
   - Expected response: 401 Unauthorized
   - Add Basic Auth
   - Try again with auth

3. File Upload Test:
   - Try with small CSV file first
   - Check response format
   - Try with larger file
   - Check rate limiting by sending multiple requests

## Example Response

### Health Check Response
```json
{
  "status": "healthy",
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

### Successful Upload Response
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileId": "unique-file-id",
  "metadata": {
    "size": "1048576",
    "filename": "data.csv",
    "uploadedAt": "2024-01-26T12:00:00Z"
  }
}
```

## Troubleshooting

1. Connection Refused
   - Verify the server is running
   - Check if the port (3000) is correct
   - Ensure no firewall is blocking the connection

2. Authentication Failed
   - Verify username and password in environment variables
   - Check if Basic Auth is properly configured
   - Ensure credentials match .env file

3. File Upload Failed
   - Check file size (max 250MB)
   - Verify file is CSV format
   - Ensure "file" key is used in form-data
   - Check server logs for detailed error 