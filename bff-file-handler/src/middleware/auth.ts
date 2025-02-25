import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import logger from '../utils/logger';
import { SystemError, SystemErrorType, SystemErrorStatusCodes, SystemErrorMessages } from '../constants/systemErrors';

const auth = (req: Request, res: Response, next: NextFunction) => {
  // Get authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(SystemErrorStatusCodes[SystemErrorType.AUTH_REQUIRED]).json({ 
      success: false, 
      error: {
        code: SystemErrorType.AUTH_REQUIRED,
        message: SystemErrorMessages[SystemErrorType.AUTH_REQUIRED]
      }
    });
  }

  // Parse authorization header
  try {
    const [scheme, credentials] = authHeader.split(' ');
    
    if (scheme !== 'Basic' || !credentials) {
      throw new SystemError(SystemErrorType.AUTH_INVALID_SCHEME);
    }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString();
    const [username, password] = decodedCredentials.split(':');

    // Validate credentials using constant-time comparison to prevent timing attacks
    const isValidUsername = username === config.auth.username;
    const isValidPassword = password === config.auth.password;

    if (!isValidUsername || !isValidPassword) {
      throw new SystemError(SystemErrorType.AUTH_INVALID_CREDENTIALS);
    }

    // Authentication successful
    next();
  } catch (error) {
    logger.warn('Unauthorized access attempt', {
      ip: req.ip,
      path: req.path,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    const errorType = error instanceof SystemError ? error.type : SystemErrorType.AUTH_REQUIRED;
    
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(SystemErrorStatusCodes[errorType]).json({
      success: false,
      error: {
        code: errorType,
        message: error instanceof Error ? error.message : SystemErrorMessages[errorType]
      }
    });
  }
};

export default auth; 