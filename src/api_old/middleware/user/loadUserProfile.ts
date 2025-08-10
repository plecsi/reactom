const loadUserProfileMW = (objRepo) => {
  return async (req, res, next) => {
    const id = req.query.id
    const refreshToken = req.query.refreshToken

    const userModel = objRepo.user;

    console.log('QUERY', id, refreshToken, userModel)

    if (id) {
      //res.locals.user = objRepo.User.findOne(e=> e._id === id) || [];

    } else if (refreshToken) {
      const user = await userModel.findOne({ refreshTokens: req.query.refreshToken });
      if(user) res.json({user: { id: user._id, username: user.username }});
    } else {
      res.status(400).json({ error: 'Hiányzó id vagy accessToken' });
    }


    if(typeof res.locals.user === 'undefined') {
      //404
      return res.json({"error": "user not found"});
    }

    return next();
  }
}

export default loadUserProfileMW;