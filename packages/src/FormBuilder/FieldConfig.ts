import { FieldType } from './FieldTypes';

export interface FieldConfig {
  id: string;
  type: FieldType;
  name: string;
  readonly: boolean;
  value: string;
}