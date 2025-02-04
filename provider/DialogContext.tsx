import React, { createContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface DialogContextProps {
  openDialog: (_keyId: string, _value: string, _modalProps?: Record<string, unknown>) => void;
  closeDialog: (_keyId: string) => void;
  getDialogOrder: (_keyId: string) => number;
  getDialogProps: (_keyId: string) => Record<string, unknown> | undefined;
}

export const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOrder, setDialogOrder] = useState<string[]>([]);
  const [modalProps, setModalProps] = useState<Record<string, Record<string, unknown>>>({});

  const openDialog = (keyId: string, value: string, props?: Record<string, unknown>) => {
    const params = new URLSearchParams(searchParams);
    params.set(keyId, value);
    setSearchParams(params);

    setDialogOrder((prevOrder) => [...new Set([...prevOrder, keyId])]);
    setModalProps((prevProps) => ({ ...prevProps, [keyId]: props || {} }));
  };

  const closeDialog = (keyId: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(keyId);
    setSearchParams(params);

    setDialogOrder((prevOrder) => prevOrder.filter((key) => key !== keyId));
    setModalProps((prevProps) => {
      const newProps = { ...prevProps };
      delete newProps[keyId];
      return newProps;
    });
  };

  const getDialogOrder = (keyId: string) => dialogOrder.indexOf(keyId);
  const getDialogProps = (keyId: string) => modalProps[keyId];

  return <DialogContext.Provider value={{ openDialog, closeDialog, getDialogOrder, getDialogProps }}>{children}</DialogContext.Provider>;
};
