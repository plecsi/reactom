import { combineReducers } from '@reduxjs/toolkit';

// Example placeholder reducer
const exampleReducer = (state = {}, action: any) => state;

export const rootReducers = combineReducers({
  example: exampleReducer,
});