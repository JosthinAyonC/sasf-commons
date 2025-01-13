import { faCloudSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useTheme } from '~/provider/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className={`relative w-16 h-8 flex items-center cursor-pointer rounded-full p-1
          ${theme === 'light' ? 'bg-[var(--primary)]' : 'bg-[var(--primary)]'}
          transition-colors duration-300`}
    >
      <div
        className={`absolute left-1 h-6 w-6 rounded-full bg-[var(--secondary)] flex items-center justify-center shadow-md transition-transform duration-300
            ${theme === 'dark' ? 'transform translate-x-8' : ''}`}
      >
        {theme === 'light' ? (
          <FontAwesomeIcon icon={faCloudSun} className="text-xs text-[#ffffff]" />
        ) : (
          <FontAwesomeIcon icon={faMoon} className="text-xs text-[#ffffff]" />
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;
