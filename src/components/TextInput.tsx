import React, {
  useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Root, createRoot } from 'react-dom/client';
import { v4 as uuid } from 'uuid';
import styles from './TextInput.module.css';

type BaseProps = {
  label: string
  id?: string
  icon?: IconDefinition
  labelAbove?: boolean | undefined
  hideLabel?: boolean | undefined
  autoFocus?: boolean | undefined
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
  id: propsId,
  icon,
  labelAbove = false,
  hideLabel = false,
  multiLine = false,
  autoFocus = false,
  labelProps = {},
  ...inputProps
}: Props, ref: React.ForwardedRef<{ focus: () => void }>) {
  const singleRef = useRef<HTMLInputElement>(null);
  const multiRef = useRef<HTMLTextAreaElement>(null);
  const iconRoot = useRef<Root | null>(null);
  const [id, setId] = useState(propsId);
  useEffect(() => setId(propsId ?? uuid()), [propsId]);

  useImperativeHandle(ref, () => ({
    focus: () => (multiLine ? multiRef : singleRef).current?.focus(),
  }), [multiLine]);

  const [bg, setBg] = useState<string>();

  useEffect(() => {
    if (!icon) {
      setBg(undefined);
      return;
    }

    if (!iconRoot.current) {
      const div = document.createElement('div');
      iconRoot.current = createRoot(div);
      const observer = new MutationObserver(() => {
        setBg(`url(data:image/svg+xml;base64,${btoa(div.innerHTML)})`);
      });
      observer.observe(div, { childList: true });
    }

    iconRoot.current.render(<FontAwesomeIcon icon={icon} />);
  }, [icon]);

  useEffect(() => {
    if (autoFocus) {
      (multiLine ? multiRef : singleRef).current?.focus();
    }
  }, [autoFocus, multiLine]);

  return (
    <label
      className={`${styles['label']} ${labelAbove ? styles['above'] : ''}`}
      htmlFor={id}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...labelProps}
    >
      <span className={hideLabel ? 'a11y-only' : ''}>{label}</span>
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
              className={`${styles['input']} ${bg ? styles['with-icon'] : ''}`}
              id={id}
              style={{ backgroundImage: bg }}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )
        }
    </label>
  );
}

export default React.forwardRef(TextInput);
