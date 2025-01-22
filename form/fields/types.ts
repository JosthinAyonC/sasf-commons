import { FieldError, FieldValues, Path, RegisterOptions, UseControllerProps, UseFormRegister } from 'react-hook-form';

/*
 * Interfaz del estado del componente Form.
 * Este se encarga de guardar los valores de los campos del formulario.
 */
export interface FormState {
  [key: string]: string | number | boolean | string[];
}

/*
 * Interfaz de las propiedades del componente InputText, además excluimos las propiedades min, max, step y pattern de las propiedades de un input number.
 */
export interface TextFieldProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  className?: string;
  disabled?: boolean;
  register: UseFormRegister<T>;
  minLength?: number;
  maxLength?: number;
  error?: FieldError;
  type?: 'text' | 'email' | 'password';
  placeholder?: string;
  defaultValue?: string;
  isRequired?: boolean;
  validatePassword?: boolean;
  validateEmail?: boolean;
  onChange?: (_value: string) => void;
}

/*
 * Interfaz de las propiedades del componente DataPickerProps
 */
export interface DatePickerFieldProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  minDate?: Date;
  maxDate?: Date;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  isRequired?: boolean;
  onChange?: (_value: Date) => void;
  defaultValue?: Date;
  yearUpRange?: number;
  yearDownRange?: number;
}

/*
 * Interfaz de las propiedades del componente InputNumber.
 */
export interface NumberFieldProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  register: UseFormRegister<T>;
  min?: number;
  max?: number;
  error?: FieldError;
  placeholder?: string;
  defaultValue?: number;
  isRequired?: boolean;
  onChange?: (_value: number) => void;
}

/*
 * Interfaz de las propiedades del componente Checkbox.
 */
export interface CheckboxFieldProps<T> {
  label: string;
  name: string;
  register: (_name: string, _options?: RegisterOptions) => T;
  defaultChecked?: boolean;
  error?: { message?: string };
  checkClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  isDisabled?: boolean;
}

/*
 * Interfaz de las propiedades del componente SelectField.
 */
export interface SelectFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
  options?: { label: string; value: number | string }[];
  register: UseFormRegister<T>;
  error?: FieldError;
}

/*
 * Interfaz de las propiedades del componente RadioGroup.
 */
export interface RadioGroupProps<T extends FieldValues> {
  name: Path<T>;
  options: { label: string; value: string | number }[];
  register: UseFormRegister<T>;
  required?: boolean;
  defaultCheckedValue?: string | number;
  error?: { message?: string };
  groupClassName?: string;
  optionClassName?: string;
  optionLabelClassName?: string;
  errorClassName?: string;
}

export interface ComboboxFieldProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  setValue: (_name: Path<T>, _value: string) => void;
  updatevalues?: (_input: string) => void;
  scrollupdate?: (_input: string) => void;
  upperInput?: boolean;
  error?: FieldError;
  errorClassName?: string;
  name: Path<T>;
  label: string;
  type: string;
  values: string[];
  defaultValue?: string;
  placeholder: string;
  labelNotFound: string;
}

export interface ButtonProps {
  variant?: 'outline' | 'primary';
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface GoBackButtonProps {
  className?: string; // Permite personalizar estilos del botón
  label?: string; // Texto opcional para mostrar en el botón
}

export interface Column {
  header: string;
  accessor: string;
}

export interface TableProps {
  columns: Column[];
  data: Array<Record<string, string | number>>; // Permite datos que sean strings o números.
  updateTable: (_page: number, _pageSize: number) => void;
  registersTotal: number;
  title?: string;
  isLoadingData?: boolean;
  titleClassName?: string;
}

export interface RadioButtonProps {
  name: string;
  value: string | number;
  label: string;
  defaultChecked?: boolean;
  isRequired?: boolean;
  optionClassName?: string;
  optionLabelClassName?: string;
}

export interface Option {
  label: string;
  value: string | number;
}

export interface DropdownFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  options: Option[];
  isMulti?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  className?: string;
  isRequired?: boolean;
  labelClassName?: string;
  errorClassName?: string;
  containerClassName?: string;
  label?: string;
}
