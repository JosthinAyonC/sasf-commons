import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect } from 'react';

interface SimpleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface SimpleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const SimpleDialog: React.FC<SimpleDialogProps> = ({ isOpen, onClose, children, title }) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        // Este zIndex es asumiendo que un Dialog normal no pueden haber al menos 10 abiertos al mismo tiempo
        style={{ zIndex: 1060 }}
      >
        <motion.div
          className="bg-[var(--bg)] rounded-lg border border-[var(--border)] shadow-lg p-6 w-full max-w-md relative"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-[var(--font)] text-xl hover:text-[var(--hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>

          {title && (
            <div className="px-6 py-3 rounded-t-lg border-b flex items-center justify-between">
              <h2 className="text-[var(--font)] text-lg font-semibold">{title}</h2>
            </div>
          )}
          <div className="mt-4 text-[var(--font)]">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
