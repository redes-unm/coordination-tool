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

export function decodePoint(p: unknown): [number, number] {
  if (typeof p !== 'string' || !/^\(-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?\)$/.test(p)) {
    throw Error(`invalid point: expected (x,y) got ${p}`);
  }

  const [x, y] = p.substring(1, p.length - 2).split(',').map(Number);
  if (x === undefined || y === undefined) {
    throw Error(`invalid point: expected (x,y) got ${p}`);
  }

  return [x, y];
}

export function encodePoint(p: [number, number]): string {
  return `(${p[0]}, ${p[1]})`;
}
