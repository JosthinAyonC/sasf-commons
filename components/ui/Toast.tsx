import { faCheckCircle, faClose, faExclamationTriangle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Toast } from '~/provider/ToastContext';

const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (_id: string) => void }) => {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} {...toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// TDOO: AJUSTAR ESTILOS DE LOS TOASTS
const ToastMessage = ({ id, message, variant, onRemove }: Toast & { onRemove: (_id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar el toast
    const enterTimeout = setTimeout(() => setIsVisible(true), 10);

    return () => {
      clearTimeout(enterTimeout);
    };
  }, []);

  const toastVariants = {
    success: {
      background: 'bg-[#D9FCE9]',
      borderColor: 'border-[#3AC279]',
      title: '¡Éxito!',
      textcolor: 'text-[#3AC279]',
      icon: faCheckCircle,
    },
    danger: {
      background: 'bg-red-100',
      borderColor: 'border-[#DA291C]',
      title: '¡Error!',
      textcolor: 'text-[#DA291C]',
      icon: faTimesCircle,
    },
    warning: {
      background: 'bg-[#FFF0D9]',
      borderColor: 'border-[#E89F29]',
      title: 'Aviso',
      textcolor: 'text-[#E89F29]',
      icon: faExclamationTriangle,
    },
    info: {
      background: 'bg-[#E0EDFF]',
      borderColor: 'border-[#3882E5]',
      title: 'Información',
      textcolor: 'text-[#3882E5]',
      icon: faInfoCircle,
    },
  };

  const { background, title, icon, borderColor, textcolor } = toastVariants[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className={`relative p-3 border rounded-md shadow-md ${background} border-l-8 ${borderColor}`}
        >
          <div className="flex items-start">
            <div className={`mr-4 text-2xl ${textcolor}`}>
              <FontAwesomeIcon icon={icon} />
            </div>
            <div>
              <div className="font-bold text-[16px]">{title}</div>
              <div className="text-sm">{message || 'Mensaje predeterminado'}</div>
            </div>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => onRemove(id)}>
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastContainer;
