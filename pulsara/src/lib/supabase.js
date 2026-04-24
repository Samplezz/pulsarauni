import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured =
  Boolean(supabaseUrl) &&
  !supabaseUrl.includes('YOUR_PROJECT_ID') &&
  Boolean(supabaseAnonKey) &&
  !supabaseAnonKey.includes('YOUR_ANON_KEY');

if (!isConfigured && typeof window !== 'undefined') {
  console.warn('[Pulsara] Supabase env vars not set — running in localStorage-only mode.');
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export { isConfigured };
