import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://eirxrizprdhrjdqgslsg.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_LtbUGUy9W8jr6s4pyScZEw_AjxVA-Mp';

console.log("--- Supabase Diagnostic ---");
console.log("URL:", supabaseUrl);
console.log("Key length:", supabaseAnonKey.length);
console.log("Key starts with:", supabaseAnonKey.substring(0, 15));

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
  try {
    console.log("Testing connection...");
    const { data, error } = await supabase.from('empresas').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error("❌ Supabase Error:", error.message);
      console.error("Error Code:", error.code);
      console.error("Error Details:", error.details);
      console.error("Error Hint:", error.hint);
      
      if (error.message.includes('relation "empresas" does not exist')) {
        console.log("\n💡 DICA: As tabelas ainda não foram criadas no Supabase. Você precisa executar o script SQL no painel do Supabase.");
      } else if (error.code === 'PGRST301' || error.message.includes('JWT')) {
        console.log("\n💡 DICA: A chave API (Anon Key) parece estar incorreta ou expirada.");
      }
    } else {
      console.log("✅ Conexão bem-sucedida!");
      console.log("Total de empresas encontradas:", data);
    }
  } catch (err: any) {
    console.error("💥 Unexpected Error:", err.message);
  }
}

diagnose();
