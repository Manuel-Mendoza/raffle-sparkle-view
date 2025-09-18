import { useState, useEffect, useCallback, useRef } from "react";

interface UseLazyDataOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: React.DependencyList;
  immediate?: boolean;
  debounceMs?: number;
}

export function useLazyData<T>({
  fetchFn,
  dependencies = [],
  immediate = true,
  debounceMs = 0,
}: UseLazyDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      if (debounceMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, debounceMs));
      }

      const result = await fetchFn();

      if (!controller.signal.aborted) {
        setData(result);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn, debounceMs, ...dependencies]);

  useEffect(() => {
    if (immediate) {
      if (debounceMs > 0) {
        timeoutRef.current = setTimeout(fetchData, debounceMs);
      } else {
        fetchData();
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, immediate, debounceMs]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
