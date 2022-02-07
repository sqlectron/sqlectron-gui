import { useEffect, useRef } from 'react';

export const usePrevious = <T>(value: T): T => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current as T;
};
