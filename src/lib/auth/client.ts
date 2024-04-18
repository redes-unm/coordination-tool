'use client';

import { createClient } from '@/lib/supabase/client';

export async function logOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function isLoggedIn() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }

  return !!data?.session;
}
