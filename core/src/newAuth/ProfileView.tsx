import React, { useEffect, useState } from 'react';
import { useUser } from './useUser';
import { useAuth } from './useAuth';

export const ProfileView: React.FC = () => {
  const { profile, fetchProfile, updateProfile, logout } = useUser();
  const { auth } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(profile?.qrCode || null);



  const fetchedRef = React.useRef(false);



 /* React.useEffect(() => {
    if (auth.user?.id) {
      fetchProfile({ userId: auth.user.id });
    }
  }, [auth.user, fetchProfile]);*/

  React.useEffect(() => {
    if (auth.user && !fetchedRef.current) {
      fetchProfile({ userId: auth.user.id });
      fetchedRef.current = true;
    }

    if (!auth.user) {
      fetchedRef.current = false; // logout után reset, hogy újra lehessen lekérni ha bejelentkezik
    }
  }, [auth.user, fetchProfile]);

  useEffect(() => {
    if (profile) {

      setQrCode(profile.qrCode || null)
    }
  }, [profile]);

  if (!profile) return <div>Loading profile...</div>;

  const toggle2fa = () => {
    // In a real flow enabling 2FA requires setup -> verify -> enable. This toggles state via profile endpoint (demo).
    updateProfile({ userId: profile.id, is2FAEnabled: !profile.is2FAEnabled });
  };

  return (
    <div>
      <h3>Profile</h3>
      <div>Email: {profile.email}</div>
      <div>2FA enabled: {String(profile.is2FAEnabled)}</div>
      <button onClick={toggle2fa}>Toggle 2FA (demo)</button>
      <button onClick={logout}>Logout</button>

      {qrCode ? <img src={qrCode} alt="QR kód" /> : null}

    </div>
  );
};
