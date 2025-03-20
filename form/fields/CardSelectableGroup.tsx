import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

interface CardOption {
  value: string;
  label?: string;
  isLoadingContent?: boolean;
  content: React.ReactNode;
}

interface CardSelectableGroupProps {
  name: string;
  options: CardOption[];
  required?: boolean;
  groupClassName?: string;
  cardClassName?: string;
  errorClassName?: string;
  optionClassName?: string;
  requiredMsg?: string;
  cardSizeX?: number;
  cardSizeY?: number;
}

export const CardSelectableGroup = ({
  name,
  options,
  required = false,
  groupClassName = '',
  cardClassName = '',
  errorClassName = '',
  optionClassName = '',
  requiredMsg = 'Selecciona una opción',
  cardSizeX = 300,
  cardSizeY = 200,
}: CardSelectableGroupProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;

  return (
    <>
      <style>{`
        @keyframes pulseBackground {
            0% {
                background-position: 200% 0;
            }
            100% {
                background-position: -200% 0;
            }
        }

        .animate-pulseBackground {
            background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
            background-size: 200% 100%;
            animation: pulseBackground 1.5s infinite linear;
        }
        `}</style>
      <div className="my-4 gap-4">
        <div className={`flex flex-wrap gap-2 justify-center ${groupClassName}`}>
          {options.map((option) => {
            const isDisabled = option.isLoadingContent;
            const commonClasses = isDisabled ? 'cursor-not-allowed' : 'cursor-pointer';

            return (
              <div
                key={option.value}
                className={`border rounded-lg p-2 flex justify-center ${cardClassName} ${commonClasses}`}
                style={{ width: `${cardSizeX}px`, height: `${cardSizeY}px` }}
              >
                <label
                  className={`border-2 rounded-lg transition-all flex flex-col hover:border-[var(--primary)] peer-checked:border-[var(--primary)] ${commonClasses}`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="radio"
                      value={option.value}
                      {...register(name, { required: required ? requiredMsg : undefined })}
                      disabled={isDisabled}
                      className={`border border-[var(--border)] appearance-none w-4 h-4 rounded-full 
                                            checked:bg-[var(--primary)] checked:border-[var(--primary)] 
                                            focus:ring-[var(--focus)] ${commonClasses} ${optionClassName}`}
                    />
                    {option.label && <span className={`text-sm text-[var(--font)] ${commonClasses}`}>{option.label}</span>}
                  </div>

                  <div
                    className={`border rounded-lg border-[var(--border)] p-2 flex items-center justify-center overflow-hidden ${commonClasses} ${option.isLoadingContent ? 'animate-pulseBackground' : ''}`}
                    style={{ width: `${cardSizeX - 50}px`, height: `${cardSizeY - 50}px` }}
                  >
                    {option.isLoadingContent ? null : option.content}
                  </div>
                </label>
              </div>
            );
          })}
        </div>

        {error && (
          <span className={`text-[var(--error)] text-xs mt-2 ${errorClassName}`}>
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
            {error.message}
          </span>
        )}
      </div>
    </>
  );
};
