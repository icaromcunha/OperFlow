import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Get channels for a client (if consultant/admin) or for the logged-in client
router.get("/", authenticate, (req: any, res) => {
  const { id: userId, type, perfil } = req.user;
  const { cliente_id } = req.query;

  let targetClientId = userId;
  if ((type === 'admin' || perfil === 'consultor' || req.user.type === 'admin') && cliente_id) {
    targetClientId = cliente_id;
  }

  const channels = db.prepare(`
    SELECT * FROM canais 
    WHERE cliente_id = ?
    ORDER BY nome ASC
  `).all(targetClientId);
  res.json(channels);
});

// Update or Create channel (for consultant/admin)
router.post("/", authenticate, (req: any, res) => {
    const { type, perfil } = req.user;
    if (type !== 'admin' && perfil !== 'consultor') {
        return res.status(403).json({ error: "Apenas administradores ou consultores podem gerenciar canais." });
    }

    const { cliente_id, nome, status, status_cor, estoque_tipo, estoque_cor } = req.body;

    const existing = db.prepare("SELECT id FROM canais WHERE cliente_id = ? AND nome = ?").get(cliente_id, nome) as any;

    if (existing) {
        db.prepare(`
            UPDATE canais 
            SET status = ?, status_cor = ?, estoque_tipo = ?, estoque_cor = ?, data_atualizacao = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(status, status_cor, estoque_tipo, estoque_cor, existing.id);
        res.json({ id: existing.id, updated: true });
    } else {
        const result = db.prepare(`
            INSERT INTO canais (cliente_id, nome, status, status_cor, estoque_tipo, estoque_cor)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(cliente_id, nome, status, status_cor, estoque_tipo, estoque_cor);
        res.status(201).json({ id: result.lastInsertRowid });
    }
});

export default router;
