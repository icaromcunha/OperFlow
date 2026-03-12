import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";

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

router.post("/", authenticate, (req: any, res) => {
  const { empresa_id, perfil } = req.user;
  
  if (perfil !== 'admin' && perfil !== 'consultor') {
    return res.status(403).json({ error: "Apenas administradores ou consultores podem criar clientes." });
  }

  const { nome, email, status, whatsapp_numero, consultor_id } = req.body;
  
  try {
    const result = db.prepare(`
      INSERT INTO clientes (empresa_id, nome, email, status, whatsapp_numero, consultor_id, data_criacao)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(empresa_id, nome, email, status || 'ativo', whatsapp_numero || null, consultor_id || null, new Date().toISOString());
    
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err: any) {
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
