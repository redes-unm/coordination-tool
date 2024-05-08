'use server';

import { createClient } from '@/lib/supabase/server';

export async function signUp(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw error;
  }
}

export async function logIn(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
}

export async function isLoggedIn() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  return !error && !!data?.user;
}
