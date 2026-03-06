import express from "express";
import db from "../db";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// List all opinions
router.get("/", authenticateToken, (req, res) => {
  try {
    const opinions = db.prepare(`
      SELECT p.*, u.nome as autor_nome 
      FROM pareceres p
      JOIN usuarios u ON p.consultor_id = u.id
      ORDER BY p.data_criacao DESC
    `).all();
    res.json(opinions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pareceres" });
  }
});

// Create opinion
router.post("/", authenticateToken, (req, res) => {
  const { cliente_id, conteudo, status_resultado } = req.body;
  const consultor_id = (req as any).user.id;
  try {
    const result = db.prepare(
      "INSERT INTO pareceres (cliente_id, consultor_id, conteudo, status_resultado) VALUES (?, ?, ?, ?)"
    ).run(cliente_id, consultor_id, conteudo, status_resultado);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar parecer" });
  }
});

export default router;
