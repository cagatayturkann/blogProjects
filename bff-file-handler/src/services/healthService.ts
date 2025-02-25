import os from 'os';
import { promises as fs } from 'fs';
import config from '../config/config';
import logger from '../utils/logger';

interface SystemMetrics {
  cpuPressure: number;
  memoryUsage: {
    total: number;
    free: number;
    cached?: number;
    available: number;
    usagePercentage: number;
  };
  uptime: number;
  timestamp: string;
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  metrics: SystemMetrics;
  dependencies: {
    fileSystem: boolean;
  };
}

class HealthService {
  private static instance: HealthService;

  private constructor() {}

  public static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  private async checkFileSystem(): Promise<boolean> {
    try {
      await fs.access(config.upload.uploadDir);
      return true;
    } catch {
      return false;
    }
  }

  private getSystemMetrics(): SystemMetrics {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    
    // On Unix-like systems (including macOS), we need to consider cached memory
    let availableMemory = freeMemory;
    
    // Calculate actual used memory (excluding cache/buffers if possible)
    const usedMemory = totalMemory - availableMemory;
    
    // Calculate memory usage percentage based on actual used memory
    const usagePercentage = totalMemory === 0 
      ? 0 
      : Math.min(100, Math.round((usedMemory / totalMemory) * 100));

    // Calculate CPU usage based on average load
    const loadAvg = os.loadavg()[0];          // 1 minute load average
    const cpuCount = os.cpus().length;        // Number of CPU cores
    const normalizedLoad = (loadAvg / cpuCount);  // Load per CPU core
    const cpuPressure = Math.min(100, Math.round(normalizedLoad * 25)); // Scale to reasonable percentage

    return {
      cpuPressure,
      memoryUsage: {
        total: totalMemory,
        free: freeMemory,
        available: availableMemory,
        usagePercentage,
      },
      uptime: os.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  public async getHealth(): Promise<HealthStatus> {
    try {
      const metrics = this.getSystemMetrics();
      const fileSystemHealth = await this.checkFileSystem();

      const status = this.determineHealthStatus(metrics, fileSystemHealth);

      const health: HealthStatus = {
        status,
        metrics,
        dependencies: {
          fileSystem: fileSystemHealth,
        },
      };

      logger.info('Health check completed', { health });
      return health;
    } catch (error) {
      logger.error('Health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private determineHealthStatus(
    metrics: SystemMetrics,
    fileSystemHealth: boolean
  ): HealthStatus['status'] {
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

export default HealthService.getInstance(); 