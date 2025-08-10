// src/toast/ToastProvider.tsx
import React, { createContext, ReactNode } from 'react';
import { ToastContainer } from './Toast';
import { ToastContextValue } from './types';

createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};
