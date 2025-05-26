/**
 * Etos tipos son diseñados para los componentes de formulario de SASF COMMONS,
 * la necesidad de separarlos en ui y field, surge de que los componentes fields no pueden ser
 * utilizados sin un form context, por lo que se necesita un componente ui que pueda ser utilizado
 */
export interface CheckBoxUiProps {
  defaultChecked?: boolean;
  checked?: boolean;
  className?: string;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export interface TextFieldUIProps {
  type: string;
  placeholder?: string;
  inputClassName?: string;
  disabled?: boolean;
  onChange: (_value: string) => void;
  value?: string;
  additionalInformation?: React.ReactNode;
}

export interface DatePickerUIProps {
  selected?: Date | null;
  onChange?: (_date: Date | null) => void;
  onChangeRange?: (_dates: [Date | null, Date | null]) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: string;
  inputClassName?: string;
  yearUpRange?: number;
  yearDownRange?: number;
  placeholderText?: string;
  defaultRange?: { startDate: Date | null; endDate: Date | null };
}
