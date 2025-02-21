import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, FieldValues } from 'react-hook-form';

import { DatePickerFieldProps } from './types';

export const DatePickerField = <T extends FieldValues>({
  label,
  name,
  labelClassName,
  inputClassName,
  errorClassName,
  isRequired = false,
  minDate,
  maxDate,
  defaultValue,
  yearUpRange = 50,
  yearDownRange = 50,
}: DatePickerFieldProps<T>) => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: yearUpRange + yearDownRange + 1 }, (_, i) => currentYear - yearDownRange + i);

  return (
    <div className="relative">
      <style>{`
  .react-datepicker {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    background-color: var(--bg);
  }

  .react-datepicker__header {
    background-color: var(--secondary);
    color: var(--font);
    border-bottom: 1px solid var(--border);
    padding: 10px;
    font-weight: bold;
  }

  .react-datepicker__month-container {
    background-color: var(--bg);
    }

  .react-datepicker__day {
    color: var(--font);
    font-size: 14px;
    border-radius: 6px;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: var(--secondary);
    color: var(--bg);
    font-weight: bold;
    border-radius: 6px;
  }

`}</style>
      {label && (
        <label htmlFor={name as string} className={`block mb-1 text-[var(--font)] font-semibold ${labelClassName}`}>
          {label}
          {isRequired && <span className="text-[var(--error)] ml-1">*</span>}
        </label>
      )}
      <Controller
        name={name}
        defaultValue={defaultValue ? (defaultValue as unknown as T[keyof T]) : undefined}
        rules={{
          required: isRequired ? 'Este campo es obligatorio' : undefined,
          validate: {
            min: (value) => !minDate || (value && new Date(value) >= minDate) || 'La fecha debe ser posterior a la fecha mínima.',
            max: (value) => !maxDate || (value && new Date(value) <= maxDate) || 'La fecha debe ser anterior a la fecha máxima.',
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <DatePicker
              selected={value && !isNaN(new Date(value).getTime()) ? new Date(value) : null}
              onChange={(date) => onChange(date)}
              dateFormat="dd/MM/yyyy"
              minDate={minDate}
              maxDate={maxDate}
              calendarClassName="bg-[var(--bg)] rounded-lg shadow-md font-sans"
              dayClassName={(date) =>
                value && new Date(value).toISOString() === date.toISOString()
                  ? 'bg-[var(--secondary)] text-[var(--bg)] hover:text-[var(--bg)] hover:bg-[var(--primary)]'
                  : 'hover:text-[#000000] text-[var(--font)]'
              }
              showIcon
              icon={<FontAwesomeIcon icon={faCalendar} />}
              calendarIconClassName="text-[var(--font)] right-0 top-0 mt-1"
              className={`w-full border ${
                error ? 'border-[var(--error)]' : 'border-[var(--border)]'
              } rounded-md p-2 focus:outline-none focus:border-[var(--focus)] transition duration-150 ease-in-out placeholder:text-[var(--placeholder)] bg-[var(--bg)] text-[var(--font)] ${inputClassName}`}
              placeholderText="Seleccione una fecha"
              renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                <div className="flex justify-between items-center mb-2 px-2 bg-transparent">
                  {/* Flecha de mes anterior */}
                  <button
                    type="button"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="text-[var(--placeholder)] text-xl hover:text-[var(--font)] transition"
                  >
                    &#8249;
                  </button>

                  {/* Selector de mes */}
                  <select
                    value={date.getMonth()}
                    onChange={(e) => changeMonth(parseInt(e.target.value))}
                    className="bg-[var(--hover2)] text-[var(--font)] rounded-md px-2 py-1 focus:outline-none"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>

                  {/* Selector de año */}
                  <select
                    value={date.getFullYear()}
                    onChange={(e) => changeYear(parseInt(e.target.value))}
                    className="bg-[var(--hover2)] text-[var(--font)] rounded-md px-2 py-1 focus:outline-none ml-2"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  {/* Flecha de mes siguiente */}
                  <button
                    type="button"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="text-[var(--placeholder)] text-xl hover:text-[var(--font)] transition"
                  >
                    &#8250;
                  </button>
                </div>
              )}
            />
            {error && <span className={`text-[var(--error)] text-sm mt-1 ${errorClassName}`}>{error.message}</span>}
          </>
        )}
      />
    </div>
  );
};
