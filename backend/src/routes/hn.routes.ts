import { Router } from 'express';
import { HNController } from '../controllers/HNController';
import { CrawlerService } from '../crawler/CrawlerService';
import { ProcessorService } from '../processor/ProcessorService';
import { StorageRepository } from '../repository/StorageRepository';

const router = Router();

// Dependency Injection
const crawler = new CrawlerService();
const processor = new ProcessorService();
const storage = new StorageRepository();
const hnController = new HNController(crawler, processor, storage);

router.get('/scrape', hnController.scrape);
router.get('/logs', hnController.getLogs);

export default router;
