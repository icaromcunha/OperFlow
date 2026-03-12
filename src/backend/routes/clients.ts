import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";
import { supabase, isSupabaseEnabled } from "../supabase";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/", authenticate, (req: any, res) => {
  const { empresa_id, id: userId, perfil } = req.user;
  
  let query = `
    SELECT c.*, (SELECT COUNT(*) FROM protocolos WHERE cliente_id = c.id AND status != 'concluido') as protocolos_ativos
    FROM clientes c
    WHERE c.empresa_id = ?
  `;
  
  let params = [empresa_id];
  
  if (perfil === 'consultor') {
    query += " AND c.consultor_id = ?";
    params.push(userId);
  }
  
  const clients = db.prepare(query).all(...params);
  res.json(clients);
});

router.post("/", authenticate, async (req: any, res) => {
  const { empresa_id, perfil } = req.user;
  
  if (perfil !== 'admin' && perfil !== 'consultor') {
    return res.status(403).json({ error: "Apenas administradores ou consultores podem criar clientes." });
  }

  const { nome, email, senha, status, whatsapp_numero, consultor_id } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
  }

  try {
    const hashedPassword = await bcrypt.hash(senha || '123456', 10);

    const result = db.prepare(`
      INSERT INTO clientes (empresa_id, nome, email, senha, status, whatsapp_numero, consultor_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(empresa_id, nome, email, hashedPassword, status || 'ativo', whatsapp_numero || null, consultor_id || null);

    const clientId = result.lastInsertRowid;

    // Sync to Supabase if enabled
    if (isSupabaseEnabled) {
      try {
        await supabase.from('clientes').insert({
          id: clientId,
          empresa_id,
          nome,
          email,
          status: status || 'ativo',
          whatsapp_numero: whatsapp_numero || null,
          consultor_id: consultor_id || null
        });
        console.log(`Client ${clientId} synced to Supabase`);
      } catch (e) {
        console.error("Supabase sync error:", e);
      }
    }

    res.status(201).json({ id: clientId });
  } catch (err: any) {
    if (String(err.message || "").includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "E-mail já cadastrado para outro cliente." });
    }
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authenticate, (req: any, res) => {
  const { id } = req.params;
  const client = db.prepare("SELECT * FROM clientes WHERE id = ?").get(id) as any;
  
  if (client) {
    const protocols = db.prepare(`
      SELECT id, titulo, status, data_criacao 
      FROM protocolos 
      WHERE cliente_id = ? 
      ORDER BY data_criacao DESC 
      LIMIT 5
    `).all(id);
    client.protocolos_recentes = protocols;
  }
  
  res.json(client);
});

router.patch("/:id", authenticate, (req: any, res) => {
  const { id } = req.params;
  const { nome, email, telefone, whatsapp_numero, whatsapp_notificacoes_ativas, status, avatar_url, faturamento, pedidos } = req.body;
  
  db.prepare(`
    UPDATE clientes 
    SET nome = ?, email = ?, telefone = ?, whatsapp_numero = ?, whatsapp_notificacoes_ativas = ?, status = ?, avatar_url = ?, faturamento = ?, pedidos = ?
    WHERE id = ?
  `).run(
    nome, 
    email, 
    telefone, 
    whatsapp_numero, 
    whatsapp_notificacoes_ativas ? 1 : 0, 
    status || 'ativo', 
    avatar_url || null, 
    faturamento || 0, 
    pedidos || 0, 
    id
  );
  
  res.json({ success: true });
});

router.get("/me", authenticate, (req: any, res) => {
  const { id } = req.user;
  const client = db.prepare("SELECT id, nome, email, telefone, whatsapp_numero, whatsapp_notificacoes_ativas, avatar_url FROM clientes WHERE id = ?").get(id);
  res.json(client);
});

router.patch("/me", authenticate, (req: any, res) => {
  const { id } = req.user;
  const { nome, email, telefone, whatsapp_numero, whatsapp_notificacoes_ativas, avatar_url } = req.body;
  
  db.prepare(`
    UPDATE clientes 
    SET nome = ?, email = ?, telefone = ?, whatsapp_numero = ?, whatsapp_notificacoes_ativas = ?, avatar_url = ?
    WHERE id = ?
  `).run(nome, email, telefone, whatsapp_numero, whatsapp_notificacoes_ativas ? 1 : 0, avatar_url || null, id);
  
  res.json({ success: true });
});

export default router;
