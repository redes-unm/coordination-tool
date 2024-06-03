import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function useSearchParam(name: string): [
  string | null,
  (value: string | null) => void,
] {
  const router = useRouter();
  const params = useSearchParams();

  return [
    params.get(name),
    useCallback((val) => {
      const mutableParams = new URLSearchParams(params);
      if (val == null) {
        mutableParams.delete(name);
      } else {
        mutableParams.set(name, val);
      }
      router.push(`?${mutableParams.toString()}`);
    }, [name, router, params]),
  ];
}
