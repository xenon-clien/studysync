const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PomodoroStats = require('../models/PomodoroStats');
const Streak = require('../models/Streak');
const AppError = require('../utils/AppError');
const { HTTP_STATUS } = require('../constants');
const { sendEmail } = require('./emailService');
const { seedFullStudyDataForUser } = require('../utils/seedStudyData');

function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

exports.issueTokens = async (user) => {
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshJwtToken();
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });
  return { token, refreshToken };
};

exports.registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists', HTTP_STATUS.CONFLICT);
  }

  const user = await User.create({ name, email, password });

  // Populate rich starter study dataset for the new student
  await seedFullStudyDataForUser(user._id, { overwrite: false });

  return user;
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('No account found with this email. Create an account or use Demo Credentials.', HTTP_STATUS.UNAUTHORIZED);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError('Incorrect password. Please try again or reset your password.', HTTP_STATUS.UNAUTHORIZED);
  }

  return user;
};

exports.refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is required', HTTP_STATUS.UNAUTHORIZED);
  }

  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, secret);
  } catch {
    throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await User.findById(decoded.id).select('+refreshTokenHash');
  if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
    throw new AppError('Invalid refresh session', HTTP_STATUS.UNAUTHORIZED);
  }

  const token = user.getSignedJwtToken();
  return { token, user };
};

exports.clearRefreshToken = async (userId) => {
  if (!userId) return;
  await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
};

exports.updateUserProfile = async (userId, { name, email }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const conflict = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } });
  if (conflict) {
    throw new AppError('An account with this email already exists', HTTP_STATUS.CONFLICT);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name: name.trim(), email: normalizedEmail },
    { returnDocument: 'after', runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  return user;
};

exports.updateUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', HTTP_STATUS.UNAUTHORIZED);
  }

  user.password = newPassword;
  await user.save();
  return user;
};

exports.createPasswordReset = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('No account found with that email address', HTTP_STATUS.NOT_FOUND);
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/forgot-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'StudySync Password Reset',
    text: `Reset your StudySync password using this token: ${resetToken}\nOr open: ${resetUrl}`,
  });

  return {
    resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
  };
};

exports.resetUserPassword = async (rawToken, newPassword) => {
  const hashed = hashToken(rawToken);
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired password reset token', HTTP_STATUS.BAD_REQUEST);
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return user;
};
