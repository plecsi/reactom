import React, { useRef, useState, useEffect } from 'react';
import { useFormContext } from '../form/useFormContext';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  options: Option[];
  placeholder?: string;
  readonly?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
                                                          name,
                                                          options,
                                                          placeholder = 'Select...',
                                                          readonly = false,
                                                        }) => {
  const { values, setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(opt => opt.value === values[name]);

  return (
    <div ref={ref} style={{ position: 'relative', width: 200 }}>
      <div
        tabIndex={0}
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          cursor: readonly ? 'not-allowed' : 'pointer',
          background: readonly ? '#f5f5f5' : '#fff',
        }}
        onClick={() => !readonly && setOpen(o => !o)}
      >
        {selected ? selected.label : <span style={{ color: '#aaa' }}>{placeholder}</span>}
      </div>
      {open && !readonly && (
        <ul
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            border: '1px solid #ccc',
            background: '#fff',
            zIndex: 10,
            maxHeight: 180,
            overflowY: 'auto',
          }}
        >
          {options.map(opt => (
            <li
              key={opt.value}
              style={{
                padding: '8px',
                cursor: 'pointer',
                background: values[name] === opt.value ? '#eee' : '#fff',
              }}
              onClick={() => {
                setValue(name, opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectField;