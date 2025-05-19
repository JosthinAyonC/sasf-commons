import React from 'react';
import { Button } from '~/form/fields';

interface CheckoutItem {
  clave: string;
  valor: number | string;
  className?: string;
  featured?: boolean;
}

interface CheckoutProps {
  title: string;
  children?: React.ReactNode;
  resoome: CheckoutItem[];
  NextButtonSlot?: React.ReactNode;
  nextButtonAction?: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ title, children, resoome, NextButtonSlot, nextButtonAction }) => {
  return (
    <div className="w-full border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg)] text-[var(--font)] shadow-md">
      {/* Título */}
      <div className="px-4 py-3 text-lg font-semibold border-b border-[var(--border)]">{title}</div>

      {/* Contenido */}
      <div className="px-4 py-3">{children}</div>

      {/* resoome Checkout */}
      <div className="px-4 py-3 border-t border-[var(--border)]">
        {resoome.map(({ clave, valor, className = '', featured }, idx) => (
          <React.Fragment key={idx}>
            <div className={`flex justify-end items-center gap-4 ${featured ? 'font-bold text-primary-light text-lg' : 'text-sm'} ${className}`}>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 w-full">
                <span className="col-span-2 md:col-span-5 text-right">{clave}:</span>
                <span className="text-right">{typeof valor === 'number' ? valor.toFixed(2) : valor}</span>
              </div>
            </div>
            {idx < resoome.length - 1 && <div className="border-b border-dashed border-[var(--border)] my-2" />}
          </React.Fragment>
        ))}
      </div>

      {/* Botón Siguiente */}
      <div className="px-4 py-4 border-t border-[var(--border)] bg-[var(--secondaryalthover)]">
        <Button onClick={nextButtonAction} className="w-full flex items-center justify-center gap-2">
          {NextButtonSlot ?? <span>Siguiente</span>}
        </Button>
      </div>
    </div>
  );
};
