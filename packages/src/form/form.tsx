import React, { useState } from 'react';
import { TextField } from './TextField';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { useIntl } from 'react-intl';
import messages from './messages';

const validateText = (value: string) => (value ? '' : 'Required');
const validateNumber = (value: string) =>
  /^\d+$/.test(value) ? '' : 'Must be a number';
const validateSelect = (value: string) => (value ? '' : 'Select an option');

export const Form = () => {
  const { formatMessage } = useIntl();
  const [values, setValues] = useState({
    textInput: '',
    numberInput: '',
    selectInput: '1',
  });
  const [errors, setErrors] = useState({
    textInput: '',
    numberInput: '',
    selectInput: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    let error = '';
    if (name === 'textInput') error = validateText(value);
    if (name === 'numberInput') error = validateNumber(value);
    if (name === 'selectInput') error = validateSelect(value);

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      textInput: validateText(values.textInput),
      numberInput: validateNumber(values.numberInput),
      selectInput: validateSelect(values.selectInput),
    };
    setErrors(newErrors);
    if (!Object.values(newErrors).some(Boolean)) {
      // Submit logic here
    }
  };

  return (
    <form className="form" autoComplete="off" onSubmit={handleSubmit}>
      <TextField
        name="textInput"
        label="Text Label name"
        value={values.textInput}
        onChange={handleChange}
        placeholder="Example Input"
        error={errors.textInput}
      />
      <NumberField
        name="numberInput"
        label="Number Label name"
        value={values.numberInput}
        onChange={handleChange}
        placeholder="Example Input"
        error={errors.numberInput}
      />
      <SelectField
        name="selectInput"
        label="Select Label name"
        value={values.selectInput}
        onChange={handleChange}
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
        ]}
        error={errors.selectInput}
      />
      <button type="submit">{formatMessage(messages.submit)}</button>
    </form>
  );
};

export default Form;
