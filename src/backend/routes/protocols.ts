import express from "express";
import db from "../db";
import { sendWhatsAppNotification } from "../services/whatsapp";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, (req: any, res) => {
  const { empresa_id, id: userId, perfil } = req.user;
  
  let query = `
    SELECT p.*, c.nome as cliente_nome, cat.nome as categoria_nome, prio.nome as prioridade_nome, u.nome as responsavel_nome
    FROM protocolos p
    JOIN clientes c ON p.cliente_id = c.id
    LEFT JOIN categorias cat ON p.categoria_id = cat.id
    LEFT JOIN prioridades prio ON p.prioridade_id = prio.id
    LEFT JOIN usuarios u ON p.responsavel_id = u.id
    WHERE p.empresa_id = ?
  `;
  
  let params = [empresa_id];
  
  if (perfil === 'consultor') {
    query += " AND c.consultor_id = ?";
    params.push(userId);
  }
  
  query += " ORDER BY p.data_criacao DESC";
  
  const protocols = db.prepare(query).all(...params);
  res.json(protocols);
});

router.get("/stats", authenticate, (req: any, res) => {
  const { empresa_id, id: userId, perfil } = req.user;
  
  let query = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'aberto' THEN 1 ELSE 0 END) as abertos,
      SUM(CASE WHEN status = 'em atendimento' THEN 1 ELSE 0 END) as em_atendimento,
      SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) as concluidos
    FROM protocolos p
    JOIN clientes c ON p.cliente_id = c.id
    WHERE p.empresa_id = ?
  `;
  
  let params = [empresa_id];
  
  if (perfil === 'consultor') {
    query += " AND c.consultor_id = ?";
    params.push(userId);
  }
  
  const stats = db.prepare(query).get(...params);
  res.json(stats);
});

router.get("/stats/detailed", authenticate, (req: any, res) => {
  const { empresa_id, id: userId, perfil } = req.user;
  
  // Simplified avg response time calculation: 
  // Average time between protocol creation and first interaction by an admin
  let query = `
    SELECT AVG(JULIANDAY(i.data_envio) - JULIANDAY(p.data_criacao)) * 24 as avg_hours
    FROM protocolos p
    JOIN interacoes i ON p.id = i.protocolo_id
    JOIN clientes c ON p.cliente_id = c.id
    WHERE p.empresa_id = ? AND i.autor_tipo = 'admin'
    AND i.id = (SELECT MIN(id) FROM interacoes WHERE protocolo_id = p.id AND autor_tipo = 'admin')
  `;
  
  let params = [empresa_id];
  if (perfil === 'consultor') {
    query += " AND c.consultor_id = ?";
    params.push(userId);
  }

  const avgResponse = db.prepare(query).get(...params) as any;

  res.json({
    avg_hours: avgResponse?.avg_hours || 0
  });
});

router.get("/:id", authenticate, (req: any, res) => {
  const { id } = req.params;
  const protocol = db.prepare(`
    SELECT p.*, c.nome as cliente_nome, c.email as cliente_email, cat.nome as categoria_nome, prio.nome as prioridade_nome, u.nome as responsavel_nome
    FROM protocolos p
    JOIN clientes c ON p.cliente_id = c.id
    LEFT JOIN categorias cat ON p.categoria_id = cat.id
    LEFT JOIN prioridades prio ON p.prioridade_id = prio.id
    LEFT JOIN usuarios u ON p.responsavel_id = u.id
    WHERE p.id = ?
  `).get(id);

  const interactions = db.prepare(`
    SELECT i.*, 
      CASE WHEN autor_tipo = 'admin' THEN u.nome ELSE c.nome END as autor_nome
    FROM interacoes i
    LEFT JOIN usuarios u ON i.autor_id = u.id AND i.autor_tipo = 'admin'
    LEFT JOIN clientes c ON i.autor_id = c.id AND i.autor_tipo = 'cliente'
    WHERE i.protocolo_id = ?
    ORDER BY i.data_envio ASC
  `).all(id);

  res.json({ ...protocol, interactions });
});

router.post("/", authenticate, (req: any, res) => {
  const { titulo, descricao, categoria_id, prioridade_id } = req.body;
  const { id: cliente_id, empresa_id } = req.user;

  const result = db.prepare(`
    INSERT INTO protocolos (empresa_id, cliente_id, titulo, descricao, categoria_id, prioridade_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(empresa_id, cliente_id, titulo, descricao, categoria_id, prioridade_id);

  res.json({ id: result.lastInsertRowid });
});

router.post("/:id/interactions", authenticate, async (req: any, res) => {
  const { id: protocolo_id } = req.params;
  const { mensagem, visivel_cliente, send_whatsapp } = req.body;
  const { id: autor_id, type: autor_tipo } = req.user;

  db.prepare(`
    INSERT INTO interacoes (protocolo_id, autor_id, autor_tipo, mensagem, visivel_cliente)
    VALUES (?, ?, ?, ?, ?)
  `).run(protocolo_id, autor_id, autor_tipo, mensagem, visivel_cliente ? 1 : 0);

  // Trigger WhatsApp notification if admin
  if (autor_tipo === 'admin' && visivel_cliente) {
    // Automatic or manual send
    await sendWhatsAppNotification(Number(protocolo_id), mensagem, send_whatsapp);
  }

  res.json({ success: true });
});

router.patch("/:id/status", authenticate, async (req: any, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { id: autor_id, type: autor_tipo } = req.user;

  db.prepare("UPDATE protocolos SET status = ? WHERE id = ?").run(status, id);

  // Record status change in history
  if (autor_tipo === 'admin') {
    const msg = `Status alterado para: ${status}`;
    db.prepare(`
      INSERT INTO interacoes (protocolo_id, autor_id, autor_tipo, mensagem, visivel_cliente)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, autor_id, autor_tipo, msg, 1);
    
    // Trigger automatic WhatsApp notification for status change
    await sendWhatsAppNotification(Number(id), msg, false);
  }

  res.json({ success: true });
});

export default router;
