import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

// Import routes
import certificateRoutes from "./routes/certificates.routes";
import adminRoutes from "./routes/admin.routes";
import statsRoutes from "./routes/stats.routes";
import signatureRoutes from "./routes/signature.routes";

// Initialize Express app
const app: Application = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("dev")); // HTTP request logger

// Health check endpoint (Available at root and /health)
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "EGYROBO Backend API is running",
    timestamp: new Date().toISOString(),
  });
});

// --- ROUTE MOUNTING (The Fix) ---
// We create a router to hold all logic
const apiRouter = express.Router();

apiRouter.use("/certificates", certificateRoutes);
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/stats", statsRoutes);
apiRouter.use("/signature", signatureRoutes);

// Mount the router at TWO paths to catch all Vercel routing scenarios
// 1. If Vercel strips /api, this catches /certificates
app.use("/", apiRouter);
// 2. If Vercel passes full path, this catches /api/certificates
app.use("/api", apiRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
