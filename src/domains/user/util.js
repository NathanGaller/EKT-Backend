// util.js
const User = require("./model.js");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function createUser(googleId, googleToken) {
  const user = await User.create({ 'google.id': googleId, 'google.token': googleToken });
  return user;
}

async function authenticateUserGoogle(googleId, googleToken) {
  const payload = await decodeGoogleToken(googleToken);

  const userId = payload["sub"];

  // Ensure that the provided googleId matches the ID in the token payload
  if (userId !== googleId) {
    throw new Error("Invalid Google ID");
  }

  // Find the user by their googleId
  const user = await User.findOne({ 'google.id': googleId });

  return user;
}

async function decodeGoogleToken(googleToken) {
  // Verify the Google token
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.payload;
  return payload;
}

module.exports = {
  authenticateUserGoogle,
  createUser,
  decodeGoogleToken,
};
