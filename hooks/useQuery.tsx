import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';

import { ApiError } from './useMutation';

/**
 * Custom hook to perform fetch requests with Redux integration for authorization and flexible query params.
 *
 * @param url The API endpoint to fetch data from.
 * @param options Optional fetch options (e.g., method, headers, body).
 * @param queryParams Optional query parameters to append to the URL.
 * @param autoFetch Whether the request should run automatically when the component mounts.
 * @returns An object containing loading, error, data, and a refetch function.
 */
export function useQuery<T>(url: string, options?: RequestInit, queryParams?: Record<string, string | number | boolean>, autoFetch: boolean = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  // Retrieve the token from the Redux store
  const token = useSelector((state: RootState) => state.auth.token);

  // Construct the URL with query parameters
  const buildUrlWithParams = (baseUrl: string, params?: Record<string, string | number | boolean>): string => {
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
  };

  const fullUrl = buildUrlWithParams(url, queryParams);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw { status: response.status, message: errorData.message, error: errorData } as ApiError;
      }

      const result: T = await response.json();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [fullUrl, options, token]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

export default useQuery;
