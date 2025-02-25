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
const os_1 = __importDefault(require("os"));
const fs_1 = require("fs");
const config_1 = __importDefault(require("../config/config"));
const logger_1 = __importDefault(require("../utils/logger"));
class HealthService {
    constructor() { }
    static getInstance() {
        if (!HealthService.instance) {
            HealthService.instance = new HealthService();
        }
        return HealthService.instance;
    }
    checkFileSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.promises.access(config_1.default.upload.uploadDir);
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
    getSystemMetrics() {
        const totalMemory = os_1.default.totalmem();
        const freeMemory = os_1.default.freemem();
        const usagePercentage = ((totalMemory - freeMemory) / totalMemory) * 100;
        return {
            cpuPressure: os_1.default.loadavg()[0] / os_1.default.cpus().length * 100, // Normalized CPU load as percentage
            memoryUsage: {
                total: totalMemory,
                free: freeMemory,
                usagePercentage,
            },
            uptime: os_1.default.uptime(),
            timestamp: new Date().toISOString(),
        };
    }
    getHealth() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const metrics = this.getSystemMetrics();
                const fileSystemHealth = yield this.checkFileSystem();
                const status = this.determineHealthStatus(metrics, fileSystemHealth);
                const health = {
                    status,
                    metrics,
                    dependencies: {
                        fileSystem: fileSystemHealth,
                    },
                };
                logger_1.default.info('Health check completed', { health });
                return health;
            }
            catch (error) {
                logger_1.default.error('Health check failed', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
                throw error;
            }
        });
    }
    determineHealthStatus(metrics, fileSystemHealth) {
        // Critical thresholds that indicate system is truly unhealthy
        if (!fileSystemHealth ||
            metrics.cpuPressure > 90 ||
            metrics.memoryUsage.usagePercentage > 95) {
            return 'unhealthy';
        }
        // Warning thresholds that indicate system is under pressure
        if (metrics.cpuPressure > 75 ||
            metrics.memoryUsage.usagePercentage > 90) {
            return 'degraded';
        }
        return 'healthy';
    }
}
exports.default = HealthService.getInstance();
