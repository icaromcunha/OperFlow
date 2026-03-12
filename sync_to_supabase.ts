import Database from "better-sqlite3";
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const db = new Database("database.sqlite");

const supabaseUrl = process.env.SUPABASE_URL || 'https://eirxrizprdhrjdqgslsg.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_LtbUGUy9W8jr6s4pyScZEw_AjxVA-Mp';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncAll() {
  console.log("Iniciando sincronização completa de dados...");
  
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
      if (data.length > 0) {
        console.log(`Sincronizando ${table.name}: ${data.length} registros...`);
        const finalData = table.transform ? data.map(table.transform) : data;
        const { error } = await supabase.from(table.name).upsert(finalData);
        if (error) {
          console.error(`❌ Erro em ${table.name}:`, error.message);
        } else {
          console.log(`✅ ${table.name} sincronizado.`);
        }
      }
    } catch (err: any) {
      console.error(`💥 Erro fatal em ${table.name}:`, err.message);
    }
  }

  console.log("\n✅ Sincronização completa finalizada!");
}

syncAll();
