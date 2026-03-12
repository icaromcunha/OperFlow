import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://eirxrizprdhrjdqgslsg.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_LtbUGUy9W8jr6s4pyScZEw_AjxVA-Mp';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testWrite() {
  console.log("Testing WRITE access to 'empresas'...");
  
  const testId = 999999;
  const { error: insertError } = await supabase.from('empresas').upsert({
    id: testId,
    nome: 'Teste de Conexão',
    cnpj: '00.000.000/0000-00'
  });

  if (insertError) {
    console.error("❌ Write Error:", insertError.message);
    console.error("Details:", insertError.details);
    console.error("Hint:", insertError.hint);
  } else {
    console.log("✅ Write successful!");
    
    // Cleanup
    const { error: deleteError } = await supabase.from('empresas').delete().eq('id', testId);
    if (deleteError) console.error("Cleanup error:", deleteError.message);
    else console.log("✅ Cleanup successful!");
  }
}

testWrite();
