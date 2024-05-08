import React, { useImperativeHandle, useRef } from 'react';
import styles from './TextInput.module.css';

type BaseProps = {
  label: string
  id: string
  labelAbove?: boolean | undefined
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
};

type SingleProps = React.InputHTMLAttributes<HTMLInputElement> & BaseProps & {
  multiLine?: false | undefined
};

type MultiProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & BaseProps & {
  multiLine: true
};

type Props = SingleProps | MultiProps;

function TextInput({
  label,
  id,
  labelAbove = false,
  multiLine = false,
  labelProps = {},
  ...inputProps
}: Props, ref: React.ForwardedRef<{ focus: () => void }>) {
  const singleRef = useRef<HTMLInputElement>(null);
  const multiRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => (multiLine ? multiRef : singleRef).current?.focus(),
  }), [multiLine]);

  return (
    <label
      className={`${styles['label']} ${labelAbove ? styles['above'] : ''}`}
      htmlFor={id}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...labelProps}
    >
      <span>{label}</span>
      {
          multiLine ? (
            <textarea
              ref={multiRef}
              className={styles['input']}
              id={id}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={singleRef}
              className={styles['input']}
              id={id}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )
        }
    </label>
  );
}

export default React.forwardRef(TextInput);
