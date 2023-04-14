const User = require("./model.js");
const { hashData } = require("./../../utils/hashData.js");
const { validationResult } = require("express-validator");
const createToken = require("./../../utils/createToken");
const { requireTokenThen } = require("./../../auth");
const { authenticateUserGoogle, createUser, decodeGoogleToken } = require("./util.js");

async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { googleId, googleToken } = req.body;

    let user = await authenticateUserGoogle(googleId, googleToken);

    // Create a new user if one doesn't exist for the Google account
    if (!user) {
      console.log(user, googleToken, googleId);
      user = await createUser(googleId, googleToken);
    }

    const token = await createToken({ userId: user._id });

    user.token = token;

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: `Server ${err}` });
  }
}

const testValidation = requireTokenThen(async (req, res, token) => {
  res.json([`Hey bro! ${token}`]);
});

module.exports = { createUser, login, testValidation };
