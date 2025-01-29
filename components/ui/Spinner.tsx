import React from 'react';

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = (className) => {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--secondary)] ${className}`}></div>
    </div>
  );
};

export default Spinner;
