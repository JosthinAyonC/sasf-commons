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

const LoadRemote: React.FC<LoadRemoteProps> = ({ remoteUrl, scope, module, loading, error }) => {
  const [RemoteComponent, setRemoteComponent] = useState<React.ComponentType | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        // Carga dinámica del remoteEntry.js
        await loadRemote(remoteUrl, scope);

        // Obtiene el módulo expuesto desde el contenedor remoto
        const factory = await window[scope]?.get(module);

        if (isMounted && factory) {
          const Module = factory(); // Obtiene el módulo dinámico
          setRemoteComponent(() => Module.default || Module); // Usa el componente exportado por default o el módulo completo
        }
      } catch (err) {
        console.error('Error loading remote module:', err);
        if (isMounted) setHasError(true);
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

  if (!RemoteComponent) {
    return <>{loading || <Loader className="text-[var(--secondary)]" />}</>;
  }

  return <RemoteComponent />;
};

export default LoadRemote;
