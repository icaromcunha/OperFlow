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

// Update white-label config
router.patch("/:empresaId", (req, res) => {
  try {
    const { empresaId } = req.params;
    const { 
      nome_sistema, 
      cor_primaria, 
      cor_secundaria,
      whatsapp_api_provider,
      whatsapp_api_token,
      whatsapp_numero_remetente,
      whatsapp_webhook_url
    } = req.body;
    
    const exists = db.prepare("SELECT id FROM configuracoes_whitelabel WHERE empresa_id = ?").get(empresaId);
    
    if (exists) {
      db.prepare(`
        UPDATE configuracoes_whitelabel 
        SET nome_sistema = ?, cor_primaria = ?, cor_secundaria = ?,
            whatsapp_api_provider = ?, whatsapp_api_token = ?, 
            whatsapp_numero_remetente = ?, whatsapp_webhook_url = ?
        WHERE empresa_id = ?
      `).run(
        nome_sistema, cor_primaria, cor_secundaria, 
        whatsapp_api_provider, whatsapp_api_token, 
        whatsapp_numero_remetente, whatsapp_webhook_url,
        empresaId
      );
    } else {
      db.prepare(`
        INSERT INTO configuracoes_whitelabel (
          empresa_id, nome_sistema, cor_primaria, cor_secundaria,
          whatsapp_api_provider, whatsapp_api_token, 
          whatsapp_numero_remetente, whatsapp_webhook_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        empresaId, nome_sistema, cor_primaria, cor_secundaria,
        whatsapp_api_provider, whatsapp_api_token, 
        whatsapp_numero_remetente, whatsapp_webhook_url
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar configuração" });
  }
});

export default router;
