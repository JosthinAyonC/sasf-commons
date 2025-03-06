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

export interface DatePickerUIProps {
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  error?: string;
  inputClassName?: string;
  yearUpRange?: number;
  yearDownRange?: number;
}
