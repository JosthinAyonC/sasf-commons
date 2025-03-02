import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';

export interface ApiError {
  status: number;
  message: string;
  error: {
    timestamp?: string;
    message?: string;
    details?: string;
  };
}

/**
 * Custom hook to perform POST, PUT, or PATCH requests with Redux integration for authorization.
 *
 * @param url The API endpoint to send the request to.
 * @param method The HTTP method to use (e.g., 'POST', 'PUT', 'PATCH').
 * @returns A function `mutate` to execute the request.
 */
export function useMutation<T, U = Record<string, unknown> | Record<string, unknown>[]>(url: string, method: 'POST' | 'PUT' | 'PATCH') {
  const [loading, setLoading] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const mutate = useCallback(
    async (body: U | URLSearchParams, headers?: Record<string, string>): Promise<T | null> => {
      setLoading(true);
      try {
        const isFormUrlEncoded = body instanceof URLSearchParams;
        const isFormData = body instanceof FormData;

        const response = await fetch(url, {
          method,
          headers: {
            ...(isFormData ? {} : isFormUrlEncoded ? { 'Content-Type': 'application/x-www-form-urlencoded' } : { 'Content-Type': 'application/json' }),
            Authorization: token ? `Bearer ${token}` : '',
            ...headers,
          },
          body: isFormData ? (body as FormData) : isFormUrlEncoded ? body.toString() : JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw { status: response.status, message: errorData.message, error: errorData } as ApiError;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method, token]
  );

  return { mutate, loading };
}
