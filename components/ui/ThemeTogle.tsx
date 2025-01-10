import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useTheme } from '~/provider/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className={`relative w-16 h-8 flex items-center cursor-pointer rounded-full p-1
          ${theme === 'light' ? 'bg-[var(--bg-color)]' : 'bg-[var(--bg-color)]'}
          transition-colors duration-300`}
    >
      <div
        className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-[var(--font-color)] flex items-center justify-center shadow-md transition-transform duration-300
            ${theme === 'dark' ? 'transform translate-x-8' : ''}`}
      >
        {theme === 'light' ? (
          <FontAwesomeIcon icon={faSun} className="text-sm text-[var(--bg-color)]" />
        ) : (
          <FontAwesomeIcon icon={faMoon} className="text-sm text-[var(--bg-color)]" />
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;
