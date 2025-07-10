// packages/src/FormBuilder/types.ts

export type FieldType = 'text' | 'number' | 'email';

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: 'Text',
  number: 'Number',
  email: 'Email',
};

export interface FieldConfig {
  id: string;
  type: FieldType;
  name: string;
  readonly: boolean;
  value: string;
}

export interface FormConfig {
  id: string;
  name: string;
  fields: FieldConfig[];
}
