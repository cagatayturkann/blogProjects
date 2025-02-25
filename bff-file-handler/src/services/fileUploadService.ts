import SimpleCircuitBreaker, { simpleRetry } from './simpleCircuitBreaker';
import logger from '../utils/logger';
import config from '../config/config';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ErrorType, FileUploadError } from '../constants/errorTypes';

class FileUploadService {
  private static instance: FileUploadService;
  private concurrentUploads: number = 0;
  private readonly maxConcurrentUploads: number = config.concurrency.maxOperations;
  private cleanupInterval: NodeJS.Timeout;
  private fileWriteBreaker: SimpleCircuitBreaker;

  private constructor() {
    this.fileWriteBreaker = new SimpleCircuitBreaker();
    // Run cleanup every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanup().catch(error => {
        logger.error('Scheduled cleanup failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      });
    }, 60 * 60 * 1000);
  }

  public static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService();
    }
    return FileUploadService.instance;
  }

  private async writeFile(file: Express.Multer.File): Promise<string> {
    const fileId = uuidv4();
    const fileName = `${fileId}-${file.originalname}`;
    const filePath = path.join(config.upload.uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);
    return fileName;
  }

  private async validateFile(file: Express.Multer.File): Promise<void> {
    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new FileUploadError(ErrorType.INVALID_FILE_TYPE);
    }

    if (file.size > config.upload.maxFileSize) {
      throw new FileUploadError(ErrorType.FILE_SIZE_LIMIT);
    }
  }

  public async uploadFile(file: Express.Multer.File): Promise<string> {
    if (this.concurrentUploads >= this.maxConcurrentUploads) {
      throw new FileUploadError(ErrorType.CONCURRENT_LIMIT);
    }

    this.concurrentUploads++;
    const uploadId = uuidv4();

    try {
      logger.info('Starting file upload', {
        uploadId,
        fileName: file.originalname,
        fileSize: file.size,
      });

      await this.validateFile(file);

      // Use circuit breaker and retry for file write operation
      const fileName = await this.fileWriteBreaker.execute(async () => {
        return await simpleRetry(
          () => this.writeFile(file),
          3, // max attempts
          1000 // base delay in ms
        );
      });

      logger.info('File upload completed', {
        uploadId,
        fileName,
        fileSize: file.size,
      });

      return fileName;
    } catch (error) {
      logger.error('File upload failed', {
        uploadId,
        error: error instanceof Error ? error.message : 'Unknown error',
        fileName: file.originalname,
      });
      if (error instanceof FileUploadError) {
        throw error;
      }
      throw new FileUploadError(ErrorType.INTERNAL_ERROR);
    } finally {
      this.concurrentUploads--;
    }
  }

  public async cleanup(): Promise<void> {
    try {
      const files = await fs.readdir(config.upload.uploadDir);
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;

      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(config.upload.uploadDir, file);
          const stats = await fs.stat(filePath);

          if (now - stats.mtimeMs > ONE_DAY) {
            await fs.unlink(filePath);
            logger.info('Cleaned up old file', { fileName: file });
          }
        })
      );
    } catch (error) {
      logger.error('File cleanup failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  public stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

export default FileUploadService.getInstance();
