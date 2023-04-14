const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { sendVerificationEmail, verifyUserEmail } = require("./controller");

router.post("/", [
  body("email").isEmail(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const otp = await sendVerificationEmail(req.body.email);
    res.status(200).json({ message: "OTP sent successfully", otp });

  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});

router.post("/verify", [
  body("email").isEmail(),
  body("otp").isNumeric(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), verified: false });
    }

    const email = req.body.email;
    const inputOTP = req.body.otp;

    await verifyUserEmail(email, inputOTP);

    return res.status(200).json({verified: true});

  } catch (error) {
    res.status(500).json({ message: `${error}`, verified: false });
  }
});

module.exports = router;
