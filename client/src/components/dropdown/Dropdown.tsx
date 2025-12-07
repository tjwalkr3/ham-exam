import React from 'react';
import styles from './Dropdown.module.css';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  helperText?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  helperText,
}) => {
  return (
    <div className={styles.container}>
      <label
        htmlFor={id}
        className={styles.label}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.select}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <p className={styles.helperText}>{helperText}</p>
      )}
    </div>
  );
};

export default Dropdown;
