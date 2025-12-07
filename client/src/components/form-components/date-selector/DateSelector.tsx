import React from 'react';
import styles from './DateSelector.module.css';

interface DateSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  value,
  onChange,
  label = "Select date and time",
}) => {
  return (
    <label className={styles.label}>
      {label}
      <input
        className={styles.input}
        type="datetime-local"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
};

export default DateSelector;
