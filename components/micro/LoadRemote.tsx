import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from '~/config/ErrorBoundary';
import ErrorScreen from '~/utils/ErrorScreen';

interface LoadRemoteProps {
  remoteLoader: () => Promise<{ default: React.ComponentType<unknown> }>;
  loading?: React.ReactNode;
  error?: React.ReactNode | (() => JSX.Element);
}

const LoadRemote: React.FC<LoadRemoteProps> = ({ remoteLoader, loading, error }) => {
  const LazyComponent = lazy(() =>
    remoteLoader().catch(() => ({
      default: () => {
        if (typeof error === 'function') {
          return error();
        }
        return <>{error || <ErrorScreen />}</>;
      },
    }))
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={loading || <div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default LoadRemote;
