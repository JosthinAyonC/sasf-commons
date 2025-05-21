import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMediaQuery } from '~/hooks';

interface PortalTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export const PortalTooltip: React.FC<PortalTooltipProps> = ({ children, content }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const isMobile = useMediaQuery('(max-width: 768px)');

  useLayoutEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [visible]);

  useEffect(() => {
    if (!isMobile || !visible) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !tooltipRef.current?.contains(target)) {
        setVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, visible]);

  const clearHideTimeout = () => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      clearHideTimeout();
      setVisible(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isMobile) {
      const relatedTarget = e.relatedTarget as Node;
      if (!triggerRef.current?.contains(relatedTarget) && !tooltipRef.current?.contains(relatedTarget)) {
        hideTimeoutRef.current = window.setTimeout(() => {
          setVisible(false);
        }, 50);
      }
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setVisible((prev) => !prev);
    }
  };

  return (
    <>
      <div ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} style={{ display: 'inline-block' }}>
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: 'translate(-50%, -100%)',
              backgroundColor: '#333',
              color: '#fff',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              whiteSpace: 'normal',
              maxWidth: '280px',
              fontSize: '0.875rem',
              zIndex: 1000,
              pointerEvents: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ lineHeight: '1.4' }}>{content}</div>
          </div>,
          document.body
        )}
    </>
  );
};
