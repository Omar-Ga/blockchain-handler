import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import logger from './utils/logger';
import { getNetworkName } from './services/wallet.service';

// Routes
import certificateRoutes from './routes/certificates.routes';
import adminRoutes from './routes/admin.routes';
import statsRoutes from './routes/stats.routes';
import signatureRoutes from './routes/signature.routes';

const app: Application = express();

// Security & Performance
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10kb' }));

// Rate Limiting
app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, error: 'Rate limit exceeded' },
}));

// Health check
app.get('/health', (_req, res) => {
    res.json({ success: true, network: getNetworkName() });
});

// API Routes
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/signature', signatureRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} | ${getNetworkName()} | ${config.nodeEnv}`);
});

// Graceful shutdown
const shutdown = () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
