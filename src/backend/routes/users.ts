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

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
  }

  const hashedPassword = await bcrypt.hash(senha || '123456', 10);

  try {
    const result = db.prepare(`
      INSERT INTO usuarios (empresa_id, nome, email, senha, perfil, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(empresa_id, nome, email, hashedPassword, novoPerfil || 'consultor', 'online');
    
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err: any) {
    if (String(err.message || "").includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "E-mail já cadastrado para outro usuário." });
    }
    res.status(500).json({ error: err.message });
  }
});

router.get("/me", authenticate, (req: any, res) => {
  const { id } = req.user;
  const user = db.prepare("SELECT id, nome, email, perfil, status, avatar_url FROM usuarios WHERE id = ?").get(id);
  res.json(user);
});

router.patch("/me", authenticate, async (req: any, res) => {
  const { id } = req.user;
  const { nome, email, avatar_url, senha } = req.body;
  
  try {
    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 10);
      db.prepare(`
        UPDATE usuarios 
        SET nome = ?, email = ?, avatar_url = ?, senha = ?
        WHERE id = ?
      `).run(nome, email, avatar_url || null, hashedPassword, id);
    } else {
      db.prepare(`
        UPDATE usuarios 
        SET nome = ?, email = ?, avatar_url = ?
        WHERE id = ?
      `).run(nome, email, avatar_url || null, id);
    }
    
    res.json({ success: true });
  } catch (err: any) {
    if (String(err.message || "").includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "E-mail já cadastrado para outro usuário." });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;
