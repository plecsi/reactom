import { InputHTMLAttributes } from 'react';

export interface TextInput extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  name: string;
  readonly?: false;
  value: string;
}