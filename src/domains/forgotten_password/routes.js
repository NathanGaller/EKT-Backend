const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { sendPasswordResetEmail, resetPassword } = require("./controller.js");

router.post(
  "/",
  body("email").isEmail().withMessage("Email is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      await sendPasswordResetEmail(email);
      res.status(200).json({ message: "Password reset email sent successfully." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.post(
  "/reset_password",
  body("email").isEmail().withMessage("Email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("otp").notEmpty().withMessage("Reset token is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, otp } = req.body;

    try {
      await resetPassword(email, password, otp);
      res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;