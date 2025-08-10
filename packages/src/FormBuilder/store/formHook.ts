import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import formsReducer, {
  clearSelectedForm,
  formBuilderSliceKey,
  loadFormsRequest,
  selectFormForEdit,
} from './formSlice';
import { formBuilderSaga } from './formSaga';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveItem,
  selectFormById,
  selectFormsEntities,
  selectFormsError,
  selectFormsLoading, selectOngoing
} from './selectors';
import { useCallback, useEffect } from 'react';
import { FormConfig } from '../types';

export function useFormBuilder() {
  useInjectReducer({ key: formBuilderSliceKey, reducer: formsReducer });
  useInjectSaga({ key: formBuilderSliceKey, saga: formBuilderSaga });

  const dispatch = useDispatch();

  const forms = useSelector(selectFormsEntities) as FormConfig[];
  const loading = useSelector(selectFormsLoading);
  const error = useSelector(selectFormsError);
  const activeItem = useSelector(selectActiveItem);
  const ongoing = useSelector(selectOngoing);

  const handleEdit = useCallback(
    (formId: string) => {
      const form = forms.find((f) => f._id === formId);

      // console.log('handleEdit called with formId:', formId);
      //console.log('form:', form);
      if (form) {
        dispatch(selectFormForEdit(form));
      }
    },
    [dispatch, forms]
  );

  // refresh
  const refreshForms = useCallback(() => {
    console.log('Refreshing forms...');

      dispatch(loadFormsRequest());
      dispatch(clearSelectedForm());

  }, [dispatch]);

  useEffect(() => {
    dispatch(loadFormsRequest());
  }, [dispatch]);

  return {
    forms,
    loading,
    error,
    refreshForms,
    activeItem,
    handleEdit,
    ongoing,
  };
}

export function useForm(id: string) {
  useInjectReducer({ key: formBuilderSliceKey, reducer: formsReducer });
  useInjectSaga({ key: formBuilderSliceKey, saga: formBuilderSaga });

  const dispatch = useDispatch();

  const form = useSelector(selectFormById(id));

  //console.log('useForm called with id:', id, form);

  return {
    form,
  };
}
