import { Request, Response } from 'express';
import fileUploadService from '../services/fileUploadService';
import logger from '../utils/logger';
import { ErrorType, ErrorMessages, ErrorStatusCodes, FileUploadError } from '../constants/errorTypes';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  const file = req.file;
  const requestId = req.headers['x-request-id'] || 'unknown';

  try {
    if (!file) {
      throw new FileUploadError(ErrorType.NO_FILE);
    }

    logger.info('File upload request received', {
      requestId,
      originalName: file.originalname,
      size: file.size,
    });

    const fileName = await fileUploadService.uploadFile(file);

    res.status(200).json({
      message: 'File uploaded successfully',
      fileName,
      requestId,
    });
  } catch (error) {
    logger.error('Error in file upload controller', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    if (error instanceof FileUploadError) {
      res.status(ErrorStatusCodes[error.type]).json({
        error: error.message,
        requestId,
      });
      return;
    }

    res.status(ErrorStatusCodes[ErrorType.INTERNAL_ERROR]).json({
      error: ErrorMessages[ErrorType.INTERNAL_ERROR],
      requestId,
    });
  }
}; 