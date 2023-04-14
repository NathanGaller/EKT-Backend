const jwt = require("jsonwebtoken");
const User = require("../domains/user/model");

const { JWT_SECRET } = process.env;

const requireToken = async (req) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token)
  {
    throw new Error("No token is provided.");
  }

  try {
    const decodedToken = await jwt.verify(token, JWT_SECRET);
    return decodedToken;
  } catch (error) {
    throw new Error("Failed to verify token.");
  }
}

const requireTokenThen = (f) => {
  return async (req, res) => {
    try {
        const token = await requireToken(req);
        f(req, res, token);
    } catch (error) {
      res.status(500).send(`Authentication error: ${error}`);
    } 
  };
}

const getUserFromToken = async (decodedToken) => {
  if (decodedToken && decodedToken.userId) {
    return await User.findById(decodedToken.userId);
  } else {
    throw new Error("User not found in the decoded token.");
  }
}

module.exports = { requireTokenThen, getUserFromToken };