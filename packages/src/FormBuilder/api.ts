// packages/src/FormBuilder/api.ts

import { FormConfig } from './types';

const API_BASE = '/api/forms'; // vagy a backend URL-ed

export async function saveForm(form: FormConfig): Promise<void> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!response.ok) {
    throw new Error('Failed to save form');
  }
}

export async function loadForms(): Promise<FormConfig[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to load forms');
  }
  return response.json();
}
