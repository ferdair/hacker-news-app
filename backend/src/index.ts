import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import hnRoutes from './routes/hn.routes';
import { errorHandler } from './middleware/error-handler';
import { requestLogger, logger } from './middleware/logger.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares de seguridad y optimización
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

// Request logging
app.use(requestLogger);

// Routes
app.use('/api', hnRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Backend server running on http://localhost:${port}`);
});
