import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { CrawlerService } from '../crawler/CrawlerService';
import { ProcessorService, FilterType } from '../processor/ProcessorService';
import { StorageRepository } from '../repository/StorageRepository';
import { ApiResponse } from '../utils/response';

export class HNController {
  constructor(
    private crawler: CrawlerService,
    private processor: ProcessorService,
    private storage: StorageRepository
  ) {}

  public scrape = async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    try {
      const filter = (req.query.filter as FilterType) || 'none';
      
      // 1. Fetch
      const rawEntries = await this.crawler.fetchEntries(30);
      
      // 2. Process
      const processedEntries = this.processor.process(rawEntries, filter);
      
      const executionTimeMs = Date.now() - startTime;

      // 3. Log usage
      const logId = crypto.randomUUID();
      this.storage.logUsage({
        id: logId,
        timestamp: new Date().toISOString(),
        filter_applied: filter,
        execution_time_ms: executionTimeMs,
        results_count: processedEntries.length
      });

      return ApiResponse.success(res, processedEntries, {
        logId,
        executionTimeMs,
        filterApplied: filter,
        totalExtracted: rawEntries.length,
        totalReturned: processedEntries.length
      });

    } catch (error) {
      next(error);
    }
  };

  public getLogs = (req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = this.storage.getLogs();
      return ApiResponse.success(res, logs);
    } catch (error) {
      next(error);
    }
  };
}
