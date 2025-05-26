import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { hexToRGBA } from '~/utils/Functions';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  disabledText?: string;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, disabled = false, defaultOpen = false, disabledText = 'Deshabilitado' }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`w-full border rounded-lg overflow-hidden transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'border-[var(--border)]'}`}>
      <button
        type="button"
        onClick={toggleAccordion}
        disabled={disabled}
        title={disabled ? disabledText : 'Abrir/Cerrar'}
        className={`w-full flex justify-between items-center px-4 py-3 bg-[var(--bg)] text-[var(--font)] font-medium focus:outline-none hover:bg-[var(--hover2)] transition ${disabled ? 'cursor-not-allowed' : ''}`}
        style={{
          backgroundColor: isHovered
            ? 'var(--secondaryalt)'
            : hexToRGBA(getComputedStyle(document.documentElement).getPropertyValue('--secondaryalt').trim(), 0.5),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span>{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FaChevronDown className="text-[var(--font)]" />
        </motion.div>
      </button>
      <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0 }} className={`overflow-hidden ${disabled ? 'pointer-events-none' : ''}`}>
        <div className="px-4 py-3 text-[var(--font)] bg-[var(--bg)] border-t border-[var(--border)]">{children}</div>
      </motion.div>
    </div>
  );
};
