import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, disabled = false, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className={`w-full border rounded-lg overflow-hidden transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'border-[var(--border)]'}`}>
      <button
        onClick={toggleAccordion}
        disabled={disabled}
        className="w-full flex justify-between items-center px-4 py-3 bg-[var(--bg)] text-[var(--font)] font-medium focus:outline-none hover:bg-[var(--hover2)] transition"
      >
        <span>{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FaChevronDown className="text-[var(--font)]" />
        </motion.div>
      </button>
      <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0 }} className="overflow-hidden">
        <div className="px-4 py-3 text-[var(--font)] bg-[var(--bg)] border-t border-[var(--border)]">{children}</div>
      </motion.div>
    </div>
  );
};
