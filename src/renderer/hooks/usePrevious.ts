import { useEffect, useRef } from 'react';

export const usePrevious = <T>(value: T, initialValue?: T): T => {
  const ref = useRef<T | null>(initialValue || null);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current as T;
};
