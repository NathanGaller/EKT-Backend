const express = require('express');
const { body } = require('express-validator');
const router  = express.Router();
const { sendOTPController, verifyOTPController } = require('./controller.js');

router.post('/verify', [
  body('email').isEmail().withMessage('Invalid email.'),
  body('otp').isNumeric().withMessage('OTP should be numeric.'),
], verifyOTPController);

module.exports = router;
