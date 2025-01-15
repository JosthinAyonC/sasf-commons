import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ModalProviderProps {
  keyId: string;
  content: React.FC<{ value: string | null; keyId: string }>;
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ keyId, content: Content, children }) => {
  const [searchParams] = useSearchParams();
  const [modalValue, setModalValue] = useState<string | null>(null);

  useEffect(() => {
    const param = searchParams.get(keyId);
    setModalValue(param);
  }, [searchParams, keyId]);

  if (!modalValue) return <>{children}</>;

  return (
    <>
      {children}
      <Content value={modalValue} keyId={keyId} />
    </>
  );
};
