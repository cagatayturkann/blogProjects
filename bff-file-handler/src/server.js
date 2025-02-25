"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
const logger_1 = __importDefault(require("./utils/logger"));
const fileUploadService_1 = __importDefault(require("./services/fileUploadService"));
const server = app_1.default.listen(config_1.default.server.port, () => {
    logger_1.default.info(`Server is running on port ${config_1.default.server.port}`);
    logger_1.default.info(`Environment: ${config_1.default.server.nodeEnv}`);
});
// Graceful shutdown
const shutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Shutting down server...');
    server.close(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Stop the cleanup interval
            fileUploadService_1.default.stopCleanup();
            // Clean up resources
            yield fileUploadService_1.default.cleanup();
            // Flush logs
            logger_1.default.on('finish', () => {
                process.exit(0);
            });
            logger_1.default.info('Server shutdown complete');
            logger_1.default.end();
        }
        catch (error) {
            logger_1.default.error('Error during shutdown', {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            process.exit(1);
        }
    }));
    // Force shutdown after 30 seconds
    setTimeout(() => {
        logger_1.default.error('Forced shutdown after timeout');
        process.exit(1);
    }, 30000);
});
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
