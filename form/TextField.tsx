import React from 'react';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<TextFieldProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <label>
        {label}
        <input type="text" value={value} onChange={onChange} />
      </label>
    </div>
  );
};

export default TextField;
