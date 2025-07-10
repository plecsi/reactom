// packages/src/FormBuilder/DynamicField.tsx

import React from 'react';
import { FieldConfig } from './types';

interface Props {
  field: FieldConfig;
  onChange: (id: string, value: string) => void;
}

export const DynamicField: React.FC<Props> = ({ field, onChange }) => {
  if (field.readonly) {
    return (
      <div style={{ marginBottom: 8 }}>
        <label>{field.name}: </label>
        <span>{field.value}</span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <label htmlFor={field.id}>{field.name}: </label>
      <input
        id={field.id}
        type={field.type}
        name={field.name}
        value={field.value}
        onChange={e => onChange(field.id, e.target.value)}
      />
    </div>
  );
};
