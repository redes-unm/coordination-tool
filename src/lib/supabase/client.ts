import { createBrowserClient } from '@supabase/ssr';
import { throwErr } from '../util';

export function createClient() {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? throwErr('missing supabase url');
  const anonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? throwErr('missing supabase anon key');
  return createBrowserClient(url, anonKey);
}
