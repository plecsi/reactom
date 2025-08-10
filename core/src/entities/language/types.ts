import { Entity } from '../../store/types';

export interface Language extends Entity {
  code: string;
  label: string;
}


export interface LanguageState {
  data?: Language;
  loading: boolean;
  error?: string;
}