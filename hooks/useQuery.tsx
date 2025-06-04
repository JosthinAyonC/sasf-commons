import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { cacheManager } from '~/config/CacheManager';
import { RootState } from '~/store';

import { ApiError } from './useMutation';

type UseQueryOptions = {
  url: string;
  options?: RequestInit;
  queryParams?: Record<string, string | number | boolean>;
  autoFetch?: boolean;
  cachePolicy?: 'cache-first' | 'network-first';
};

/**
 * Custom hook to perform fetch requests with Redux integration for authorization and flexible query params.
 *
 * Puede usarse de dos formas:
 *
 * - Clásica (parámetros posicionales):
 *   useQuery(url, options?, queryParams?, autoFetch?, cachePolicy?)
 *
 * - Con objeto de opciones:
 *   useQuery({ url, options?, queryParams?, autoFetch?, cachePolicy? })
 */
export function useQuery<T>(
  _url: string,
  _options?: RequestInit,
  _queryParams?: Record<string, string | number | boolean>,
  _autoFetch?: boolean,
  _cachePolicy?: 'cache-first' | 'network-first'
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (_newUrl?: string, _forceNetwork?: boolean) => void;
};

export function useQuery<T>(_opts: UseQueryOptions): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (_newUrl?: string, _forceNetwork?: boolean) => void;
};

/**
 * Custom hook to perform fetch requests with Redux integration for authorization and flexible query params.
 *
 * @param url The API endpoint to fetch data from.
 * @param options Optional fetch options (e.g., method, headers, body).
 * @param queryParams Optional query parameters to append to the URL.
 * @param autoFetch Whether the request should run automatically when the component mounts.
 * @returns An object containing loading, error, data, and a refetch function.
 */
export function useQuery<T>(
  urlOrOpts: string | UseQueryOptions,
  options?: RequestInit,
  queryParams?: Record<string, string | number | boolean>,
  autoFetch: boolean = true,
  cachePolicy: 'cache-first' | 'network-first' = 'cache-first'
) {
  // Variables internas para usar en el hook
  let url: string;
  let opts: RequestInit | undefined;
  let qParams: Record<string, string | number | boolean> | undefined;
  let autoFetchLocal: boolean = true;
  let cachePolicyLocal: 'cache-first' | 'network-first' = 'cache-first';

  if (typeof urlOrOpts === 'string') {
    // Firma clásica
    url = urlOrOpts;
    opts = options;
    qParams = queryParams;
    autoFetchLocal = autoFetch ?? true;
    cachePolicyLocal = cachePolicy ?? 'cache-first';
  } else {
    // Firma con objeto de opciones
    url = urlOrOpts.url;
    opts = urlOrOpts.options;
    qParams = urlOrOpts.queryParams;
    autoFetchLocal = urlOrOpts.autoFetch ?? true;
    cachePolicyLocal = urlOrOpts.cachePolicy ?? 'cache-first';
  }

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetchLocal);
  const [error, setError] = useState<string | null>(null);
  const [initialUrl, setInitialUrl] = useState<string>(url);

  // Token desde Redux
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    // Si la URL cambia, reiniciamos el estado
    if (url !== initialUrl) {
      setInitialUrl(url);
      setData(null);
      setLoading(autoFetchLocal);
      setError(null);
    }
  }, [url, initialUrl, autoFetchLocal]);

  // Construir URL con query params
  const buildUrlWithParams = useCallback((baseUrl: string, params?: Record<string, string | number | boolean>): string => {
    if (!params) return baseUrl;
    const queryString = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();
    return `${baseUrl}?${queryString}`;
  }, []);

  const fullUrl = useMemo(() => buildUrlWithParams(initialUrl, qParams), [initialUrl, qParams, buildUrlWithParams]);

  const fetchDataFromApi = useCallback(async (): Promise<T | null> => {
    try {
      const response = await fetch(fullUrl, {
        ...opts,
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          ...opts?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw { status: response.status, message: errorData.message, error: errorData } as ApiError;
      }

      const result: T = await response.json();
      setData(result);
      cacheManager.set(fullUrl, result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fullUrl, opts, token]);

  const fetchData = useCallback(
    async (forceNetwork = false) => {
      setLoading(true);
      setError(null);

      if (cachePolicyLocal === 'network-first' || forceNetwork) {
        // Intentamos obtener datos desde la red primero
        const networkData = await fetchDataFromApi();
        if (networkData) {
          cacheManager.set(fullUrl, networkData);
          setData(networkData);
        }
      } else {
        const cachedData = cacheManager.get(fullUrl);
        if (cachedData) {
          setData(cachedData as T);
          setLoading(false);
        } else {
          await fetchDataFromApi();
        }
      }
    },
    [cachePolicyLocal, fullUrl, fetchDataFromApi]
  );

  useEffect(() => {
    if (autoFetchLocal) {
      fetchData();
    }
  }, [autoFetchLocal]);

  const refetch = useCallback(
    (newUrl = '', forceNetwork = false) => {
      if (newUrl) {
        setInitialUrl(newUrl);
      }
      setLoading(true);
      setError(null);
      fetchData(forceNetwork);
    },
    [fetchData]
  );

  return { data, loading, error, refetch };
}
