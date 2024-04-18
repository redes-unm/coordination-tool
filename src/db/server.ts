import { createClient } from '@/lib/supabase/server';
import Db from './db';

export function newDb(): Db {
  return new Db(createClient());
}
