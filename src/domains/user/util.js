// util.js
const User = require("./model.js");
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const playDeveloperApiClient = google.androidpublisher({
  version: "v3",
  keyFile: process.env.GOOGLE_JSON,
});

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

async function verifySubscription(packageName, subscriptionId, purchaseToken) {
  const result = await playDeveloperApiClient.purchases.subscriptions.get({
    packageName: packageName,
    subscriptionId: subscriptionId,
    token: purchaseToken,
  });
  return result.data;
}

async function subscribe(req, res) {
  try {
    const { userId, packageName, subscriptionId, purchaseToken } = req.body;

    // Verify the subscription details with Google Play Developer API
    const subscription = await verifySubscription(packageName, subscriptionId, purchaseToken);

    if (subscription) {
      await updateSubscriptionStatus(userId, subscriptionId, purchaseToken, "paid");
      res.json({ message: "Subscription updated successfully." });
    } else {
      res.status(400).json({ message: "Invalid subscription data" });
    }
  } catch (err) {
    res.status(500).json({ message: `Server ${err}` });
  }
}

async function cancelSubscription(req, res) {
  try {
    const { userId, packageName, subscriptionId, purchaseToken } = req.body;

    // Verify the subscription details with Google Play Developer API
    const subscription = await verifySubscription(packageName, subscriptionId, purchaseToken);

    if (subscription) {
      // Handle the cancellation with Google APIs
      // You may not need to do anything here, as the cancellation should be handled automatically by Google.

      await updateSubscriptionStatus(userId, null, null, "free");
      res.json({ message: "Subscription cancelled successfully." });
    } else {
      res.status(400).json({ message: "Invalid subscription data" });
    }
  } catch (err) {
    res.status(500).json({ message: `Server ${err}` });
  }
}

module.exports = {
  authenticateUserGoogle,
  createUser,
  decodeGoogleToken,
};
