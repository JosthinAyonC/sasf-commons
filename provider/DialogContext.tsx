import React, { createContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface DialogContextProps {
  openDialog: (_keyId: string, _value: string) => void;
  closeDialog: (_keyId: string) => void;
  getDialogOrder: (_keyId: string) => number;
}

export const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOrder, setDialogOrder] = useState<string[]>([]);

  const openDialog = (keyId: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(keyId, value);
    setSearchParams(params);

    setDialogOrder((prevOrder) => [...new Set([...prevOrder, keyId])]);
  };

  const closeDialog = (keyId: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(keyId);
    setSearchParams(params);

    setDialogOrder((prevOrder) => prevOrder.filter((key) => key !== keyId));
  };

  const getDialogOrder = (keyId: string) => {
    return dialogOrder.indexOf(keyId);
  };

  return <DialogContext.Provider value={{ openDialog, closeDialog, getDialogOrder }}>{children}</DialogContext.Provider>;
};
