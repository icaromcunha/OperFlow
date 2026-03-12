import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";
import { supabase, isSupabaseEnabled } from "../supabase";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "ecom-secret-key";

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  // Supabase Integration
  if (isSupabaseEnabled) {
    try {
      // 1. Try to authenticate with Supabase Auth if the user exists there
      const { data: sbAuth, error: sbAuthError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      // 2. Regardless of Supabase Auth, check our 'usuarios' table in Supabase
      // This is where we synced our SQLite data
      const { data: sbUser, error: sbUserError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();

      if (sbUser && bcrypt.compareSync(senha, sbUser.senha)) {
        const token = jwt.sign({ id: sbUser.id, empresa_id: sbUser.empresa_id, type: "admin", perfil: sbUser.perfil }, JWT_SECRET);
        return res.json({ token, user: { id: sbUser.id, nome: sbUser.nome, email: sbUser.email, type: "admin", perfil: sbUser.perfil, empresa_id: sbUser.empresa_id } });
      }

      // 3. Check 'clientes' table in Supabase
      const { data: sbClient, error: sbClientError } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', email)
        .single();

      if (sbClient && bcrypt.compareSync(senha, sbClient.senha)) {
        const token = jwt.sign({ id: sbClient.id, empresa_id: sbClient.empresa_id, type: "client" }, JWT_SECRET);
        return res.json({ token, user: { id: sbClient.id, nome: sbClient.nome, email: sbClient.email, type: "client", empresa_id: sbClient.empresa_id } });
      }
    } catch (e) {
      console.error("Supabase login error:", e);
      // Fallback to SQLite if Supabase fails
    }
  }

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
