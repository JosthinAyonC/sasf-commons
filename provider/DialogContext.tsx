import React, { createContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface DialogContextProps {
  openDialog: (_keyId: string, _value?: string, _modalProps?: Record<string, unknown>) => void;
  closeDialog: (_keyId: string) => void;
  getDialogOrder: (_keyId: string) => number;
  getDialogProps: (_keyId: string) => Record<string, unknown> | undefined;
  getTopDialogId: () => string | undefined;
}

export const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOrder, setDialogOrder] = useState<string[]>([]);
  const [modalProps, setModalProps] = useState<Record<string, Record<string, unknown>>>({});

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const storedDialogs = JSON.parse(localStorage.getItem('dialogs') || '{}');
    setModalProps(storedDialogs);
  }, []);

  const openDialog = (keyId: string, value?: string, props?: Record<string, unknown>) => {
    const dialogValue = value || 'open';
    const params = new URLSearchParams(searchParams);
    params.set(keyId, dialogValue);
    setSearchParams(params);

    setDialogOrder((prevOrder) => [...new Set([...prevOrder, keyId])]);

    setModalProps((prevProps) => {
      const updatedProps = { ...prevProps, [keyId]: { uuid: dialogValue, ...props } };
      localStorage.setItem('dialogs', JSON.stringify(updatedProps));
      return updatedProps;
    });
  };

  const closeDialog = (keyId: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(keyId);
    setSearchParams(params);

    setDialogOrder((prevOrder) => prevOrder.filter((key) => key !== keyId));

    setModalProps((prevProps) => {
      const newProps = { ...prevProps };
      delete newProps[keyId];
      localStorage.setItem('dialogs', JSON.stringify(newProps));
      return newProps;
    });
  };

  const getDialogOrder = (keyId: string) => dialogOrder.indexOf(keyId);
  const getDialogProps = (keyId: string) => modalProps[keyId];
  const getTopDialogId = () => {
    return dialogOrder[dialogOrder.length - 1];
  };

  return <DialogContext.Provider value={{ openDialog, closeDialog, getDialogOrder, getDialogProps, getTopDialogId }}>{children}</DialogContext.Provider>;
};
