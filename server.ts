import express from "express";
import cors from "cors";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  initDb();

  app.use(cors());
  app.use(express.json());

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

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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
