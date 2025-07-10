import { FormControl } from './FormControl';

type TextFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
};

export const TextField = ({ name, label, value, onChange, placeholder, error }: TextFieldProps) => (
  <FormControl label={label} htmlFor={name}>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && <span id={`${name}-error`} className="error">{error}</span>}
  </FormControl>
);