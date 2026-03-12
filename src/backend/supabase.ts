import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://eirxrizprdhrjdqgslsg.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_LtbUGUy9W8jr6s4pyScZEw_AjxVA-Mp';

export const isSupabaseEnabled = !!(supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey);

if (!isSupabaseEnabled) {
  if (!supabaseAnonKey) {
    console.warn('⚠️ Supabase Anon Key is missing. Please set SUPABASE_ANON_KEY in environment variables.');
  } else {
    console.warn('⚠️ Supabase URL is invalid.');
  }
} else {
  console.log('✅ Supabase integration initialized with URL:', supabaseUrl);
}

// Only create the client if we have a valid URL to prevent the "Invalid supabaseUrl" error
export const supabase = isSupabaseEnabled 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : (null as any);
