import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import {
  useSettings,
  SettingsSaga,
  SettingsReducer,
  SettingsSliceKey, SettingsSelectors
} from '@react/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Settings() {

   const { items } = useSettings();


  console.log(items);


  return (
    <div>
      <h1>Settings Component</h1>
      <p>This is a placeholder for the settings component.</p>
    </div>
  );
}
