// core/src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import entityReducer from './entitySlice';

export const rootReducers = combineReducers({
  entity: entityReducer,
});