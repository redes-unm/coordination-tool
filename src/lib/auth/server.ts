'use server';

import { newDb } from '@/db/server';
import { createClient } from '@/lib/supabase/server';
import { throwErr } from '../util';

export async function signUp(name: string, email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw error;
  }

  await newDb().insertProfile({ userId: data.user?.id ?? throwErr('no user!'), name });
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

export async function getUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
}
