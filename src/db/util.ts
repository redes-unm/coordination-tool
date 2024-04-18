import { PostgrestError } from '@supabase/supabase-js';
import { DbError, DbNotFoundError } from './errors';

export function getJoinedCount(joinedData: object[]): number {
  const first = joinedData[0];
  if (!first || !('count' in first) || typeof first.count !== 'number') {
    throw Error(`invalid joined count data: ${joinedData}`);
  }

  return first.count;
}

export function handleError(e: PostgrestError | null): asserts e is null {
  if (!e) {
    return;
  }

  switch (e.code) {
    case 'PGRST116': // no items when requesting single item
    case 'PGRST300': // JWT auth issue
    case 'PGRST301': // JWT auth issue
    case 'PGRST302': // JWT auth issue
      throw new DbNotFoundError();
    default:
      throw new DbError();
  }
}
