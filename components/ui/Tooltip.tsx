import { faCheckCircle, faExclamationTriangle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const tooltipVariants = {
  success: {
    background: 'bg-[#D9FCE9]',
    borderColor: 'border-[#3AC279]',
    textcolor: 'text-[#3AC279]',
    icon: faCheckCircle,
  },
  danger: {
    background: 'bg-red-100',
    borderColor: 'border-[#DA291C]',
    textcolor: 'text-[#DA291C]',
    icon: faTimesCircle,
  },
  warning: {
    background: 'bg-[#FFF0D9]',
    borderColor: 'border-[#E89F29]',
    textcolor: 'text-[#E89F29]',
    icon: faExclamationTriangle,
  },
  info: {
    background: 'bg-[#E0EDFF]',
    borderColor: 'border-[#3882E5]',
    textcolor: 'text-[#3882E5]',
    icon: faInfoCircle,
  },
};

interface TooltipProps {
  message: React.ReactNode;
  variant?: keyof typeof tooltipVariants;
  duration?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ message, variant = 'info', duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const { background, borderColor, textcolor, icon } = tooltipVariants[variant];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className={`absolute left-0 mt-1 px-3 py-1 rounded-md shadow-lg z-10 border ${background} ${borderColor}`}
        >
          <div className="flex flex-row items-center">
            <FontAwesomeIcon icon={icon} className={`mr-2 ${textcolor}`} />
            <span className={`${textcolor} text-xs`}>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
