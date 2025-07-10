// packages/src/FormBuilder/FieldCreator.tsx

import React, { useState } from 'react';
import { FieldType, FIELD_TYPE_LABELS, FieldConfig } from './types';

interface FieldCreatorProps {
  fields: FieldConfig[];
  onCreate: (field: FieldConfig) => void;
  onDelete: (id: string) => void;
}

export const FieldCreator: React.FC<FieldCreatorProps> = ({ fields, onCreate, onDelete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<FieldType>('text');
  const [name, setName] = useState('');
  const [readonly, setReadonly] = useState(false);

  const generateId = () => Math.random().toString(36).slice(2, 9);

  const handleAddClick = () => setStep(2);

  const handleConfirm = () => {
    if (name.trim()) {
      onCreate({
        id: generateId(),
        type,
        name,
        readonly,
        value: '',
      });
      setStep(1);
      setName('');
      setReadonly(false);
      setType('text');
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {step === 1 && (
        <>
          <select value={type} onChange={e => setType(e.target.value as FieldType)}>
            {Object.entries(FIELD_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button type="button" onClick={handleAddClick} style={{ marginLeft: 8 }}>
            Add Field
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Field name"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <label style={{ marginRight: 8 }}>
            <input
              type="checkbox"
              checked={readonly}
              onChange={e => setReadonly(e.target.checked)}
            />
            Readonly
          </label>
          <button type="button" onClick={handleConfirm}>
            Confirm
          </button>
          <button type="button" onClick={() => setStep(1)} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        </>
      )}

      <div style={{ marginTop: 16 }}>
        <h4>Current Fields</h4>
        {fields.length === 0 && <p>No fields added yet.</p>}
        {fields.map(field => (
          <div key={field.id} style={{ marginBottom: 8 }}>
            <span>{field.name} ({FIELD_TYPE_LABELS[field.type]}) {field.readonly ? '[readonly]' : ''}</span>
            <button
              type="button"
              onClick={() => onDelete(field.id)}
              style={{ marginLeft: 8, color: 'red' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
