import React, { ChangeEvent, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import styles from './ColorPicker.module.css';

type Props = {
  label: string;
  id?: string;
  value: string;
  onChange: (color: string) => void;
  labelAbove?: boolean;
};

export default function ColorPicker({
  label, id: propsId, value, onChange, labelAbove = false,
}: Props) {
  const [id, setId] = useState(propsId);
  useEffect(() => setId(propsId ?? uuid()), [propsId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <label htmlFor={id} className={`${styles['label']} ${labelAbove ? styles['above'] : ''}`}>
      <span>{label}</span>
      <input id={id} type="color" value={value} onChange={handleChange} className={styles['input']} />
    </label>
  );
}