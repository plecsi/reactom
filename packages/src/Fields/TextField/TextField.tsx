import React from 'react';
import { Input } from '@react/Input';

export default function TextField({ id, name, type = 'text', placeholder, value }) {
  return (
    <div className="fields">
      <label>Form Name:</label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}
