import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;
const redirectTo = import.meta.env.VITE_REDIRECT_URL;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    redirectTo,
  },
});