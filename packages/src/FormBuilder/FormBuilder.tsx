import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FieldConfig, FormConfig } from './types';
import { FieldCreator } from './FieldCreator';
import { DynamicField } from './DynamicField';
import {
  deleteFormRequest,
  editFormRequest,
  formActions,
  saveFormRequest,
} from './store/formSlice';
import { v4 as uuid } from 'uuid';
import { useForm, useFormBuilder } from './store/formHook';
import { useParsedParams, DefaultMessages, useToast } from '@react/core';
import { useIntl } from 'react-intl';
import messages from './messages';

function generateId() {
  return uuid();
}

const FormBuilder = () => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { id: currentId } = useParsedParams();
  const {
    forms,
    loading,
    error,
    activeItem,
    handleEdit,
    refreshForms,
    ongoing,
  } = useFormBuilder();
  const { form: selectedItem } = useForm(currentId as string);
  const { showToast } = useToast();

  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Új mező hozzáadása
  const handleCreateField = (field: FieldConfig) => {
    console.log('handleCreateField', field);
    setFields((prev) => [...prev, field]);
  };

  // Meglévő mező frissítése
  const handleUpdateField = (updatedField: FieldConfig) => {
    console.log('handleUpdateField', updatedField);
    setFields((prev) =>
      prev.map((field) =>
        field._id === updatedField._id ? updatedField : field
      )
    );
  };

  // Mező törlése
  const handleDeleteField = (id: string) =>
    setFields((prev) => prev.filter((f) => f._id !== id));
  // Mező értékének frissítése
  const handleFieldChange = (id: string, value: string) =>
    setFields((prev) => prev.map((f) => (f._id === id ? { ...f, value } : f)));

  // Szerkesztés gomb kezelése
  const handleEditClick = useCallback(
    (formId: string) => {
      handleEdit(formId);
      setEditingField(null);
    },
    [handleEdit]
  );

  const handleDeleteClick = useCallback(
    (formId: string) => {
      if (window.confirm('Biztosan törölni szeretnéd ezt az űrlapot?')) {
        dispatch(deleteFormRequest(formId));
        setSuccess('Űrlap törlése folyamatban...');
      }
    },
    [dispatch]
  );

  const handleEditField = (field: FieldConfig) => {
    setEditingField(field);
  };

  console.log('ÚJ vagy SZERKSZETETT fields', fields);

  // Form mentése
  const handleSave = useCallback(
    (formName: string) => {
      if (!formName.trim()) {
        //alert('Kérlek, adj meg egy űrlapnevet.');
        showToast({
          message: 'Kérlek, adj meg egy űrlapnevet',
          type: 'error',
        });

        return;
      }
      if (fields.length === 0) {
        // alert('Adj hozzá legalább egy mezőt.');
        showToast({
          message: 'Adj hozzá legalább egy mezőt',
          type: 'error',
        });
        return;
      }
      const formToSave: FormConfig = {
        name: formName.trim(),
        fields,
      };

      console.log('formToSave', formToSave);
      if (!activeItem) {
        console.log('Saving new form');
        dispatch(saveFormRequest(formToSave));
      } else {
        console.log('Saving update form');
        formToSave._id = activeItem._id;
        dispatch(editFormRequest(formToSave));
      }
      setSuccess('Űrlap mentése folyamatban...');
    },
    [activeItem, dispatch, fields, showToast]
  );

  // Sikeres mentés visszaállítása
  useEffect(() => {
    if (ongoing && success) {
      setSuccess('Űrlap sikeresen mentve!');
      showToast({
        message: 'Űrlap sikeresen mentve!',
        type: 'success',
      });
      setFields([]);
      dispatch(formActions.clearSelectedForm());
      //refreshForms();
      setTimeout(() => setSuccess(null), 3000);
    }
  }, [success, dispatch, refreshForms, ongoing, showToast]);

  // Szerkesztés példányosításkor töltsük fel a mezőket
  useEffect(() => {
    if (activeItem?.fields) setFields(activeItem.fields);
  }, [activeItem]);

  return (
    <div>
      <form>
        <FieldCreator
          onSave={handleSave}
          fields={fields}
          onCreate={handleCreateField}
          onDelete={handleDeleteField}
          activeItem={activeItem || null}
          editingField={editingField}
          onUpdate={handleUpdateField} // új prop
        />
        <h4>Aktuális mezők</h4>
        {fields.length === 0 && <p>Még nincs hozzáadott mező.</p>}
        {fields.map((field) => (
          <DynamicField
            key={field._id as string}
            field={field}
            onChange={handleFieldChange}
            onDelete={handleDeleteField}
            onEdit={handleEditField}
          />
        ))}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h3>{formatMessage(messages.savedForms)}</h3>

      <ul>
        {forms.map((form, index) => (
          <li key={`form-${index}`}>
            <span>{form.name}</span>
            <button onClick={() => handleEditClick(form?._id as string)}>
              {formatMessage(DefaultMessages.edit)}
            </button>
            <button onClick={() => handleDeleteClick(form?._id as string)}>
              {formatMessage(DefaultMessages.delete)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormBuilder;
