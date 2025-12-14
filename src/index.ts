import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Import routes
import certificateRoutes from './routes/certificates.routes';
import adminRoutes from './routes/admin.routes';
import statsRoutes from './routes/stats.routes';
import signatureRoutes from './routes/signature.routes';

// Initialize Express app
const app: Application = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // HTTP request logger

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'EGYROBO Backend API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/signature', signatureRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   EGYROBO Certificate Management Backend API              ║
║                                                           ║
║   Server running on port: ${PORT}                         ║
║   Environment: ${config.nodeEnv}                          ║
║   Network: Base Sepolia (Chain ID: ${config.chainId})     ║
║   Contract: ${config.contractAddress}                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
