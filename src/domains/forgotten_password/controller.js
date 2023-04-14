const User = require("./../user/model.js");
const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/util.js");
const { hashData } =  require("../../utils/hashData.js");

const sendPasswordResetEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user)
  {
    throw new Error("Unable to find user with provided email.");
  }

  if (!user.verified)
  {
    throw new Error("User is not verified.");
  }

  const OTP = sendOTP(email, 600000, 
    "Reset your Account Password");
}

const resetPassword = async (email, newPassword, otp) => {
  const validOTP = await verifyOTP(email, otp);
  if (!validOTP)
  {
    throw new Error("Invalid OTP.");
  }

  const newHashedPassword = await hashData(newPassword);
  await User.updateOne({ email }, { password: newHashedPassword });

  await deleteOTP(validOTP);
}

module.exports = { sendPasswordResetEmail, resetPassword }