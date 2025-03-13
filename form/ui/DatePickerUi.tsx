import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { DatePickerUIProps } from './types';

export const DatePickerUI: React.FC<DatePickerUIProps> = ({
  selected,
  onChange,
  minDate,
  maxDate,
  error,
  inputClassName,
  yearUpRange = 5,
  yearDownRange = 5,
  placeholderText = 'Seleccione una fecha',
}) => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: yearUpRange + yearDownRange + 1 }, (_, i) => currentYear - yearDownRange + i);

  return (
    <div className="relative w-full z-50">
      <style>{`
        .react-datepicker {
          border-radius: 8px;
          overflow: visible;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
          background-color: var(--bg);
        }

        .react-datepicker-popper {
          z-index: 9999 !important;
          position: absolute !important;
        }

        .react-datepicker__header {
          background-color: var(--secondaryalt);
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

        .react-datepicker-wrapper {
          width: 100%;
        }

        .react-datepicker__input-container input {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 8px;
          font-size: 16px;
          background-color: var(--bg);
          color: var(--font);
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .react-datepicker__input-container input:focus {
          border-color: var(--focus);
          outline: none;
        }

        .react-datepicker__calendar-icon {
          color: var(--font);
          right: 8px;
          top: 40%;
          transform: translateY(-50%);
        }

        .react-datepicker__day--disabled {
          color: var(--disabled);
          cursor: not-allowed;
        }
      `}</style>

      <DatePicker
        selected={selected && !isNaN(new Date(selected).getTime()) ? new Date(selected) : null}
        onChange={(date) => {
          if (onChange) {
            onChange(date);
          }
        }}
        dateFormat="dd/MM/yyyy"
        minDate={minDate}
        maxDate={maxDate}
        calendarClassName="bg-[var(--bg)] rounded-lg shadow-md font-sans"
        portalId="root-portal"
        dayClassName={(date) =>
          selected && new Date(selected).toISOString() === date.toISOString()
            ? 'bg-[var(--secondary)] text-[var(--bg)] hover:text-[var(--bg)] hover:bg-[var(--primary)]'
            : 'hover:text-[#000000] text-[var(--font)]'
        }
        showIcon
        icon={<FontAwesomeIcon icon={faCalendar} />}
        calendarIconClassName="text-[var(--font)] right-0 top-0 mt-1"
        className={`w-full border ${
          error ? 'border-[var(--error)]' : 'border-[var(--border)]'
        } rounded-md p-2 focus:outline-none focus:border-[var(--focus)] transition duration-150 ease-in-out placeholder:text-[var(--placeholder)] bg-[var(--bg)] text-[var(--font)] ${inputClassName}`}
        placeholderText={placeholderText}
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
    </div>
  );
};
