import {
  FocusEvent, useEffect, useMemo, useRef, useState,
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
  const input = useRef<HTMLInputElement>(null);

  const valueString = useMemo(() => {
    if (!value) {
      return '';
    }
    const opts: Intl.DateTimeFormatOptions[] = [
      { year: 'numeric' },
      { month: '2-digit' },
      { day: '2-digit' },
    ];

    const str = opts
      .map((opt) => value.toLocaleDateString('en', { ...opt, timeZone: 'utc' }))
      .join('-');

    // make sure the year is a full 4 digits by adding leading zeroes as needed
    return `${'0'.repeat(4 - str.indexOf('-'))}${str}`;
  }, [value]);

  // update the input's value as needed here rather than via the value prop so
  // that its value can change while the date is only partially entered
  useEffect(() => {
    const i = input.current;
    if (i) {
      i.value = valueString;
    }
  }, [valueString]);

  return (
    <label
      className={`${styles['label']} ${labelAbove ? styles['above'] : ''}`}
      htmlFor={id}
    >
      <span>{label}</span>
      <input
        id={id}
        type="date"
        ref={input}
        // trigger change on blur because doing so on change causes problems
        // when editing the date, e.g. with leading zeroes
        onBlur={(e: FocusEvent<HTMLInputElement>) => onChange(e.target.valueAsDate)}
        className={`${styles['input']} : ${value ? '' : styles['empty']}`}
      />
    </label>
  );
}
