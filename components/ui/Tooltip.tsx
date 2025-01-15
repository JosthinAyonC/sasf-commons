import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import React from 'react';

type TooltipProps = {
  message: string;
  className?: string;
  showIndicator?: boolean;
};

const Tooltip: React.FC<TooltipProps> = ({ message, className, showIndicator = true }) => {
  if (!message) return null;

  return (
    <motion.span
      style={{ zIndex: 1000 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={`absolute right-0 top-full mt-3 text-[var(--error)] bg-[var(--highlight)] border border-[var(--error)] p-2 rounded shadow ${className}`}
      role="tooltip"
    >
      {showIndicator && (
        <FontAwesomeIcon
          icon={faCaretUp}
          className="absolute -top-2.5 text-[var(--error)] drop-shadow-sm"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      )}
      {message}
    </motion.span>
  );
};

export default Tooltip;
