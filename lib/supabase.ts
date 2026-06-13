/**
 * Supabase client for Zenti.
 *
 * IMPORTANT: reads URL + anon key from env (EXPO_PUBLIC_*). The session's
 * Supabase MCP is currently pointed at the wrong project, so nothing is
 * hardcoded — set these in `.env` (and Vercel/EAS) once the real Zenti
 * project is connected. See docs/brainstorm-notes.md "Market reality".
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured && __DEV__) {
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY not set — ' +
      'auth & data calls will fail until the real Zenti project is connected.',
  );
}

export const supabase = createClient(url || 'http://localhost', anonKey || 'anon', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
