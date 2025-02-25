export enum ErrorType {
  NO_FILE = 'NO_FILE',
  CONCURRENT_LIMIT = 'CONCURRENT_LIMIT',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_SIZE_LIMIT = 'FILE_SIZE_LIMIT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export const ErrorMessages = {
  [ErrorType.NO_FILE]: 'No file provided',
  [ErrorType.CONCURRENT_LIMIT]: 'Too many concurrent uploads',
  [ErrorType.INVALID_FILE_TYPE]: 'Invalid file type. Only CSV files are allowed',
  [ErrorType.FILE_SIZE_LIMIT]: 'File size exceeds the maximum limit',
  [ErrorType.INTERNAL_ERROR]: 'Internal server error',
} as const;

export const ErrorStatusCodes = {
  [ErrorType.NO_FILE]: 400,
  [ErrorType.CONCURRENT_LIMIT]: 429,
  [ErrorType.INVALID_FILE_TYPE]: 400,
  [ErrorType.FILE_SIZE_LIMIT]: 400,
  [ErrorType.INTERNAL_ERROR]: 500,
} as const;

export class FileUploadError extends Error {
  constructor(
    public type: ErrorType,
    message?: string
  ) {
    super(message || ErrorMessages[type]);
    this.name = 'FileUploadError';
  }
} 