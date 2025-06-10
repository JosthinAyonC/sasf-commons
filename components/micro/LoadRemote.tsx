import React, { useEffect, useState } from 'react';
import { loadRemote } from '~/config/loadremote';
import ErrorScreen from '~/utils/ErrorScreen';

import { Loader } from '../ui/Loader';

interface LoadRemoteProps {
  remoteUrl: string; // URL del remoteEntry.js
  scope: string; // Nombre del contenedor remoto (ej: "microapp"). Tiene que coincidir con el name definido en el webpack.config.js del remote.
  module: string; // Módulo expuesto en el remote (ej: "./RemoteComponent")
  loading?: React.ReactNode; // Componente de carga
  error?: React.ReactNode | (() => JSX.Element); // Componente de error
}

interface RemoteContainer {
  get: (_module: string) => Promise<() => { default: React.ComponentType<unknown> }>;
  init: (_shareScope: unknown) => Promise<void>;
}

declare global {
  interface Window {
    [key: string]: RemoteContainer;
  }
}

const remoteComponentCache = new Map<string, React.ComponentType>();

const getCacheKey = (remoteUrl: string, scope: string, module: string) => `${remoteUrl}|${scope}|${module}`;

const LoadRemote: React.FC<LoadRemoteProps> = ({ remoteUrl, scope, module, loading, error, ...props }) => {
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = getCacheKey(remoteUrl, scope, module);

    async function load() {
      try {
        setIsLoading(true);

        // Si ya está en caché, usarlo
        if (remoteComponentCache.has(cacheKey)) {
          if (isMounted) setRemoteComponent(() => remoteComponentCache.get(cacheKey)!);
          return;
        }

        await loadRemote(remoteUrl, scope);
        const factory = await window[scope]?.get(module);

        if (isMounted && factory) {
          const Module = factory();
          const Comp = Module.default || Module;
          remoteComponentCache.set(cacheKey, Comp);
          setRemoteComponent(() => Comp);
        }
      } catch (err) {
        console.error('Error loading remote module:', err);
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [remoteUrl, scope, module]);

  if (hasError) {
    return <>{typeof error === 'function' ? error() : error || <ErrorScreen />}</>;
  }

  // Mientras se esté cargando o no haya componente remoto, se muestra el Loader
  if (isLoading || !RemoteComponent) {
    return <>{loading || <Loader className="text-[var(--secondary)]" />}</>;
  }

  return <RemoteComponent {...props} />;
};

export default LoadRemote;
