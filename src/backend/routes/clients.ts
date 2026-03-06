import express from "express";
import db from "../db";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "ecom-secret-key";

const authenticate = (req: any, res: any, next: any) => {
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
  const clients = db.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM protocolos WHERE cliente_id = c.id AND status != 'concluido') as protocolos_ativos
    FROM clientes c
    WHERE c.empresa_id = ?
  `).all(empresa_id);
  res.json(clients);
});

export default router;
