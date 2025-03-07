import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { DatePickerUIProps } from './types';

export const DatePickerRangeUi: React.FC<DatePickerUIProps> = ({
  onChangeRange,
  minDate,
  maxDate,
  yearUpRange = 5,
  yearDownRange = 5,
  defaultRange = { startDate: null, endDate: null },
}) => {
  const [startDate, setStartDate] = useState<Date | null>(defaultRange.startDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultRange.endDate);

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: yearUpRange + yearDownRange + 1 }, (_, i) => currentYear - yearDownRange + i);

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (onChangeRange && start && end) {
      onChangeRange(dates);
    }
  };

  return (
    <div>
      <style>{`
        .react-datepicker {
          border-radius: 8px;
          overflow: visible;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
          background-color: var(--bg);
        }

        .react-datepicker__day--in-range {
          background-color: var(--secondaryalt);
        }

        .react-datepicker-popper {
          z-index: 9999 !important;
          position: absolute !important;
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
          background-color: var(--disabled-bg);
          cursor: not-allowed;
        }
      `}</style>

      <DatePicker
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        showDisabledMonthNavigation
        dateFormat="dd/MM/yyyy"
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
