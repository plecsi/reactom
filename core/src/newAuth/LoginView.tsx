import React, { useState } from 'react';
import { useAuth } from './useAuth';

export const LoginView: React.FC = () => {
  const { login, auth } = useAuth();

  const [username, setUsername] = useState('plecsi');
  const [password, setPassword] = useState('kecske');
  const [totp, setTotp] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (auth.twoFactorRequired && auth.tempCreds) {
      // Második lépés: TOTP kód küldése a tárolt username/password párossal
      login({
        username: auth.tempCreds.username,
        password: auth.tempCreds.password,
        totp
      });
    } else {
      // Első lépés: csak felhasználónév és jelszó
      login({ username, password });
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>

      {!auth.twoFactorRequired && (
        <>
          <div>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
        </>
      )}

      {auth.twoFactorRequired && (
        <div>
          <label>Enter your 2FA code</label>
          <input
            value={totp}
            onChange={e => setTotp(e.target.value)}
            placeholder="TOTP code"
          />
        </div>
      )}

      <button type="submit">
        {auth.twoFactorRequired ? 'Verify Code' : 'Login'}
      </button>

      {auth.error && (
        <div style={{ color: 'red' }}>{auth.error}</div>
      )}
    </form>
  );
};
