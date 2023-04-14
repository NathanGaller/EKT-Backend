const OTP = require('./model.js');
const nodemailer = require('nodemailer');
const { hashData, compareData } = require('./../../utils/hashData');

const { EMAIL, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
});

async function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function saveOTP(email, otp, otpExpiration = 300000) {
  const hashedOTP = await hashData(otp);
  const newOTP = new OTP({
    email,
    otp: hashedOTP,
    otpExpiration,
  });
  const savedOTP = await newOTP.save();
  return savedOTP;
}

async function sendOTPEmail(email, otp, otpExpiration, customSubject, customMessage) {
  const minutes = otpExpiration / 60000;
  const subject = customSubject || 'Your OTP for authentication';
  const message = customMessage || 'Your Verification Code is:';
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: subject,
    html: `
      <div>
        <h1 style="font-size: 24px; color: #333; margin-bottom: 16px;">${message}</h1>
        <p style="font-size: 18px; color: #666; margin-bottom: 16px;">${otp}</p>
        <p style="font-size: 14px; color: #999;">This OTP will expire in ${minutes} minute${minutes > 1 ? 's' : ''}.</p>
        <p style="font-size: 14px; color: #999;">"Let the beauty we love be what we do. There are hundreds of ways to kneel and kiss the ground." - Rumi</p>
      </div>
    `,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('OTP sent successfully: ' + info.response);
}


async function sendOTP(email, otpExpiration = 300000, customSubject) {
  const otp = await generateOTP();
  const savedOTP = await saveOTP(email, otp, otpExpiration);
  await sendOTPEmail(email, otp, otpExpiration, customSubject);
  return savedOTP;
}

async function isOTPValid(otpObject, inputOTP) {
  const otp = await OTP.findOne({ email: otpObject.email }).exec();
  if (!otp) {
    return false;
  }
  const now = Date.now();
  const expirationTime = otp.createdAt.getTime() + otp.otpExpiration;
  if (now > expirationTime) {
    return false;
  }
  const isValid = await compareData(inputOTP, otp.otp);
  return isValid;
}

async function verifyOTP(email, inputOTP) {
  const otp = await OTP.findOne({ email }).exec();
  if (!otp) {
    throw new Error(`OTP for ${email} not found`);
  }
  const isValid = await isOTPValid({ email: otp.email }, inputOTP);
  if (!isValid) {
    throw new Error(`Invalid OTP for ${email}`);
  }
  return otp;
}


async function deleteOTP(otp) {
  try {
    const deletedOTP = await OTP.findByIdAndDelete(otp._id).exec();
    return deletedOTP;
  } catch (error) {
    throw new Error(`Error deleting OTP: ${error.message}`);
  }
}

module.exports = { sendOTP, isOTPValid, verifyOTP, deleteOTP };