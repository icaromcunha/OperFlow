import express from "express";
import db from "../db";

const router = express.Router();

// Get white-label config by company ID
router.get("/:empresaId", (req, res) => {
  try {
    const { empresaId } = req.params;
    const config = db.prepare("SELECT * FROM configuracoes_whitelabel WHERE empresa_id = ?").get(empresaId);
    
    if (!config) {
      return res.status(404).json({ error: "Configuração não encontrada" });
    }
    
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar configuração" });
  }
});

export default router;
