import styles from './TextInput.module.css';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  id: string
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
};

export default function TextInput({
  label,
  id,
  labelProps = {},
  ...inputProps
}: Props) {
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <label className={styles['label']} htmlFor={id} {...labelProps}>
        <span>{label}</span>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input className={styles['input']} id={id} {...inputProps} />
      </label>
    </>
  );
}
