import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps & { isLoading?: boolean }> = ({
  variant = 'primary',
  className,
  type = 'button',
  href,
  onClick,
  children,
  disabled,
  isLoading = false,
  ...props
}) => {
  const navigate = useNavigate();
  const isActuallyDisabled = disabled || isLoading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isActuallyDisabled) {
      e.preventDefault();
      return;
    }

    if (href) {
      navigate(href);
    } else if (onClick) {
      onClick();
    }
  };

  const baseClass = `px-6 py-2 font-bold rounded-lg transition duration-300 focus:outline-none focus:ring-2 flex items-center justify-center relative`;
  const variantClass =
    variant === 'outline'
      ? 'border border-[var(--border)] text-[var(--font)] hover:bg-[var(--secondaryalthover)]'
      : variant === 'danger'
        ? 'bg-red-500 text-white hover:bg-red-600'
        : variant === 'primary'
          ? 'bg-[var(--primary)] text-white hover:bg-[var(--focus)]'
          : '';
  const disabledClass = isActuallyDisabled ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${disabledClass} ${className}`}
      onClick={handleClick}
      aria-disabled={isActuallyDisabled}
      title={props.title}
      {...props}
    >
      <span className="flex items-center justify-center" style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        {children}
      </span>
      {isLoading && <span className="absolute animate-spin h-5 w-5 border-4 border-[var(--bg)] border-t-transparent rounded-full"></span>}
    </button>
  );
};
