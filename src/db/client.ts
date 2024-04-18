import { createClient } from '@/lib/supabase/client';
import Db from './db';

export function newDb(): Db {
  return new Db(createClient());
}
