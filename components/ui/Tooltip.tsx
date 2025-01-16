import { faCaretDown, faCaretLeft, faCaretRight, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import React, { CSSProperties } from 'react';

type TooltipProps = {
  message: string;
  className?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  position?: 'top' | 'bottom' | 'left' | 'right';
  showIndicator?: boolean;
};

const Tooltip: React.FC<TooltipProps> = ({ message, className, variant = 'success', position = 'top', showIndicator = true }) => {
  if (!message) return null;

  const variantStyles: Record<string, string> = {
    danger: 'bg-[var(--error)] text-[var(--text-on-error)] border-[var(--error)]',
    warning: 'bg-[var(--warning)] text-[var(--text-on-warning)] border-[var(--warning)]',
    info: 'bg-[var(--info)] text-[var(--text-on-info)] border-[var(--info)]',
    success: 'bg-[var(--success)] text-[var(--text-on-success)] border-[var(--success)]',
  };

  const positionStyles: Record<string, string> = {
    top: 'top-full mt-3',
    bottom: 'bottom-full mb-3',
    left: 'left-full ml-3',
    right: 'right-full mr-3',
  };

  const indicatorIcons: Record<string, typeof faCaretUp> = {
    top: faCaretUp,
    bottom: faCaretDown,
    left: faCaretLeft,
    right: faCaretRight,
  };

  const indicatorPositionStyles: Record<string, CSSProperties> = {
    top: { left: '50%', transform: 'translateX(-50%)', top: '-0.625rem' },
    bottom: { left: '50%', transform: 'translateX(-50%)', bottom: '-0.625rem' },
    left: { top: '50%', transform: 'translateY(-50%)', right: '-0.625rem' },
    right: { top: '50%', transform: 'translateY(-50%)', left: '-0.625rem' },
  };

  return (
    <motion.span
      style={{ zIndex: 9999 }}
      initial={{ opacity: 0, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0, x: position === 'left' ? 10 : position === 'right' ? -10 : 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0, x: position === 'left' ? 10 : position === 'right' ? -10 : 0 }}
      transition={{ duration: 0.2 }}
      className={`absolute ${positionStyles[position]} ${variantStyles[variant]} border p-2 rounded shadow ${className} border-[var(--font)] border-1`}
      role="tooltip"
    >
      {showIndicator && (
        <FontAwesomeIcon icon={indicatorIcons[position]} className="absolute drop-shadow-sm text-[var(--font)] " style={indicatorPositionStyles[position]} />
      )}
      <span className="text-[var(--font)] ">{message}</span>
    </motion.span>
  );
};

export default Tooltip;
