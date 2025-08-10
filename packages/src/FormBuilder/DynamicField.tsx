// packages/src/FormBuilder/DynamicField.tsx

import React from 'react';
import { FieldConfig } from './types';

interface Props {
  field: FieldConfig;
  onChange: (id: string, value: string) => void;
  onDelete: (id: string) => void;
  onEdit: (field: FieldConfig) => void; // új prop
}

export const DynamicField: React.FC<Props> = ({
  field,
  onChange,
  onDelete,
  onEdit,
}) => {
  const onDeleteConfirm = (id: string) => {
    console.log('Deleting field with id:', id);
    onDelete(id);
  };

  const onEditConfirm = (id: string) => {
    console.log('Editing field with id:', id);
    // Here you would typically trigger an edit action, e.g., open a modal or navigate to an edit page
    // For now, we just log the action
  };

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
      <label htmlFor={field._id as string}>{field.label}: </label>
      <span>{field.name}</span>
      <input
        id={field._id as string}
        type={field.type}
        name={field.name}
        value={field.value}
        onChange={(e) => onChange(field._id as string, e.target.value)}
      />
      <button type="button" onClick={() => onEdit(field)}>
        Szerkesztés
      </button>
      <button
        type="button"
        onClick={() => onDeleteConfirm(field._id as string)}
        style={{ marginLeft: 8, color: 'red' }}
      >
        Delete
      </button>
    </div>
  );
};
