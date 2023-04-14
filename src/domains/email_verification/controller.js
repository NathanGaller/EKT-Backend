const User = require("./../user/model.js");
const { sendOTP, verifyOTP, deleteOTP } = require("./../otp/util.js");

async function sendVerificationEmail(email) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`No account with email ${email}`);
    }

    const otp = await sendOTP(email);

    return otp;
  } catch (error) {
    throw error;
  }
}

const updateUserVerificationStatus = async (user) => {
  user.verified = true;
  await user.save();
}

const verifyUserEmail = async (email, otp) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`No account with email ${email}`);
  }

  const validOTP = await verifyOTP(email, otp);
  if (!validOTP) {
    throw new Error("Invalid OTP");
  }

  await updateUserVerificationStatus(user);

  deleteOTP({ email });

  return true;
}

module.exports = { sendVerificationEmail, verifyUserEmail };