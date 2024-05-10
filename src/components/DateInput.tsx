import {
  ChangeEvent, useCallback, useMemo, useState,
} from 'react';
import { v4 as uuid } from 'uuid';
import styles from './DateInput.module.css';

type Props = {
  value: Date | null
  onChange: (val: Date | null) => void
  label: string
  labelAbove?: boolean
};

export default function DateInput({
  value,
  onChange,
  label,
  labelAbove = false,
}: Props) {
  const [id] = useState(uuid());

  const valueString = useMemo(() => {
    if (!value) {
      return '';
    }
    const opts: Intl.DateTimeFormatOptions[] = [
      { year: 'numeric' },
      { month: '2-digit' },
      { day: '2-digit' },
    ];

    return opts
      .map((opt) => value.toLocaleDateString('en', { ...opt, timeZone: 'utc' }))
      .join('-');
  }, [value]);

  return (
    <label
      className={`${styles['label']} ${labelAbove ? styles['above'] : ''}`}
      htmlFor={id}
    >
      <span>{label}</span>
      <input
        id={id}
        type="date"
        value={valueString}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.valueAsDate);
        }, [onChange])}
        className={`${styles['input']} : ${value ? '' : styles['empty']}`}
      />
    </label>
  );
}
