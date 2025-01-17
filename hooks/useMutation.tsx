import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';

/**
 * Custom hook to perform POST, PUT, or PATCH requests with Redux integration for authorization.
 *
 * @param url The API endpoint to send the request to.
 * @param method The HTTP method to use (e.g., 'POST', 'PUT', 'PATCH').
 * @returns An object containing mutate function, loading, error, and response data.
 */
function useMutation<T, U = Record<string, unknown>>(url: string, method: 'POST' | 'PUT' | 'PATCH') {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Retrieve the token from the Redux store
  const token = useSelector((state: RootState) => state.auth.token);

  const mutate = useCallback(
    async (body: U, headers?: Record<string, string>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
            ...headers,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result: T = await response.json();
        setData(result);
        return result;
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, method, token]
  );

  return { mutate, data, loading, error };
}

export default useMutation;
