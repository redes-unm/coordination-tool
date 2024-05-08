import { DbNotFoundError } from '@/db/errors';
import { notFound } from 'next/navigation';
import { GeoJSON, Feature, Geometry } from 'geojson';

// for when you want to throw an error in an expression
export function throwErr(e: string | Error): never {
  if (typeof e === 'string') {
    throw new Error(e);
  }
  throw e;
}

export async function withDbNotFound404<T>(f: Promise<T> | (() => Promise<T>)): Promise<T> {
  try {
    return await (typeof f === 'function' ? f() : f);
  } catch (e) {
    if (e instanceof DbNotFoundError) {
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

export function assertGeoJSONFeature(
  g: GeoJSON,
): asserts g is Feature<Geometry, { id?: string, active?: string }> {
  if (g.type !== 'Feature') {
    throw Error(`expected Feature, got ${g.type}`);
  }

  if (!g.properties || typeof g.properties !== 'object') {
    throw Error('expected non-null properties');
  }
}
