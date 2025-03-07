import { motion } from 'framer-motion';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FaCheck, FaTimes } from 'react-icons/fa';

import { ToggleFieldProps } from './types';

export const ToggleField = ({
  name,
  label,
  isDisabled = false,
  variant = 'default',
  toggleClassName = '',
  labelClassName = '',
  containerClassName = '',
}: ToggleFieldProps) => {
  const { register, watch, setValue } = useFormContext();
  const isChecked = watch(name) ?? false;

  // 🔹 Manejo del estado con React Hook Form
  const handleToggle = () => {
    if (!isDisabled) {
      setValue(name, !isChecked, { shouldValidate: true });
    }
  };

  const getVariantStyles = () => {
    if (variant === 'default') {
      return isChecked ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600';
    }
    return isChecked ? 'bg-[var(--secondary)] border-[var(--secondary)]' : 'bg-[var(--primary)] border-[var(--border)]';
  };

  return (
    <div className={`flex items-center gap-3 ${containerClassName}`}>
      {label && <span className={`text-[var(--font)] ${labelClassName}`}>{label}</span>}

      <input key={name} type="checkbox" id={name} {...register(name)} className="hidden" />

      <div
        className={`relative flex items-center h-7 w-14 cursor-pointer rounded-full transition-colors duration-300 
          ${getVariantStyles()} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${toggleClassName}`}
        onClick={handleToggle}
      >
        <motion.span
          layout
          className="absolute flex items-center justify-center left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md"
          initial={false}
          animate={{
            x: isChecked ? 28 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {isChecked ? <FaCheck className="text-white text-sm" /> : <FaTimes className="text-white text-sm" />}
        </motion.span>
      </div>
    </div>
  );
};
