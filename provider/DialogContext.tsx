import React, { createContext, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface DialogContextProps {
  openDialog: (keyId: string, value: string) => void;
  closeDialog: (keyId: string) => void;
  getDialogOrder: (keyId: string) => number;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

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
