import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Get insights for a client (if consultant/admin) or for the logged-in client
router.get("/", authenticate, (req: any, res) => {
  const { id: userId, type, perfil } = req.user;
  const { cliente_id } = req.query;

  const isStaff = type === 'admin' || perfil === 'consultor';
  let targetClientId = userId;
  
  if (isStaff && cliente_id) {
    targetClientId = cliente_id;
  }

  if (isStaff) {
    // Staff sees all history
    const insights = db.prepare(`
      SELECT * FROM insights 
      WHERE cliente_id = ?
      ORDER BY data_criacao DESC
    `).all(targetClientId);
    res.json(insights);
  } else {
    // Client sees only the latest visible one
    const insight = db.prepare(`
      SELECT * FROM insights 
      WHERE cliente_id = ? AND visivel_cliente = 1
      ORDER BY data_criacao DESC
      LIMIT 1
    `).get(targetClientId);
    res.json(insight || null);
  }
});

// Create insight (for consultant/admin) - Always insert to maintain history
router.post("/", authenticate, (req: any, res) => {
    const { id: userId, type, perfil } = req.user;
    if (type !== 'admin' && perfil !== 'consultor') {
        return res.status(403).json({ error: "Apenas administradores ou consultores podem gerenciar insights." });
    }

    const { cliente_id, titulo, descricao, visivel_cliente } = req.body;

    const result = db.prepare(`
        INSERT INTO insights (cliente_id, consultor_id, titulo, descricao, visivel_cliente)
        VALUES (?, ?, ?, ?, ?)
    `).run(cliente_id, userId, titulo || "Insight Estratégico", descricao, visivel_cliente !== undefined ? (visivel_cliente ? 1 : 0) : 1);
    
    res.status(201).json({ id: result.lastInsertRowid });
});

export default router;
