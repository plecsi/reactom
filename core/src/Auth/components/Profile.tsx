// Készítsünk részletes, moduláris megoldást a profil szerkesztésére és 2FA beállítására,
// amely illeszkedik a meglévő React + Redux + Saga + Express rendszeredhez.

// --- 1. Frontend: Profil szerkesztő komponens (ProfileSettings.tsx) ---

import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAuth } from '../hook';

export function ProfileSettings() {
  const { user, updateUser, loading, error } = useAuth();

  const [username, setUsername] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(user?.qrCode || null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setTwoFAEnabled(user.is2FAEnabled || false);
      setQrCode(user.qrCode || null)
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await updateUser({ username, is2FAEnabled: twoFAEnabled });
      console.log('RESPONSE UPDATE USEER', response)
     /* if (response?.qrCode) {
        setQrCode(response.qrCode);
        setMessage('Kérjük, olvassa be a QR kódot a Google Authenticator alkalmazásban.');
      } else {
        setQrCode(null);
        setMessage('Adatok sikeresen frissítve.');
      }*/
    } catch {
      setMessage('Hiba történt a mentés során.');
    }
  };

  return (
    <div>
      <h2><FormattedMessage id="profile.settings" defaultMessage="Profil beállítások" /></h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label><FormattedMessage id="profile.username" defaultMessage="Felhasználónév" /></label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={twoFAEnabled}
              onChange={e => setTwoFAEnabled(e.target.checked)}
            />
            <FormattedMessage id="profile.enable2fa" defaultMessage="Kétfaktoros hitelesítés engedélyezése" />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          <FormattedMessage id="profile.save" defaultMessage="Mentés" />
        </button>
      </form>
      {message && <p>{message}</p>}
      {qrCode && (
        <div>
          <p><FormattedMessage id="profile.scanQr" defaultMessage="Olvassa be a QR kódot az Authenticator alkalmazásban:" /></p>
          <img src={qrCode} alt="QR kód" />
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
