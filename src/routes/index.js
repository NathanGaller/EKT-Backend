const express = require("express");
const router = express.Router();

const userRoutes = require('./../domains/user/routes');
const OTPRoutes  = require('./../domains/otp/routes');
const EmailVerificationRoutes = require('./../domains/email_verification/routes');
const PasswordResetRoutes = require('./../domains/forgotten_password/routes');
const tarotRoutes = require("../domains/tarot_query/routes");

router.use("/user", userRoutes);
router.use("/tarot", tarotRoutes);

module.exports = router