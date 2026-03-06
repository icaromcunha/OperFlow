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

router.get("/config", authenticate, (req: any, res) => {
  const { empresa_id } = req.user;
  const categorias = db.prepare("SELECT * FROM categorias WHERE empresa_id = ?").all(empresa_id);
  const prioridades = db.prepare("SELECT * FROM prioridades WHERE empresa_id = ?").all(empresa_id);
  const empresa = db.prepare("SELECT * FROM empresas WHERE id = ?").get(empresa_id);
  res.json({ categorias, prioridades, empresa });
});

export default router;
