import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFormsLoading } from './store/selectors';
import { FieldType, FIELD_TYPE_LABELS, FieldConfig } from './types';
import { Input } from '@react/Input';
import { TextField } from '../form/TextField';

interface FieldCreatorProps {
  fields: FieldConfig[];
  onSave: (name: string) => void;
  onCreate: (field: FieldConfig) => void;
  onDelete: (id: string) => void;
  activeItem?: FieldConfig | null;
  editingField?: FieldConfig | null; // új prop
  onUpdate: (field: FieldConfig) => void;
}

export const FieldCreator: React.FC<FieldCreatorProps> = ({
  onSave,
  onCreate,
  activeItem,
  editingField,
  onUpdate,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<FieldType>('text');
  const [name, setName] = useState('');
  const [label, setLabelName] = useState('');
  const [readonly, setReadonly] = useState(activeItem?.readonly || false);
  const [formNaming, setFormNaming] = useState(activeItem?.name || '');
  const loading = useSelector(selectFormsLoading);

  const generateId = () => Math.random().toString(36).slice(2, 9);

  const handleAddClick = () => setStep(2);

  const handleConfirm = useCallback(() => {
    if (editingField) {
      onUpdate({
        _id: editingField._id,
        type,
        name,
        label,
        readonly,
      });
    } else {
      onCreate({
        id: generateId(),
        type,
        name,
        label,
        readonly,
        value: '',
      });
    }
    setStep(1);
    setName('');
    setReadonly(false);
    setType('text');
  }, [editingField, onCreate, onUpdate, type, name, label, readonly]);

  useEffect(() => {
    if (activeItem) {
      setFormNaming(activeItem.name);
      const fields = activeItem.fields as FieldConfig;
      setType(fields?.type || 'text');
      setName(fields?.name || '');

      setLabelName(fields?.label || '');
      setReadonly(fields?.readonly || false);
      setStep(1);
      if (editingField) {
        setStep(2);
        setName(editingField.name);
        setType(editingField.type);
        setReadonly(editingField.readonly || false);
      }
    } else {
      setType('text');
      setName('');
      setLabelName('');
      setReadonly(false);
      setFormNaming('');
      setStep(1);
    }
  }, [activeItem, editingField]);

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <TextField
          id={activeItem ? activeItem._id : 'new-form'}
          name="name"
          label="form Name"
          placeholder="Form name"
          value={formNaming}
          onChange={(e) => setFormNaming(e.target.value)}
        />
        {/* <Input  id={activeItem ? activeItem._id : 'new-form'} name="name"  type="text"  placeholder="Form name" value={formNaming}/>
        <label>Form Name:</label>
        <input
          id={activeItem ? activeItem._id : 'new-form'}
          type="text"
          name="name"
          placeholder="Form name"
          value={formNaming}
          onChange={(e) => setFormNaming(e.target.value)}
          style={{ marginRight: 8 }}
          autoComplete="off"
        />*/}
        <button
          type="button"
          onClick={() => onSave(formNaming)}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Form'}
        </button>
      </div>
      {step === 1 && (
        <>
          <select
            name="type"
            value={type || editingField?.type}
            onChange={(e) => setType(e.target.value as FieldType)}
          >
            {Object.entries(FIELD_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddClick}
            style={{ marginLeft: 8 }}
          >
            Add Field
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <div>
            <label style={{ marginRight: 8 }}>
              <input
                type="checkbox"
                checked={readonly}
                onChange={(e) => setReadonly(e.target.checked)}
              />
              Readonly
            </label>
            <button type="button" onClick={handleConfirm}>
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ marginLeft: 8 }}
            >
              Cancel
            </button>
          </div>
          <div>
            <label style={{ marginRight: 8 }}>Field name:</label>
            <input
              name="name"
              type="text"
              placeholder="input name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginRight: 8 }}
            />
          </div>
          <div>
            <label style={{ marginRight: 8 }}>Field label:</label>
            <input
              name="label"
              type="text"
              placeholder="label name"
              autoComplete="off"
              value={label}
              onChange={(e) => setLabelName(e.target.value)}
              style={{ marginRight: 8 }}
            />
          </div>
        </>
      )}
    </div>
  );
};
