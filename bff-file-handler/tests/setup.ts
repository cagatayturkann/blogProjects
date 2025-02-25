import { promises as fs } from 'fs';
import path from 'path';
import config from '../src/config/config';

// Increase Jest timeout for large file tests
jest.setTimeout(60000); // 60 seconds

// Mock environment variables
process.env.LOG_DIR = path.resolve('./logs');
process.env.PORT = '3000';
process.env.RATE_LIMIT_WINDOW_MS = '1000';
process.env.RATE_LIMIT_MAX_REQUESTS = '5';
process.env.BASIC_AUTH_USER = 'admin';
process.env.BASIC_AUTH_PASS = 'secret';

export async function setupTestEnvironment(): Promise<void> {
  try {
    // Ensure upload and log directories exist with proper permissions
    await fs.mkdir(config.upload.uploadDir, { recursive: true, mode: 0o755 });
    await fs.mkdir(config.logging.dir, { recursive: true, mode: 0o755 });

    // Verify directories were created
    const [uploadStats, logStats] = await Promise.all([
      fs.stat(config.upload.uploadDir),
      fs.stat(config.logging.dir)
    ]);

    if (!uploadStats.isDirectory() || !logStats.isDirectory()) {
      throw new Error('Failed to create required directories');
    }
  } catch (error) {
    console.error('Test environment setup failed:', error);
    throw error;
  }
}

export async function cleanupTestEnvironment(): Promise<void> {
  try {
    // Clean up test files in upload directory
    const files = await fs.readdir(config.upload.uploadDir);
    await Promise.all(files.map((file) => fs.unlink(path.join(config.upload.uploadDir, file))));

    // Clean up test log files
    const logFiles = await fs.readdir(config.logging.dir);
    await Promise.all(logFiles.map((file) => fs.unlink(path.join(config.logging.dir, file))));
  } catch (error) {
    console.error('Error cleaning up test environment:', error);
    throw error;
  }
}

// Global setup and teardown for Jest
beforeAll(async () => {
  await setupTestEnvironment();
});

afterAll(async () => {
  await cleanupTestEnvironment();
});

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
