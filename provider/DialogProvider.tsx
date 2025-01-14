import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface DialogContextType {
  openDialog: (key: string, id: string | null) => void;
  closeDialog: (key: string) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [dialogs, setDialogs] = useState<{ key: string; id: string | null }[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const newDialogs = Array.from(params.entries()).map(([key, id]) => ({ key, id }));
    newDialogs.reverse(); // Mostrar los últimos modales primero
    setDialogs(newDialogs);
  }, [search]);

  const openDialog = (key: string, id: string | null) => {
    const params = new URLSearchParams(search);
    params.set(key, id ?? '');
    navigate({ search: params.toString() });
  };

  const closeDialog = (key: string) => {
    const params = new URLSearchParams(search);
    params.delete(key);
    navigate({ search: params.toString() });
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {dialogs.map(({ key, id }) => {
        const DialogComponent = dialogRegistry[key];
        if (!DialogComponent) return null;
        return (
          <div key={key} className="dialog-backdrop">
            <div className="dialog-content">
              <DialogComponent id={id} />
              <button onClick={() => closeDialog(key)}>Close</button>
            </div>
          </div>
        );
      })}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within a DialogProvider');
  return context;
};

// Registro dinámico de diálogos
type DialogRegistry = {
  [key: string]: React.FC<{ id: string | null }>;
};

export const dialogRegistry: DialogRegistry = {};

export const registerDialog = (key: string, Component: React.FC<{ id: string | null }>) => {
  dialogRegistry[key] = Component;
  console.log('Registered dialogs:', dialogRegistry);
};
