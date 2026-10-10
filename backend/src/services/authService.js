const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'travel_genesis_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

const register = async ({ name, email, password, location }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('A user with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    location: location || 'Lagos, Nigeria',
  });

  const token = generateToken(user._id);

  // Trigger welcome notification for new users
  try {
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: user._id,
      title: 'Welcome to Travel Genesis! ✈️',
      message: 'Explore hand-crafted travel packages, discover trending global destinations, and book flights with ease.',
      type: 'promo',
    });
  } catch (notifErr) {
    console.error('Failed to trigger welcome notification:', notifErr.message);
  }

  return {
    user,
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user,
    token,
  };
};

const forgotPassword = async ({ email }) => {
  if (!email) {
    const error = new Error('Please provide your email address');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    const error = new Error('No account found with this email address');
    error.statusCode = 404;
    throw error;
  }

  // Generate a cryptographically secure / 6-digit numeric OTP code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Code expires in 15 minutes
  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  console.log(`[AUTH] ✈️ Password Reset Code for ${user.email}: ${otp}`);

  return {
    success: true,
    message: 'Verification code sent successfully to your email',
    email: user.email,
    otp, // Included for development convenience
  };
};

const resetPassword = async ({ email, otp, newPassword }) => {
  if (!email || !otp || !newPassword) {
    const error = new Error('Please provide email, verification code, and new password');
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 8) {
    const error = new Error('Password must be at least 8 characters long');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    const error = new Error('No account found with this email address');
    error.statusCode = 404;
    throw error;
  }

  if (!user.resetPasswordOtp || user.resetPasswordOtp !== String(otp).trim()) {
    const error = new Error('Invalid verification code. Please check and try again.');
    error.statusCode = 400;
    throw error;
  }

  if (!user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
    const error = new Error('Verification code has expired. Please request a new code.');
    error.statusCode = 400;
    throw error;
  }

  // Set new password (pre-save hook will hash it with bcrypt)
  user.password = newPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Create security notification
  try {
    const Notification = require('../models/Notification');
    await Notification.create({
      userId: user._id,
      title: 'Password Changed 🔒',
      message: 'Your account password was successfully reset. If you did not make this change, please contact support.',
      type: 'account',
    });
  } catch (notifErr) {
    console.error('Failed to trigger password change notification:', notifErr.message);
  }

  return {
    success: true,
    message: 'Password reset successfully. You can now log in.',
  };
};

module.exports = {
  generateToken,
  register,
  login,
  forgotPassword,
  resetPassword,
};

