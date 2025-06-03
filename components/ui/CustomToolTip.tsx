import { IconDefinition, faCheckCircle, faExclamationTriangle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useState } from 'react';

import { useMediaQuery } from '../../hooks';

export interface TooltipProps {
  text: React.ReactNode;
  iconClassName?: string;
  bgColor?: string;
  icon?: IconDefinition;
  toolTipClassName?: string;
  variant?: 'success' | 'danger' | 'warning' | 'info';
}

const tooltipVariants = {
  success: {
    background: 'bg-[var(--success)]',
    borderColor: 'border-[var(--success-dark)]',
    textcolor: 'text-[var(--success-dark)]',
    icon: faCheckCircle,
  },
  danger: {
    background: 'bg-[var(--danger)]',
    borderColor: 'border-[var(--danger-dark)]',
    textcolor: 'text-[var(--danger-dark)]',
    icon: faTimesCircle,
  },
  warning: {
    background: 'bg-[var(--warning)]',
    borderColor: 'border-[var(--warning-dark)]',
    textcolor: 'text-[var(--warning-dark)]',
    icon: faExclamationTriangle,
  },
  info: {
    background: 'bg-[var(--info)]',
    borderColor: 'border-[var(--info-dark)]',
    textcolor: 'text-[var(--info-dark)]',
    icon: faInfoCircle,
  },
};

export const CustomTooltip: FC<TooltipProps> = ({ text, iconClassName, bgColor, icon, toolTipClassName, variant = 'info' }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleTooltip = () => {
    setTooltipVisible(!isTooltipVisible);
  };

  const { background, borderColor, textcolor, icon: variantIcon } = tooltipVariants[variant];

  return (
    <div
      className="relative group inline-block"
      onClick={isMobile ? toggleTooltip : undefined}
      onMouseEnter={!isMobile ? () => setTooltipVisible(true) : undefined}
      onMouseLeave={!isMobile ? () => setTooltipVisible(false) : undefined}
    >
      <FontAwesomeIcon icon={icon || faInfoCircle} className={`text-[var(--secondaryalt)] cursor-pointer ${iconClassName}`} />

      {/* Tooltip visual */}
      {(isTooltipVisible || !isMobile) && (
        <div
          className={`absolute ${isTooltipVisible ? 'block' : 'hidden'} group-hover:block ${bgColor ? `bg-${bgColor}` : background} text-white text-xs rounded-md p-2 shadow-lg z-10 w-64 left-1/2 -translate-x-1/2 bottom-full ${borderColor} ${toolTipClassName}`}
        >
          <div className="flex flex-row items-center">
            <FontAwesomeIcon icon={variantIcon} className={`mr-2 ${textcolor}`} />
            <span className={`${textcolor} text-xs`}>{text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
