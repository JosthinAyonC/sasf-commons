import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';

interface UseMultiQueryOptions {
  urls: string[];
  options?: RequestInit;
}

/**
 * Este hook es creado con la finalidad de realizar múltiples peticiones a la vez.
 * Ya que el hook useQuery solo permite realizar una petición a la vez.
 */
export const useMultiQuery = ({ urls, options }: UseMultiQueryOptions) => {
  const [results, setResults] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<unknown[]>([]);

  // Retrieve the token from Redux
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    let isCancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      const allResults: unknown[] = [];
      const allErrors: unknown[] = [];

      try {
        await Promise.all(
          urls.map(async (url) => {
            try {
              const response = await fetch(url, {
                ...options,
                headers: {
                  ...options?.headers,
                  Authorization: token ? `Bearer ${token}` : '',
                },
              });

              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }

              const data = await response.json();
              allResults.push(data);
            } catch (error) {
              allErrors.push(error);
            }
          })
        );

        if (!isCancelled) {
          setResults(allResults);
          setErrors(allErrors);
        }
      } catch (error) {
        if (!isCancelled) {
          setErrors((prevErrors) => [...prevErrors, error]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAll();

    return () => {
      isCancelled = true;
    };
  }, [options, token, JSON.stringify(urls)]);

  return { results, loading, errors };
};
