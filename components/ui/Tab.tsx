import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaBars } from 'react-icons/fa';

export interface TabItem {
  tabName: string; // Nombre visible de la pestaña
  component: React.ReactNode; // Contenido que se renderizará al seleccionar la pestaña
  tabClassName?: string; // Clase CSS opcional para personalizar el estilo de la pestaña
  fields?: string[]; // Lista de nombres de campos asociados a esta pestaña (para validación de formularios)
}

interface TabProps {
  tabs: TabItem[]; // Lista de pestañas a mostrar
  className?: string; // Clase CSS para el contenedor principal del componente
  tabContainerClassName?: string; // Clase CSS para el contenedor de las pestañas
  contentClassName?: string; // Clase CSS para el contenedor del contenido de la pestaña activa
}

interface FieldError {
  type: string;
  message?: string;
  [key: string]: unknown;
}

interface FormErrors {
  [key: string]: FieldError | FormErrors | undefined;
}

// Componente Tab: Muestra un conjunto de pestañas con contenido asociado y soporte opcional para validación de formularios
export const Tab: React.FC<TabProps> = ({ tabs, className = '', tabContainerClassName = '', contentClassName = '' }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Referencia al contenedor del menú desplegable (para detectar clics fuera)
  const menuRef = useRef<HTMLDivElement>(null);

  // Obtiene el contexto del formulario (puede ser null si no está dentro de un formulario)
  const formContext = useFormContext();
  const errors: FormErrors = formContext && formContext.formState ? formContext.formState.errors : {};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (tabs.length === 0) {
    return <div className="w-full p-6 text-[var(--font)]">No hay pestañas para mostrar</div>;
  }

  // Función para verificar si una pestaña tiene errores (solo si estamos dentro de un formulario)
  const hasTabErrors = (tabFields: string[] = []): boolean => {
    if (!tabFields.length) return false; // Si no hay campos, no hay errores
    return tabFields.some((field) => {
      const fieldError = field.split('.').reduce((obj: FormErrors | FieldError | undefined, key: string) => {
        if (obj && typeof obj === 'object' && key in obj) {
          return obj[key] as FormErrors | FieldError | undefined;
        }
        return undefined;
      }, errors);
      return !!fieldError;
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`sticky top-0 z-10 flex items-center border-b border-[var(--border)] bg-[var(--bg)] shadow-sm py-3 ${tabContainerClassName}`}>
        <div className="relative flex items-center justify-center mr-4 md:hidden">
          <FaBars className="text-[var(--font)] text-lg cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)} />
          {isMenuOpen && (
            <div ref={menuRef} className="absolute top-full left-0 mt-2 w-48 bg-[var(--bg)] border border-[var(--border)] rounded-md shadow-lg z-20">
              {tabs.map((tab, index) => {
                const tabHasErrors = hasTabErrors(tab.fields);
                return (
                  <div
                    key={index}
                    className={`px-4 py-2 cursor-pointer hover:bg-[var(--hover)] ${activeTab === index ? 'bg-[var(--primary)]' : ''} ${tabHasErrors ? 'text-red-500' : ''}`}
                    onClick={() => {
                      setActiveTab(index);
                      setIsMenuOpen(false);
                    }}
                  >
                    {tab.tabName}
                    {tabHasErrors && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {tabs.map((tab, index) => {
            const tabHasErrors = hasTabErrors(tab.fields);
            return (
              <div key={index} className="relative">
                <span
                  onClick={() => setActiveTab(index)}
                  className={`text-sm font-medium cursor-pointer transition-all duration-200 ${
                    activeTab === index
                      ? `text-[var(--font)] ${tabHasErrors ? 'text-red-500' : ''}`
                      : `text-[var(--font)] opacity-50 hover:opacity-75 ${tabHasErrors ? 'text-red-500' : ''}`
                  } ${tab.tabClassName || ''}`}
                >
                  {tab.tabName}
                  {tabHasErrors && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500" />}
                </span>

                {activeTab === index && <div className={`absolute -bottom-[1px] left-0 right-0 h-[2px] ${tabHasErrors ? 'bg-red-500' : 'bg-[var(--font)]'}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className={`pt-4 ${contentClassName}`}>
        {tabs.map((tab, index) => (
          <div key={index} className={index === activeTab ? 'block' : 'hidden'}>
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
};
