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
  cancelLabel?: string;
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
  const { formState, trigger, watch } = finalMethods;
  const watchedFields = watch();
  const [currentStep, setCurrentStep] = useState(0);
  const [invalidStep, setInvalidStep] = useState(false);

  useEffect(() => {
    if (formState.isValid) {
      setInvalidStep(false);
    }
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
          <form onSubmit={finalMethods.handleSubmit(onSubmit)} className={steps[currentStep].stepClassName || ''}>
            {steps[currentStep].component}

            <div className="bg-[var(--bg)] p-4 flex justify-end mt-4 space-x-2">
              {/* Botón Previous */}
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

              {/* Botón Next */}
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
                  disabled={invalidStep}
                  className="transition-shadow duration-200 hover:ring-2 hover:ring-gray-400"
                >
                  {nextStepLabel}
                </Button>
              )}

              {/* Botón Submit */}
              {currentStep === steps.length - 1 && (
                <Button type="submit" className="transition-shadow duration-200 hover:ring-2 hover:ring-gray-400">
                  {submitLabel}
                </Button>
              )}
            </div>
          </form>
        ) : (
          <div className={steps[currentStep].stepClassName || ''}>
            {steps[currentStep].component}

            <div className="flex justify-end mt-4 space-x-2">
              {/* Botón Previous */}
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}>
                  {previousStepLabel}
                </Button>
              )}

              {/* Botón Next */}
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
                  disabled={invalidStep}
                >
                  {nextStepLabel}
                </Button>
              )}

              {/* Botón Submit */}
              {currentStep === steps.length - 1 && <Button onClick={() => finalMethods.handleSubmit(onSubmit)()}>{submitLabel}</Button>}
            </div>
          </div>
        )}
      </div>
    </RHFProvider>
  );
};
