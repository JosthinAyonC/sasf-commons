import React from 'react';

type TooltipProps = {
  message: string;
  className?: string;
};

const Tooltip: React.FC<TooltipProps> = ({ message, className }) => {
  if (!message) return null;

  return (
    <span
      className={`absolute right-0 top-full mt-1 text-[var(--error)] bg-[var(--highlight)] border border-[var(--error)] p-1 rounded shadow ${className}`}
      role="tooltip"
    >
      {message}
    </span>
  );
};

export default Tooltip;

