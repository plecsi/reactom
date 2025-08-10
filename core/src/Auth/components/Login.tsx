import React, { useState } from 'react';
import { useAuth } from '../hook';
import { ProfileSettings } from './Profile'; // a saját auth hookod

export function Login() {
  const { login, verify2FA, isAuthenticated, requires2FA, error, loading, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify2FA(code);
  };

  if (isAuthenticated) {
    return <div>Üdvözlünk, be vagy jelentkezve! <button onClick={logout} disabled={loading}>Kilép</button>
      <ProfileSettings/></div>;
  }

  if (requires2FA) {
    return (
      <form onSubmit={handle2FASubmit}>
        <label>2FA kód:</label>
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
          required
          maxLength={6}
          pattern="\d{6}"
          placeholder="Írd be a 6 jegyű kódot"
        />
        <button type="submit" disabled={loading}>Ellenőrzés</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    );
  }

  return (
    <form onSubmit={handleLoginSubmit}>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Felhasználónév"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Jelszó"
        required
      />
      <button type="submit" disabled={loading}>Bejelentkezés</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}
