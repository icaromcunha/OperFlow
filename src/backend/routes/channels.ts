import express from "express";
import db from "../db";
import { authenticate } from "./protocols"; // Reusing the authenticate middleware

const router = express.Router();

// Get all channels for the logged-in client
router.get("/", authenticate, (req: any, res) => {
  const { id: cliente_id } = req.user;
  const channels = db.prepare(`
    SELECT * FROM canais 
    WHERE cliente_id = ?
    ORDER BY nome ASC
  `).all(cliente_id);
  res.json(channels);
});

export default router;
