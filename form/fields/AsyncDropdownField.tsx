// import React from 'react';
// import { useController } from 'react-hook-form';
// import AsyncSelect from 'react-select/async';

// import { Option } from './types';

// interface SearchableDropdownProps<> {
//   name: string;
//   label?: string;
//   placeholder?: string;
//   loadOptions: (_inputValue: string) => Promise<Option[]>;
//   isRequired?: boolean;
//   isClearable?: boolean;
//   labelClassName?: string;
//   errorClassName?: string;
//   containerClassName?: string;
//   selectClassName?: string;
// }

// // COMPONENTE INCOMPLETO, NO ESTÁ LISTO PARA USARSE
// export const SearchableDropdown = ({
//   name,
//   label,
//   placeholder = 'Seleccione...',
//   loadOptions,
//   isRequired = false,
//   isClearable = true,
//   labelClassName = '',
//   errorClassName = '',
//   containerClassName = '',
//   selectClassName = '',
// }: SearchableDropdownProps) => {
//   const {
//     field: { value, onChange, ref },
//     fieldState: { error },
//   } = useController({
//     name,
//     rules: {
//       required: isRequired ? 'Este campo es obligatorio' : false,
//     },
//   });

//   return (
//     <div className={`w-full ${containerClassName}`}>
//       {label && (
//         <label htmlFor={name} className={`block mb-2 text-sm font-medium ${labelClassName}`}>
//           {label}
//           {isRequired && <span className="text-red-500 ml-1">*</span>}
//         </label>
//       )}
//       <AsyncSelect
//         cacheOptions
//         defaultOptions
//         loadOptions={loadOptions}
//         placeholder={placeholder}
//         isClearable={isClearable}
//         value={value ? { label: value, value } : null}
//         onChange={(selected) => onChange(selected ? selected.value : null)}
//         classNamePrefix="react-select"
//         className={`border rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${selectClassName}`}
//         ref={ref}
//       />
//       {error && <span className={`text-red-500 text-sm mt-1 ${errorClassName}`}>{error.message}</span>}
//     </div>
//   );
// };
