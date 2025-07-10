// packages/src/FormBuilder/FormBuilder.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FieldConfig, FormConfig } from './types';
import { FieldCreator } from './FieldCreator';
import { DynamicField } from './DynamicField';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import formsReducer from './store/formSlice';
import { formBuilderSaga } from './store/formSaga';
import { selectFormsEntities, selectFormsLoading, selectFormsError } from './store/selectors';

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

console.log('formsReducer type:', typeof formsReducer);


const FormBuilder: React.FC = () => {
  useInjectReducer({ key: 'formBuilder', reducer: formsReducer });
  useInjectSaga({ key: 'formBuilder', saga: formBuilderSaga });


  const dispatch = useDispatch();

  const forms = useSelector(selectFormsEntities);
  const loading = useSelector(selectFormsLoading);
  const error = useSelector(selectFormsError);

  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
   // dispatch(loadFormsRequest());
  }, [dispatch]);

  const handleCreateField = (field: FieldConfig) => {
    setFields(prev => [...prev, field]);
  };

  const handleDeleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
  };

  const handleFieldChange = (id: string, value: string) => {
    setFields(prev =>
      prev.map(f => (f.id === id ? { ...f, value } : f))
    );
  };

  const handleSave = () => {
    if (!formName.trim()) {
      alert('Please enter a form name.');
      return;
    }
    if (fields.length === 0) {
      alert('Please add at least one field.');
      return;
    }
    const formToSave: FormConfig = {
      id: generateId(),
      name: formName.trim(),
      fields,
    };
    dispatch(saveFormRequest(formToSave));
    setSuccess('Saving form...');
  };

  useEffect(() => {
    if (!loading && !error && success) {
      setSuccess('Form saved successfully!');
      setFormName('');
      setFields([]);
      setTimeout(() => setSuccess(null), 3000);
    }
  }, [loading, error, success]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Form name"
          value={formName}
          onChange={e => setFormName(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button type="button" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Form'}
        </button>
      </div>

      <FieldCreator fields={fields} onCreate={handleCreateField} onDelete={handleDeleteField} />

      <form>
        {fields.map(field => (
          <DynamicField key={field.id} field={field} onChange={handleFieldChange} />
        ))}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h3>Saved Forms</h3>
      {forms && Object.values(forms).length === 0 && <p>No saved forms.</p>}
      <ul>
        {forms && Object.values(forms).map(form => (
          <li key={form.id}>{form.name} ({form.fields.length} fields)</li>
        ))}
      </ul>
    </div>
  );
};

export default FormBuilder;
