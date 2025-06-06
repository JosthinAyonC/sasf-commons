import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';

import { ApiError } from './useMutation';

type DownloadFileOptions = {
  url: string;
  queryParams?: Record<string, string | number | boolean>;
  fetchOptions?: RequestInit;
  filename?: string;
  resolveFilenameFromHeader?: boolean;
};

export function useDownloadFile() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading, setLoading] = useState(false);

  const download = useCallback(
    async (options: DownloadFileOptions) => {
      const { url, queryParams, fetchOptions, filename: customFilename, resolveFilenameFromHeader = true } = options;

      setLoading(true);

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

      try {
        // Normalizar headers
        let normalizedHeaders: Record<string, string> = {};
        if (fetchOptions?.headers) {
          if (fetchOptions.headers instanceof Headers) {
            fetchOptions.headers.forEach((value, key) => {
              normalizedHeaders[key] = value;
            });
          } else if (Array.isArray(fetchOptions.headers)) {
            fetchOptions.headers.forEach(([key, value]) => {
              normalizedHeaders[key] = value;
            });
          } else {
            normalizedHeaders = { ...fetchOptions.headers } as Record<string, string>;
          }
        }

        const headers: Record<string, string> = {
          Authorization: token ? `Bearer ${token}` : '',
          ...normalizedHeaders,
        };

        const response = await fetch(fullUrl, {
          ...fetchOptions,
          headers,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw { status: response.status, message: errorData.message, error: errorData } as ApiError;
        }

        const blob = await response.blob();

        let filename = customFilename || 'archivo';

        if (resolveFilenameFromHeader) {
          const contentDisposition = response.headers.get('Content-Disposition');
          const match = contentDisposition?.match(/filename="?(.+?)"?$/);
          if (match) filename = match[1];
        }

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { download, loading };
}
