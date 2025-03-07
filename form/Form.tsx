import React from 'react';
import { FieldValues, FormProvider as RHFProvider, UseFormProps, UseFormReturn, useForm } from 'react-hook-form';

interface FormProps<T extends FieldValues> extends UseFormProps<T> {
  children: React.ReactNode;
  onSubmit: (_data: T) => void;
  className?: string;
  methods?: UseFormReturn<T>;
}

export const Form = <T extends FieldValues>({ children, onSubmit, className, methods, ...formOptions }: FormProps<T>) => {
  const internalMethods = useForm<T>(formOptions);
  const finalMethods = methods || internalMethods;

  return (
    <RHFProvider {...finalMethods}>
      <form onSubmit={finalMethods.handleSubmit(onSubmit)} className={`w-full rounded-lg md:shadow-lg max-w-5xl px-6 ${className}`}>
        {children}
      </form>
    </RHFProvider>
  );
};
