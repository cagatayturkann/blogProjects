"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config/config"));
const logger = winston_1.default.createLogger({
    level: config_1.default.logging.level,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    defaultMeta: { service: 'bff-file-handler' },
    transports: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(config_1.default.logging.dir, 'error.log'),
            level: 'error',
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(config_1.default.logging.dir, 'combined.log'),
        }),
    ],
});
// Add console transport in development
if (config_1.default.server.nodeEnv !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
    }));
}
exports.default = logger;
