import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Get insights for a client (if consultant/admin) or for the logged-in client
router.get("/", authenticate, (req: any, res) => {
  const { id: userId, type, perfil } = req.user;
  const { cliente_id } = req.query;

  let targetClientId = userId;
  if ((type === 'admin' || perfil === 'consultor' || req.user.type === 'admin') && cliente_id) {
    targetClientId = cliente_id;
  }

  const insight = db.prepare(`
    SELECT * FROM insights 
    WHERE cliente_id = ?
    ORDER BY data_criacao DESC
    LIMIT 1
  `).get(targetClientId);
  res.json(insight || null);
});

// Create or Update insight (for consultant/admin)
router.post("/", authenticate, (req: any, res) => {
    const { type, perfil } = req.user;
    if (type !== 'admin' && perfil !== 'consultor') {
        return res.status(403).json({ error: "Apenas administradores ou consultores podem gerenciar insights." });
    }

    const { cliente_id, titulo, descricao } = req.body;

    const existing = db.prepare("SELECT id FROM insights WHERE cliente_id = ?").get(cliente_id) as any;

    if (existing) {
        db.prepare(`
            UPDATE insights 
            SET titulo = ?, descricao = ?, data_criacao = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(titulo || "Insight Estratégico", descricao, existing.id);
        res.json({ id: existing.id, updated: true });
    } else {
        const result = db.prepare(`
            INSERT INTO insights (cliente_id, titulo, descricao)
            VALUES (?, ?, ?)
        `).run(cliente_id, titulo || "Insight Estratégico", descricao);
        res.status(201).json({ id: result.lastInsertRowid });
    }
});

export default router;
