import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({ variant, type = 'button', href, onClick, children, disabled, ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    } else if (onClick) {
      onClick();
    }
  };

  const baseClass = `px-6 py-2 font-bold rounded-lg transition duration-300 focus:outline-none focus:ring-2`;
  const variantClass =
    variant === 'outline'
      ? 'border border-[var(--border)] text-[var(--font)] hover:bg-[var(--hover)]'
      : 'bg-[var(--secondary)] text-white hover:bg-[var(--hover)]';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button type={type} className={`${baseClass} ${variantClass} ${disabledClass}`} onClick={handleClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
