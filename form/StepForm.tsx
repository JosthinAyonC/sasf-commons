import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { FieldValues, FormProvider as RHFProvider, UseFormReturn, useForm } from 'react-hook-form';

import { Button } from './fields';

export interface Step {
  stepName: string;
  stepClassName?: string;
  component: React.ReactNode;
  nextStepAction?: () => void;
}

interface StepFormProps<T extends FieldValues> {
  steps: Step[];
  onSubmit: (_data: T) => void;
  className?: string;
  methods?: UseFormReturn<T>;
  nextStepLabel?: string;
  previousStepLabel?: string;
  submitLabel?: string;
  activeForm?: boolean;
}

export const StepForm = <T extends FieldValues>({
  steps,
  onSubmit,
  className,
  methods,
  submitLabel = 'Guardar',
  nextStepLabel = 'Siguiente',
  previousStepLabel = 'Anterior',
  activeForm = true,
}: StepFormProps<T>) => {
  const internalMethods = useForm<T>({ mode: 'onBlur' });
  const finalMethods = methods || internalMethods;
  const { formState, trigger, watch, handleSubmit } = finalMethods;
  const watchedFields = watch();
  const [currentStep, setCurrentStep] = useState(0);
  const [invalidStep, setInvalidStep] = useState(false);

  useEffect(() => {
    setInvalidStep(!formState.isValid);
  }, [formState.isValid, watchedFields]);

  const validateAndNext = async (index: number) => {
    const isValid = await trigger();
    setInvalidStep(!isValid);
    if (isValid) {
      setCurrentStep(index);
    }
  };

  if (steps.length === 0) return <div className="w-full p-6 bg-[var(--background)] text-[var(--font)]">No hay pasos para mostrar</div>;

  return (
    <RHFProvider {...finalMethods}>
      <div className={`w-full p-4 bg-[var(--background)] text-[var(--font)] shadow rounded-lg ${className}`}>
        {/* Stepper Labels */}
        <div className="flex items-center justify-start space-x-2 mb-4 text-lg font-semibold">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <span
                onClick={() => index <= currentStep && setCurrentStep(index)}
                className={`transition duration-300 px-2 py-1 text-sm cursor-pointer ${
                  index === currentStep
                    ? 'text-[var(--font)] font-bold'
                    : index < currentStep
                      ? 'text-[var(--font)] hover:text-[var(--primary)]'
                      : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {step.stepName}
              </span>
              {index < steps.length - 1 && <span className="text-[var(--font)]">{' >> '}</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Current Step Component */}
        {activeForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className={steps[currentStep].stepClassName || ''}>
            {steps.map((step, index) => (
              <div key={index} hidden={index !== currentStep}>
                {step.component}
              </div>
            ))}

            <div className={`flex mt-4 ${currentStep > 0 ? 'justify-between' : 'justify-end'}`}>
              {/* Botón Previous en la izquierda */}
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                  className="transition-shadow duration-200 hover:ring-2 hover:ring-black-400"
                >
                  {previousStepLabel}
                </Button>
              )}

              <div className="flex space-x-2">
                {/* Botón Guardar (solo si el formulario es válido) */}
                {!invalidStep && (
                  <Button onClick={() => handleSubmit(onSubmit)()} variant="outline">
                    {submitLabel} <FontAwesomeIcon icon={faSave} className="ml-2" />
                  </Button>
                )}

                {/* Botón Next en la derecha */}
                {currentStep < steps.length - 1 && (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      if (steps[currentStep].nextStepAction) {
                        steps[currentStep].nextStepAction();
                      }
                      validateAndNext(currentStep + 1);
                    }}
                  >
                    {nextStepLabel}
                  </Button>
                )}
              </div>
            </div>
          </form>
        ) : (
          <div className={steps[currentStep].stepClassName || ''}>
            {steps.map((step, index) => (
              <div key={index} hidden={index !== currentStep}>
                {step.component}
              </div>
            ))}

            <div className="flex justify-between mt-4">
              {/* Botón Previous en la izquierda */}
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}>
                  {previousStepLabel}
                </Button>
              )}

              <div className="flex space-x-2">
                {/* Botón Guardar (solo si el formulario es válido) */}
                {!invalidStep && (
                  <Button onClick={() => handleSubmit(onSubmit)()} variant="outline">
                    {submitLabel} <FontAwesomeIcon icon={faSave} className="ml-2" />
                  </Button>
                )}

                {/* Botón Next en la derecha */}
                {currentStep < steps.length - 1 && (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      if (steps[currentStep].nextStepAction) {
                        steps[currentStep].nextStepAction();
                      }
                      validateAndNext(currentStep + 1);
                    }}
                  >
                    {nextStepLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </RHFProvider>
  );
};
