import express from "express";
import db from "../db";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "ecom-secret-key";

// Middleware to verify token
export const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/", authenticate, (req: any, res) => {
  const { empresa_id } = req.user;
  const protocols = db.prepare(`
    SELECT p.*, c.nome as cliente_nome, cat.nome as categoria_nome, prio.nome as prioridade_nome, u.nome as responsavel_nome
    FROM protocolos p
    JOIN clientes c ON p.cliente_id = c.id
    LEFT JOIN categorias cat ON p.categoria_id = cat.id
    LEFT JOIN prioridades prio ON p.prioridade_id = prio.id
    LEFT JOIN usuarios u ON p.responsavel_id = u.id
    WHERE p.empresa_id = ?
    ORDER BY p.data_criacao DESC
  `).all(empresa_id);
  res.json(protocols);
});

router.get("/stats", authenticate, (req: any, res) => {
  const { empresa_id } = req.user;
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'aberto' THEN 1 ELSE 0 END) as abertos,
      SUM(CASE WHEN status = 'em atendimento' THEN 1 ELSE 0 END) as em_atendimento,
      SUM(CASE WHEN status = 'concluido' THEN 1 ELSE 0 END) as concluidos
    FROM protocolos
    WHERE empresa_id = ?
  `).get(empresa_id);
  res.json(stats);
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

router.post("/:id/interactions", authenticate, (req: any, res) => {
  const { id: protocolo_id } = req.params;
  const { mensagem, visivel_cliente } = req.body;
  const { id: autor_id, type: autor_tipo } = req.user;

  db.prepare(`
    INSERT INTO interacoes (protocolo_id, autor_id, autor_tipo, mensagem, visivel_cliente)
    VALUES (?, ?, ?, ?, ?)
  `).run(protocolo_id, autor_id, autor_tipo, mensagem, visivel_cliente ? 1 : 0);

  res.json({ success: true });
});

router.patch("/:id/status", authenticate, (req: any, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.prepare("UPDATE protocolos SET status = ? WHERE id = ?").run(status, id);
  res.json({ success: true });
});

export default router;
