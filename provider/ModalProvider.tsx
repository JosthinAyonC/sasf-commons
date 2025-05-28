import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDialog } from '~/hooks';

// Estas keys son keys reservadas
type ForbiddenKeys = 'step' | 'tab';

type KeyId<K extends string> = K extends ForbiddenKeys ? never : K;
interface ModalProviderProps<K extends string> {
  keyId: KeyId<K>;
  content: React.FC<{ value: string | null; keyId: string; modalProps?: Record<string, unknown> }>;
  children: React.ReactNode;
}

export const ModalProvider = <K extends string>({ keyId, content: Content, children }: ModalProviderProps<K>) => {
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
