# Deployment Guide

## System Requirements

### Hardware Requirements
- CPU: 2+ cores recommended
- RAM: 4GB minimum, 8GB recommended
- Storage: 10GB minimum free space

### Software Requirements
- Node.js 18.x or higher
- TypeScript 5.x
- npm or yarn package manager
- Git

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

4. Start development server:
```bash
npm run dev
```

## Production Deployment

### Environment Variables
Required environment variables:
```
NODE_ENV=production
PORT=3000
AUTH_USERNAME=your-username
AUTH_PASSWORD=your-password
MAX_FILE_SIZE=250000000
UPLOAD_DIR=./uploads
LOG_LEVEL=info
```

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t bff-file-handler .
```

2. Run the container:
```bash
docker run -d \
  --name bff-file-handler \
  -p 3000:3000 \
  -v /path/to/uploads:/app/uploads \
  -v /path/to/logs:/app/logs \
  --env-file .env \
  bff-file-handler
```

### Kubernetes Deployment

Apply the Kubernetes manifests:
```bash
kubectl apply -f k8s/
```

## Monitoring and Maintenance

### Health Monitoring
- Monitor `/health` endpoint
- Set up alerts for:
  - High CPU usage (>80%)
  - High memory usage (>80%)
  - Disk space usage (>80%)
  - Error rate spikes
  - Circuit breaker trips
  - Rate limit threshold breaches
  - Concurrent upload limit reaches

### Metrics to Monitor
- System Health:
  - CPU pressure (warn at 75%, critical at 90%)
  - Memory usage (warn at 90%, critical at 95%)
  - Disk space utilization
  - File system response times
- Request Metrics:
  - Request rate per client
  - Upload success/failure ratio
  - Average processing time
  - Concurrent upload count
- Circuit Breaker Status:
  - Open/closed state
  - Failure count
  - Recovery time
- Rate Limiting:
  - Requests rejected due to rate limits
  - Dynamic window size adjustments
  - Client IP distribution

### Load Balancing
- Configure health checks for load balancer
- Use weighted round-robin based on instance health
- Set up automatic instance removal when health degrades
- Configure proper connection draining during scale-down

### Log Management
- Logs are written to `/logs` directory
- Use log rotation to manage disk space
- Consider forwarding logs to a centralized logging system

### Backup Strategy
- Regular backup of uploaded files
- Database backups if applicable
- Configuration backups

## Scaling Considerations

### Horizontal Scaling
- Service is stateless and can be scaled horizontally
- Use load balancer for multiple instances
- Configure shared storage for uploads

### Resource Limits
- Set appropriate CPU and memory limits
- Monitor and adjust rate limiting based on load
- Configure file system quotas

## Security Considerations

### Network Security
- Use HTTPS in production
- Configure appropriate CORS settings
- Use secure headers (HSTS, CSP, etc.)

### Access Control
- Rotate authentication credentials regularly
- Use secrets management in production
- Implement IP whitelisting if needed

## Troubleshooting

### Common Issues
1. Upload failures
   - Check disk space
   - Verify file permissions
   - Check network connectivity

2. Performance issues
   - Monitor system metrics
   - Check rate limiting configuration
   - Verify resource allocation

### Support
For issues and support:
1. Check logs in `/logs` directory
2. Monitor health endpoint
3. Contact support team 