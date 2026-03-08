import db from "../db";

interface WhatsAppConfig {
  api_provider: string;
  api_token: string;
  numero_remetente: string;
  webhook_url: string;
}

export async function sendWhatsAppNotification(protocolId: number, messageText: string, isManual: boolean = false) {
  try {
    // 1. Get Protocol and Client Info
    const protocol = db.prepare(`
      SELECT p.*, c.nome as cliente_nome, c.whatsapp_numero, c.whatsapp_notificacoes_ativas
      FROM protocolos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = ?
    `).get(protocolId) as any;

    if (!protocol) return { success: false, error: "Protocol not found" };

    // 2. Check if notifications are enabled for the client
    if (!protocol.whatsapp_notificacoes_ativas && !isManual) {
      return { success: false, error: "WhatsApp notifications disabled for this client" };
    }

    if (!protocol.whatsapp_numero) {
      return { success: false, error: "Client has no WhatsApp number registered" };
    }

    // 3. Get Global WhatsApp Config
    const config = db.prepare(`
      SELECT whatsapp_api_provider, whatsapp_api_token, whatsapp_numero_remetente, whatsapp_webhook_url
      FROM configuracoes_whitelabel
      WHERE empresa_id = ?
    `).get(protocol.empresa_id) as any;

    if (!config || !config.whatsapp_api_token) {
      return { success: false, error: "WhatsApp integration not configured" };
    }

    // 4. Construct Message
    const template = `OperFlow — Atualização do seu atendimento\n\nProtocolo: #${protocol.id}\nStatus: ${protocol.status}\n\nMensagem do consultor:\n${messageText}\n\nAcompanhe o andamento:\nhttps://operflow.app/protocols/${protocol.id}\n\nEquipe OperFlow`;

    // 5. Mock API Call
    console.log(`[WhatsApp Mock] Sending to ${protocol.whatsapp_numero} via ${config.whatsapp_api_provider}`);
    console.log(`[WhatsApp Mock] Message: ${template}`);

    // 6. Record in History (as a system interaction)
    const typeLabel = isManual ? "manual" : "automático";
    db.prepare(`
      INSERT INTO interacoes (protocolo_id, autor_id, autor_tipo, mensagem, visivel_cliente)
      VALUES (?, ?, ?, ?, ?)
    `).run(protocolId, 0, "admin", `Atualização enviada ao cliente via WhatsApp (${typeLabel})`, 1);

    return { success: true };
  } catch (error) {
    console.error("WhatsApp Notification Error:", error);
    return { success: false, error: "Internal error" };
  }
}
