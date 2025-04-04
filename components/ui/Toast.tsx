import { faCheckCircle, faClose, faExclamationTriangle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Toast } from '~/provider/ToastContext';

const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (_id: string) => void }) => {
  return (
    <div style={{ zIndex: 9999 }} className="fixed top-4 right-4 space-y-2 md:w-[30vw] w-[90%] md:max-h-[40vh] max-h-[40%] overflow-y-auto overflow-x-hidden">
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} {...toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastMessage = ({ id, message, variant, onRemove }: Toast & { onRemove: (_id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  const duration = 1800; // 5.5 seconds

  useEffect(() => {
    const enterTimeout = setTimeout(() => setIsVisible(true), 10);

    let progressInterval: NodeJS.Timeout;
    if (!isHovered) {
      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 0) {
            clearInterval(progressInterval);
            onRemove(id);
            return 0;
          }
          return prevProgress - 0.5;
        });
      }, duration / 100);
    }

    return () => {
      clearTimeout(enterTimeout);
      clearInterval(progressInterval);
    };
  }, [isHovered, id, onRemove]);

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
          className={`relative p-3 border rounded-md shadow-md ${background} border-l-8 ${borderColor} w-full max-h-[40vh]`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start space-x-3">
            <div className={`text-2xl ${textcolor}`}>
              <FontAwesomeIcon icon={icon} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[16px]">{title}</div>
              <div className="text-sm max-h-[10vh] overflow-hidden text-ellipsis line-clamp-4 cursor-default">{message || 'Mensaje predeterminado'}</div>
            </div>
            <button type="button" className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => onRemove(id)}>
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>

          {/* Barra de progreso */}
          <div
            className="absolute bottom-0 left-0 w-full h-1 bg-gray-300"
            style={{
              width: `${progress}%`,
              backgroundColor: `${progress <= 0 ? '#f87171' : textcolor.replace('text-', '').replace('[', '').replace(']', '')}`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastContainer;
