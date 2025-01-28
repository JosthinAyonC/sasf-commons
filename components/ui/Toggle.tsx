import { motion } from 'framer-motion';
import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface ToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ isActive, onToggle }) => {
  return (
    <div
      className={`relative flex items-center h-7 w-14 cursor-pointer rounded-full transition-colors duration-300 ${
        isActive ? 'bg-[var(--success)]' : 'bg-[var(--error)]'
      }`}
      onClick={onToggle}
    >
      <motion.span
        layout
        className="absolute flex items-center justify-center left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md"
        initial={false}
        animate={{
          x: isActive ? 28 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isActive ? <FaCheck className="text-[var(--success)] text-sm" /> : <FaTimes className="text-[var(--error)] text-sm" />}
      </motion.span>
    </div>
  );
};

export default Toggle;
