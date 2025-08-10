import { RootState } from '@react/core';
import { FormState } from '../types';

declare module '@react/core' {
  export interface RootState {
    [formBuilderSliceKey]: FormState;
  }
}