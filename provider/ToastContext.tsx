import React, { ReactNode, createContext, useState } from 'react';
import ToastContainer from '~/components/ui/Toast';

export type ToastVariant = 'success' | 'warning' | 'info' | 'danger';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

export interface ToastContextType {
  addToast: (_message: string, _variant: ToastVariant, _timeout?: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, variant: ToastVariant, timeout = 5000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => removeToast(id), timeout);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};
