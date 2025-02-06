import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useDialog, useMediaQuery } from '~/hooks';

interface DialogProps {
  children: React.ReactNode;
  keyId: string;
  closeable?: boolean;
  onCloseAction?: () => void;
  closeIconClassName?: string;
  contentClassName?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  title?: string;
  titleClassName?: string;
}

/**
 * Dialog Component
 *
 * Este componente representa un diálogo modal que utiliza el contexto global
 * para manejar su orden de superposición (zIndex) y su estado de cierre.
 *
 * @param {React.ReactNode} children - Contenido del diálogo.
 * @param {string} keyId - Identificador único del diálogo, pasado automáticamente.
 * @param {boolean} closeable - En ocasiones, es posible que no se desee que el diálogo sea cerrable.
 * @param {() => void} onCloseAction - Función opcional que se ejecuta al cerrar el diálogo.
 * @param {string} closeIconClassName - Clase CSS opcional para el icono de cierre.
 */
export const Dialog: React.FC<DialogProps> = ({
  children,
  keyId,
  closeable = true,
  onCloseAction,
  closeIconClassName,
  contentClassName,
  desktopClassName,
  mobileClassName,
  title,
  titleClassName,
}) => {
  const { closeDialog, getDialogOrder } = useDialog();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const zIndex = 1000 + getDialogOrder(keyId);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={`
            ${isDesktop ? `bg-[var(--bg)] rounded-lg shadow-lg p-6 w-full max-w-md relative ${desktopClassName}` : `bg-[var(--bg)] w-full h-full p-6 relative ${mobileClassName}`}
            ${contentClassName || ''}
          `}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {closeable && (
            <button
              className={`absolute top-4 right-4 text-[var(--font)] text-xl hover:text-[var(--hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)] ${closeIconClassName}`}
              onClick={() => {
                closeDialog(keyId);
                if (onCloseAction) {
                  onCloseAction();
                }
              }}
            >
              <FontAwesomeIcon icon={faClose} />
            </button>
          )}

          {title && (
            <div className="px-6 py-3 rounded-t-lg border-b flex items-center justify-between">
              <h2 className={`text-[var(--font)] text-lg font-semibold ${titleClassName}`}>{title}</h2>
            </div>
          )}
          <div className={`${isDesktop ? 'mt-4' : 'mt-10'} text-[var(--font)]  max-h-[80vh] overflow-y-auto`}>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
