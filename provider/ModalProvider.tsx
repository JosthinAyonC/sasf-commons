import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDialog } from '~/hooks';

interface ModalProviderProps {
  keyId: string;
  content: React.FC<{ value: string | null; keyId: string; modalProps?: Record<string, unknown> }>;
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ keyId, content: Content, children }) => {
  const [searchParams] = useSearchParams();
  const { getDialogProps } = useDialog();
  const [modalValue, setModalValue] = useState<string | null>(null);

  useEffect(() => {
    setModalValue(searchParams.get(keyId));
  }, [searchParams, keyId]);

  const modalProps = getDialogProps(keyId);

  if (!modalValue) return <>{children}</>;

  return (
    <>
      {children}
      <Content value={modalValue} keyId={keyId} modalProps={modalProps} />
    </>
  );
};
