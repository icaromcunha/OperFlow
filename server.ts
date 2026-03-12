import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./src/backend/db";
import authRoutes from "./src/backend/routes/auth";
import protocolRoutes from "./src/backend/routes/protocols";
import clientRoutes from "./src/backend/routes/clients";
import companyRoutes from "./src/backend/routes/companies";
import channelRoutes from "./src/backend/routes/channels";
import insightRoutes from "./src/backend/routes/insights";
import configRoutes from "./src/backend/routes/config";
import productRoutes from "./src/backend/routes/products";
import opinionRoutes from "./src/backend/routes/opinions";
import userRoutes from "./src/backend/routes/users";
import evolutionRoutes from "./src/backend/routes/evolution";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for rate limiting behind nginx
  app.set('trust proxy', 1);

  // Initialize Database
  initDb();

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Vite handles this in dev
  }));
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json({ limit: '10mb' }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased limit for testing
    message: "Too many requests from this IP, please try again after 15 minutes",
    validate: { trustProxy: false },
  });
  app.use("/api/", limiter);

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/protocols", protocolRoutes);
  app.use("/api/clients", clientRoutes);
  app.use("/api/companies", companyRoutes);
  app.use("/api/channels", channelRoutes);
  app.use("/api/insights", insightRoutes);
  app.use("/api/config", configRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/opinions", opinionRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/evolution", evolutionRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error] ${err.stack}`);
    res.status(err.status || 500).json({
      error: process.env.NODE_ENV === 'production' 
        ? "Internal Server Error" 
        : err.message
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
