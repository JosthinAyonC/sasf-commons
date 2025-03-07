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
  const [isLoading, setIsLoading] = useState(true); // Se mantiene en true hasta que se complete la carga

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        await loadRemote(remoteUrl, scope); // Cargar el contenedor remoto
        const factory = await window[scope]?.get(module); // Obtener el módulo

        if (isMounted && factory) {
          const Module = factory();
          setRemoteComponent(() => Module.default || Module); // Establecer el componente remoto
        }
      } catch (err) {
        console.error('Error loading remote module:', err);
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false); // Marcar como cargado cuando termine
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

  // Una vez cargado el componente remoto, lo renderizamos
  return <RemoteComponent />;
};

export default LoadRemote;
