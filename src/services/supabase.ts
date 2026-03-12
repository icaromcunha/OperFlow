import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eirxrizprdhrjdqgslsg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_LtbUGUy9W8jr6s4pyScZEw_AjxVA-Mp';

export const isSupabaseEnabled = !!(supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey);

export const supabase = isSupabaseEnabled 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : (null as any);
