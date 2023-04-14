const { sendOTP, isOTPValid } = require('./util.js');

async function sendOTPController(req, res) {
  const { email } = req.body;

  try {
    const OTP = await sendOTP(email);
    res.status(200).json(OTP);
  } catch (error) {
    res.status(500).json({ message: `Error sending OTP: ${error}` });
  }
}

async function verifyOTPController(req, res) {
  const { email, otp } = req.body;

  try {
    const isValid = await isOTPValid({ email }, otp);
    if (isValid) {
      res.status(200).json({ verified: true });
    } else {
      res.status(401).json({ verified: false, message: 'OTP is invalid or expired.' });
    }
  } catch (error) {
    res.status(500).json({ verified: false, message: `Error verifying OTP: ${error}` });
  }
}

module.exports = { sendOTPController, verifyOTPController };
