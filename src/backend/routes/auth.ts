import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "ecom-secret-key";

router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  // Try Admin/Consultor first
  const user = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email) as any;
  if (user && bcrypt.compareSync(senha, user.senha)) {
    const token = jwt.sign({ id: user.id, empresa_id: user.empresa_id, type: "admin", perfil: user.perfil }, JWT_SECRET);
    return res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, type: "admin", perfil: user.perfil, empresa_id: user.empresa_id } });
  }

  // Try Client/Lojista
  const client = db.prepare("SELECT * FROM clientes WHERE email = ?").get(email) as any;
  if (client && bcrypt.compareSync(senha, client.senha)) {
    const token = jwt.sign({ id: client.id, empresa_id: client.empresa_id, type: "client" }, JWT_SECRET);
    return res.json({ token, user: { id: client.id, nome: client.nome, email: client.email, type: "client", empresa_id: client.empresa_id } });
  }

  return res.status(401).json({ error: "Credenciais inválidas" });
});

export default router;
