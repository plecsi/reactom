// packages/src/FormBuilder/api.ts

import { generateEntityApi } from '@react/core';
import { FormBuilder, FormBuilderInput } from './types';
import formBuilderConfig from './store/config';

export const formApi = generateEntityApi<
  FormBuilder['id'],
  FormBuilder,
  FormBuilderInput,
  true
>({
  path: formBuilderConfig.api,
  validate: true,
});
