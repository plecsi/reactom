import { Modules } from '@react/modules';
import { FormBuilder, Form } from '@react/Input';
import { useCallback, useEffect, useState } from 'react';
import {
  LanguageSelector,
  DefaultMessages as messages,
  useAuth,
  //Login,
  ProfileView,
  TwoFactorSetup,
  LoginView,
} from '@react/core';
import { FormattedMessage } from 'react-intl';
import { useSettings } from '@react/core';
import Settings from './components/settings';
export function App() {
  const { isLoggedIn, silentLogin, isAuth } = useAuth();

  console.log('isLoggedIn', isLoggedIn, isAuth);

  useEffect(() => {
    silentLogin();
  }, [silentLogin, isLoggedIn]);

  /*if (!isAuth) {
    return <div>Loading...</div>; // Itt lehet spinner vagy skeleton
  }*/
  return (
    <div>
      <LanguageSelector />

      <FormattedMessage
        id={messages.welcome.id}
        defaultMessage={messages.welcome.defaultMessage}
      />
      <Form />
      <Modules />
      <FormBuilder />

      <div style={{ padding: 20 }}>
        <h1>Two-Factor Auth Demo</h1>
        {!isLoggedIn   ? (
          <LoginView />
        ) : (
          <>
            <ProfileView />
            <TwoFactorSetup />
          </>
        )}
      </div>

      {/*
      <Login />
*/}
      {/*<Settings/>*/}
    </div>
  );
}

export default App;
