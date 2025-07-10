import { FormControl } from './FormControl';

type Option = { value: string; label: string };

type SelectFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  error?: string;
};

export const SelectField = ({ name, label, value, onChange, options, error }: SelectFieldProps) => (
  <FormControl label={label} htmlFor={name}>
    <select id={name} name={name} value={value} onChange={onChange}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <span id={`${name}-error`} className="error">{error}</span>}
  </FormControl>
);