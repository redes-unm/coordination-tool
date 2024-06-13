'use client';

import { newDb } from '@/db/client';
import { DbNotFoundError } from '@/db/errors';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

export async function logOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function isLoggedIn() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  return !error && !!data?.user;
}

export type User = {
  id: string,
  email?: string | undefined,
  name?: string | undefined,
};

export async function getUser(): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return null;
  }

  let profile: Profile | undefined;
  try {
    profile = await newDb().getProfile(data.user.id);
  } catch (e: unknown) {
    if (!(e instanceof DbNotFoundError)) {
      throw e;
    }
  }

  return {
    id: data.user.id,
    email: data.user.email,
    name: profile?.name,
  };
}
