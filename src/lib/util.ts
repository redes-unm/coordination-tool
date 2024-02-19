import { NotFoundError } from '@/db/errors';
import { notFound } from 'next/navigation';

// for when you want to throw an error in an expression
export function throwErr(e: Error): never {
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
