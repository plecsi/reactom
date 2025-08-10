import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const updateMw = (objRep) => {
  return async function Update(req, res) {
    //const userId = req.user.id; // JWT-ből
    const {id, username, is2FAEnabled } = req.body;
    const User = objRep.user
    console.log('BE id', req.body, is2FAEnabled)

    try {
      const user = await User.findById(id);
      if (!user)
        return res.status(404).json({ error: 'Felhasználó nem található' });


      let qrCode = null;

      if (is2FAEnabled && !user.is2FAEnabled) {
        // Bekapcsoljuk a 2FA-t, generálunk új titkos kulcsot
        const secret = speakeasy.generateSecret();
        user.totpSecret = secret.base32;         // Ezt jól csinálod (ezt mentsd)
        user.is2FAEnabled = true;

        const otpauthUrl = speakeasy.otpauthURL({
          secret: secret.ascii,                  // 🔁 EZT változtasd meg!
          label: `MyApp (${username})`,
          issuer: 'MyApp',
        });

        qrCode = await qrcode.toDataURL(otpauthUrl);
      } else if (!is2FAEnabled && user.is2FAEnabled) {
        // Kikapcsoljuk a 2FA-t
        user.is2FAEnabled = false;
        user.totpSecret = null;
      }
      await user.save();

      res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          is2FAEnabled: user.is2FAEnabled,
          qrCode,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Hiba történt a frissítés során' });
    }
  };
};

export default updateMw;
