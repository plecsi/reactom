import { FormControl } from './FormControl';
import styles from './index.module.scss'


type TextFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
};

export const TextField = ({ id, name, label, value, onChange, placeholder, error }: TextFieldProps) => (
  <FormControl label={label} htmlFor={name}>
    <input
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      autoComplete="off"
      className={styles.input}
    />
    {error && <span id={`${name}-error`} className="error">{error}</span>}
  </FormControl>
);