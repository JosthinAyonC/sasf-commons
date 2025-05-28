import { faAngleDoubleLeft, faAngleDoubleRight, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '~/hooks';

import { Form } from './Form';
import { Button } from './fields';

export interface Step {
  stepName: string;
  stepClassName?: string;
  component: React.ReactNode;
  nextStepAction?: () => void;
  canNext?: () => boolean;
  canNextMsg?: string;
}

interface StepFormProps<T extends FieldValues> {
  steps: Step[];
  onSubmit: (_data: T) => void;
  className?: string;
  methods?: UseFormReturn<T>;
  nextStepComponent?: React.ReactNode;
  previousStepComponent?: React.ReactNode;
  submitComponent?: React.ReactNode;
  canSave?: boolean;
  onlySaveInLastStep?: boolean;
}

export const StepForm = <T extends FieldValues>({
  steps,
  onSubmit,
  className,
  methods,
  submitComponent = (
    <>
      Guardar <FontAwesomeIcon icon={faSave} className="ml-2" />
    </>
  ),
  nextStepComponent = (
    <>
      Siguiente <FontAwesomeIcon icon={faAngleDoubleRight} className="ml-2" />
    </>
  ),
  previousStepComponent = (
    <>
      <FontAwesomeIcon icon={faAngleDoubleLeft} className="mr-2" /> Anterior
    </>
  ),
  canSave = true,
  onlySaveInLastStep = false,
}: StepFormProps<T>) => {
  const internalMethods = useForm<T>({ mode: 'onChange' });
  const finalMethods = methods || internalMethods;
  const location = useLocation();
  const navigate = useNavigate();
  function getStepFromQuery() {
    const params = new URLSearchParams(location.search);
    const step = parseInt(params.get('step') || '0', 10);
    return isNaN(step) ? 0 : Math.max(0, Math.min(steps.length - 1, step));
  }
  const [currentStep, setCurrentStep] = useState(getStepFromQuery());
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (parseInt(params.get('step') || '', 10) !== currentStep) {
      params.set('step', String(currentStep));
      navigate({ search: params.toString() }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Listen for external query param changes
  useEffect(() => {
    const step = getStepFromQuery();
    if (step !== currentStep) setCurrentStep(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);
  const { addToast } = useToast();

  const validateSubmit = async (data: T) => {
    await finalMethods.trigger();
    if (finalMethods.formState.isValid === false) return;
    onSubmit(data);
  };

  const validateAndNext = async () => {
    if (steps[currentStep].canNext && !steps[currentStep].canNext()) {
      addToast(steps[currentStep].canNextMsg || 'No se puede avanzar al siguiente paso.', 'warning');
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  if (steps.length === 0) return <div className="w-full p-6 bg-[var(--background)] text-[var(--font)]">No hay pasos para mostrar</div>;

  return (
    <div className="w-full">
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
        <Form<T> methods={finalMethods} onSubmit={validateSubmit} className={`${steps[currentStep].stepClassName || ''} w-full md:shadow-none`}>
          {steps.map((step, index) => (
            <div key={index} hidden={index !== currentStep}>
              {step.component}
            </div>
          ))}

          <div className={`flex mt-4 ${currentStep > 0 ? 'justify-between' : 'justify-end'}`}>
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                className="transition-shadow duration-200 hover:ring-2 hover:ring-black-400"
              >
                {previousStepComponent}
              </Button>
            )}

            <div className="flex space-x-2">
              {steps[currentStep] &&
                canSave &&
                (finalMethods.formState.isValid || currentStep === steps.length - 1) &&
                (!onlySaveInLastStep || currentStep === steps.length - 1) && (
                  <Button
                    variant="outline"
                    onClick={() => validateSubmit(finalMethods.getValues())}
                    disabled={!finalMethods.formState.isValid}
                    title={!finalMethods.formState.isValid ? 'Por favor, completa todos los campos requeridos.' : 'Guardar cambios'}
                  >
                    {submitComponent}
                  </Button>
                )}

              {currentStep < steps.length - 1 && (
                <Button type="button" variant="primary" title={steps[currentStep].canNextMsg || ''} onClick={validateAndNext}>
                  {nextStepComponent}
                </Button>
              )}
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
