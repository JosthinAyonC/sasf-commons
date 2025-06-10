import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaCheck, FaCopy } from 'react-icons/fa';
import { useClipboard } from '~/hooks/useClipboard';

interface CopyBadgeProps {
  textToCopy: string;
  timeout?: number;
  size?: number;
}

export function CopyBadge({ textToCopy, timeout = 2000, size = 20 }: CopyBadgeProps) {
  const { copy, copied } = useClipboard(timeout);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (copied) {
      setShowTooltip(true);
      const timer = setTimeout(() => setShowTooltip(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [copied, timeout]);

  // Mostrar tooltip si está copiado o si está en hover
  const shouldShowTooltip = showTooltip || isHovered;

  const iconSize = size ?? 20;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <button
        onClick={() => copy(textToCopy)}
        aria-label={copied ? 'Copiado' : 'Copiar al portapapeles'}
        style={{
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0,
          width: iconSize,
          height: iconSize,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                color: 'var(--primary)',
                fontSize: iconSize,
                position: 'absolute',
              }}
            >
              <FaCheck />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                color: 'var(--primary)',
                fontSize: iconSize,
                position: 'absolute',
              }}
            >
              <FaCopy />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Tooltip Overlay */}
      <AnimatePresence>
        {shouldShowTooltip && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: 8,
              backgroundColor: '#222',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: 12,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 1000,
            }}
            role="tooltip"
          >
            {copied ? '¡Copiado!' : 'Copiar al portapapeles'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
