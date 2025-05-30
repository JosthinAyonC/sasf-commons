import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { PortalTooltip } from '~/components/ui/PortalTooltip';

import { TextFieldUIProps } from './types';

export const TextFieldUI: React.FC<TextFieldUIProps> = ({
  placeholder,
  inputClassName = '',
  disabled = false,
  onChange,
  value,
  type,
  additionalInformation,
}) => (
  <div>
    <div className="flex w-full">
      {additionalInformation && (
        <div className="relative flex items-center justify-center w-[10%] bg-[var(--bg)] border border-r-0 border-[var(--border)] rounded-l-md">
          <PortalTooltip content={additionalInformation}>
            <FontAwesomeIcon icon={faInfoCircle} className="text-[var(--info)] cursor-pointer" />
          </PortalTooltip>
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`border border-[var(--border)] rounded-md p-2 w-full 
        focus:outline-none focus:border-[var(--focus)] placeholder:text-[var(--placeholder)] 
        bg-[var(--bg)] text-[var(--font)] ${disabled ? 'cursor-not-allowed bg-[var(--disabled)]' : ''} 
        ${inputClassName} ${additionalInformation ? 'rounded-l-none' : ''}`}
        autoComplete="off"
        disabled={disabled}
      />
    </div>
  </div>
);
