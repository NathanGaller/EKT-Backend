const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

const createToken = async (
  tokenData,
  tokenKey = JWT_SECRET,
  tokenExpire = "365d"
) => {
  try {
    const token = await jwt.sign(tokenData, tokenKey, 
      {
        expiresIn: tokenExpire
      });

    return token;
  } catch (error) {
    throw error;
  }
}

module.exports = createToken;