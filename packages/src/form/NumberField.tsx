import { FormControl } from './FormControl';

type NumberFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
};

export const NumberField = ({ name, label, value, onChange, placeholder, error }: NumberFieldProps) => (
  <FormControl label={label} htmlFor={name}>
    <input
      type="number"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <span id={`${name}-error`} className="error">{error}</span>}

  </FormControl>
);