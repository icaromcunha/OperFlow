import express from "express";
import db from "../db";
import { authenticate } from "./protocols"; // Reusing the authenticate middleware

const router = express.Router();

// Get insights for the logged-in client
router.get("/", authenticate, (req: any, res) => {
  const { id: cliente_id } = req.user;
  const insights = db.prepare(`
    SELECT * FROM insights 
    WHERE cliente_id = ?
    ORDER BY data_criacao DESC
  `).all(cliente_id);
  res.json(insights || []);
});

export default router;
