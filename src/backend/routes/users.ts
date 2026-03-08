import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/", authenticate, (req: any, res) => {
  const { empresa_id, perfil } = req.user;
  
  if (perfil !== 'admin') {
    return res.status(403).json({ error: "Apenas administradores podem ver a equipe." });
  }
  
  const users = db.prepare("SELECT id, nome, email, perfil, status FROM usuarios WHERE empresa_id = ?").all(empresa_id);
  res.json(users);
});

router.post("/", authenticate, async (req: any, res) => {
  const { empresa_id, perfil } = req.user;
  
  if (perfil !== 'admin') {
    return res.status(403).json({ error: "Apenas administradores podem criar membros na equipe." });
  }

  const { nome, email, senha, perfil: novoPerfil } = req.body;
  const hashedPassword = await bcrypt.hash(senha || '123456', 10);
  
  try {
    const result = db.prepare(`
      INSERT INTO usuarios (empresa_id, nome, email, senha, perfil, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(empresa_id, nome, email, hashedPassword, novoPerfil || 'consultor', 'online');
    
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
