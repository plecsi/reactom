import React, { useState } from 'react';
import client from './clients';
import { useAuth } from './useAuth';

export const TwoFactorSetup: React.FC = () => {
  const { auth } = useAuth();
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const requestSetup = async () => {
    // In real app, userId from auth.user.id or back-end from accessToken
    const userId = auth.user?.id;
    const res = await client.post('/auth/2fa/setup', { userId });
    setQr(res.data.qrDataUrl);
    setSecret(res.data.secretBase32);
  };

  const verify = async () => {
    const userId = auth.user?.id;
    const res = await client.post('/auth/2fa/verify', {
      userId,
      secret,
      token,
    });
    if (res.data.ok) setMessage('2FA enabled!');
  };

  /*return (
    <div>
      <h3>Two-Factor Setup</h3>
  <button onClick={requestSetup}>Request QR</button>
  {qr && <div><img src={qr} alt="QR" /></div>}
  <div>
  <input placeholder="TOTP token from app" value={token} onChange={e => setToken(e.target.value)} />
  <button onClick={verify}>Verify & Enable</button>
    </div>
    {message && <div>{message}</div>}
    </div>
    );*/
}