import { NotFoundError } from '@/db/errors';
import { notFound } from 'next/navigation';

// for when you want to throw an error in an expression
export function throwErr(e: string | Error): never {
  if (typeof e === 'string') {
    throw new Error(e);
  }
  throw e;
}

export async function withDbNotFound404<T>(f: () => Promise<T>): Promise<T> {
  try {
    return await f();
  } catch (e) {
    if (e instanceof NotFoundError) {
      notFound();
    }

    throw e;
  }
}

export function toLngLat(a: number[]): [number, number] {
  if (a[0] === undefined || a[1] === undefined) {
    throw new Error('not enough coordinates');
  }

  return [a[0], a[1]];
}
