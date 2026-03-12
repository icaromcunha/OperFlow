import express from "express";
import db from "../db";
import { supabase, isSupabaseEnabled } from "../supabase";

const router = express.Router();

// Validate Supabase connection
router.get("/validate-supabase", async (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://eirxrizprdhrjdqgslsg.supabase.co';
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_LtbUGUy9W8jr6s4pyScZEw_AjxVA-Mp';

  if (!supabaseAnonKey) {
    return res.json({ 
      enabled: false, 
      message: "Falta a SUPABASE_ANON_KEY. Por favor, configure-a no menu Settings do AI Studio." 
    });
  }

  if (!isSupabaseEnabled) {
    return res.json({ 
      enabled: false, 
      message: "Configuração do Supabase inválida. Verifique a URL e a Chave Anon." 
    });
  }

  try {
    const requiredTables = [
      'empresas', 'usuarios', 'clientes', 'categorias', 
      'prioridades', 'protocolos', 'interacoes', 'canais', 
      'cliente_evolucao', 'insights', 'configuracoes_whitelabel', 
      'produtos', 'protocolo_produtos', 'pareceres'
    ];

    const missingTables = [];
    
    // Check tables one by one or in parallel
    for (const tableName of requiredTables) {
      const { error } = await supabase.from(tableName).select('id').limit(1);
      if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
        missingTables.push(tableName);
      }
    }

    if (missingTables.length > 0) {
      return res.json({ 
        enabled: true, 
        message: `Conectado, mas faltam ${missingTables.length} tabelas: ${missingTables.join(', ')}. Por favor, execute o script SQL no Supabase.` 
      });
    }
    
    res.json({ enabled: true, message: "Conexão e tabelas validadas com sucesso!" });
  } catch (error: any) {
    res.json({ enabled: false, message: `Erro de conexão: ${error.message}` });
  }
});

// Sync SQLite data to Supabase
router.post("/sync-supabase", async (req, res) => {
  if (!isSupabaseEnabled) {
    return res.status(400).json({ error: "Supabase não está configurado." });
  }

  try {
    console.log("Starting full Supabase sync...");
    
    const tables = [
      { name: 'empresas', query: "SELECT * FROM empresas" },
      { name: 'usuarios', query: "SELECT * FROM usuarios" },
      { 
        name: 'clientes', 
        query: "SELECT * FROM clientes",
        transform: (c: any) => ({ ...c, whatsapp_notificacoes_ativas: !!c.whatsapp_notificacoes_ativas })
      },
      { name: 'categorias', query: "SELECT * FROM categorias" },
      { name: 'prioridades', query: "SELECT * FROM prioridades" },
      { name: 'protocolos', query: "SELECT * FROM protocolos" },
      { 
        name: 'interacoes', 
        query: "SELECT * FROM interacoes",
        transform: (i: any) => ({ ...i, visivel_cliente: !!i.visivel_cliente })
      },
      { name: 'canais', query: "SELECT * FROM canais" },
      { 
        name: 'cliente_evolucao', 
        query: "SELECT * FROM cliente_evolucao",
        transform: (e: any) => ({ ...e, visivel_cliente: !!e.visivel_cliente })
      },
      { 
        name: 'insights', 
        query: "SELECT * FROM insights",
        transform: (i: any) => ({ ...i, visivel_cliente: !!i.visivel_cliente })
      },
      { name: 'configuracoes_whitelabel', query: "SELECT * FROM configuracoes_whitelabel" },
      { name: 'produtos', query: "SELECT * FROM produtos" },
      { name: 'protocolo_produtos', query: "SELECT * FROM protocolo_produtos" },
      { name: 'pareceres', query: "SELECT * FROM pareceres" }
    ];

    for (const table of tables) {
      try {
        const data = db.prepare(table.query).all() as any[];
        console.log(`Syncing ${table.name}: found ${data.length} rows in SQLite`);
        
        if (data.length > 0) {
          const finalData = table.transform ? data.map(table.transform) : data;
          const { error } = await supabase.from(table.name).upsert(finalData);
          
          if (error) {
            console.error(`❌ Error in table ${table.name}:`, error);
            return res.status(500).json({ 
              error: `Erro na tabela ${table.name}: ${error.message}`,
              details: error.details,
              hint: error.hint
            });
          }
          console.log(`✅ Table ${table.name} synced successfully`);
        }
      } catch (tableError: any) {
        console.error(`💥 Critical error syncing ${table.name}:`, tableError);
        return res.status(500).json({ error: `Erro fatal na tabela ${table.name}: ${tableError.message}` });
      }
    }

    res.json({ success: true, message: "Todos os dados foram sincronizados com sucesso!" });
  } catch (error: any) {
    console.error("Sync error:", error);
    res.status(500).json({ error: `Erro na sincronização: ${error.message}` });
  }
});

// Get white-label config by company ID
router.get("/:empresaId", async (req, res) => {
  try {
    const { empresaId } = req.params;

    // Try Supabase first if enabled
    if (isSupabaseEnabled) {
      const { data: sbConfig, error } = await supabase
        .from('configuracoes_whitelabel')
        .select('*')
        .eq('empresa_id', empresaId)
        .single();
      
      if (sbConfig && !error) {
        return res.json(sbConfig);
      }
    }

    // Fallback to SQLite
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
router.patch("/:empresaId", async (req, res) => {
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
    
    // Update SQLite
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

    // Sync to Supabase if enabled
    if (isSupabaseEnabled) {
      const configData = {
        empresa_id: parseInt(empresaId),
        nome_sistema,
        cor_primaria,
        cor_secundaria,
        whatsapp_api_provider,
        whatsapp_api_token,
        whatsapp_numero_remetente,
        whatsapp_webhook_url
      };
      await supabase.from('configuracoes_whitelabel').upsert(configData);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar configuração" });
  }
});

export default router;
