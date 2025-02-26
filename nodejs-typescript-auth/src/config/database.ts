import mongoose from 'mongoose';
import { logger } from '../utils/logger';

// Database connection class
class Database {
  // Connect to MongoDB
  public static connect(uri: string): void {
    mongoose
      .connect(uri)
      .then(() => {
        logger.info('Connected to MongoDB');
      })
      .catch((error) => {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
      });
  }

  // Disconnect from MongoDB
  public static disconnect(): void {
    mongoose.disconnect()
      .then(() => {
        logger.info('Disconnected from MongoDB');
      })
      .catch((error) => {
        logger.error('MongoDB disconnection error:', error);
      });
  }
}

export default Database; 