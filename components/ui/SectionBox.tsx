import React, { ReactNode, useState } from 'react';

interface SectionBoxProps {
  label: React.ReactNode;
  children: ReactNode;
  className?: string;
}

export const SectionBox: React.FC<SectionBoxProps> = ({ label, children, className }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative p-6 rounded-lg border transition-colors duration-300 bg-[var(--bg)] ${className || ''}`}
      style={{
        borderColor: hovered ? 'var(--info)' : 'var(--border)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="absolute -top-3 left-4 px-2 text-sm font-semibold transition-colors duration-300 bg-[var(--bg)]"
        style={{
          color: hovered ? 'var(--info)' : 'var(--font)',
        }}
      >
        {label}
      </span>

      <div className="text-[var(--font)]">{children}</div>
    </div>
  );
};
