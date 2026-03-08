import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/config", authenticate, (req: any, res) => {
  const { empresa_id } = req.user;
  const categorias = db.prepare("SELECT * FROM categorias WHERE empresa_id = ?").all(empresa_id);
  const prioridades = db.prepare("SELECT * FROM prioridades WHERE empresa_id = ?").all(empresa_id);
  const empresa = db.prepare("SELECT * FROM empresas WHERE id = ?").get(empresa_id);
  res.json({ categorias, prioridades, empresa });
});

export default router;
