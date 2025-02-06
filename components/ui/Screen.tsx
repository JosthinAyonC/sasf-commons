import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '~/hooks/useMediaQuery';

type ScreenProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  showGoBackButton?: boolean;
  // TODO: Add more props personalized
};

export const Screen: React.FC<ScreenProps> = ({ children, className, title, showGoBackButton = true }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col h-screen w-full bg-[var(--bg)] ${isMobile ? 'p-4' : 'p-16'} ${className || ''}`}>
      {/* Header con título y botón de volver atrás */}
      {(title || showGoBackButton) && (
        <header className="flex items-center mb-4">
          {showGoBackButton && (
            <button type="button" onClick={() => navigate(-1)} className="mr-4 p-2 text-[var(--font)] hover:text-[var(--hover)]">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
          {title && <h1 className="text-xl font-bold text-[var(--font)]">{title}</h1>}
        </header>
      )}

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Screen;
