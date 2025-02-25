# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
# Skip husky installation in production and only install production dependencies
RUN npm pkg delete scripts.prepare && \
    npm ci --omit=dev

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY .env .env

# Create directories for uploads and logs
RUN mkdir -p uploads logs && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Expose port
EXPOSE 3000

# Create volumes for persistence
VOLUME ["/app/uploads", "/app/logs"]

# Start the application
CMD ["npm", "start"] 