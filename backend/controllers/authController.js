const User = require('../models/User');
const authService = require('../services/authService');
const { HTTP_STATUS } = require('../constants');
const { seedFullStudyDataForUser } = require('../utils/seedStudyData');

const sendTokenResponse = async (user, statusCode, res) => {
  const { token, refreshToken } = await authService.issueTokens(user);
  const cookieDays = Number(process.env.COOKIE_EXPIRE) || 30;

  const cookieOptions = {
    expires: new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .cookie('refreshToken', refreshToken, { ...cookieOptions, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
    .json({
      success: true,
      token,
      refreshToken,
      data: user.toJSON(),
    });
};

exports.register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    await sendTokenResponse(user, HTTP_STATUS.CREATED, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);
    await sendTokenResponse(user, HTTP_STATUS.OK, res);
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const incoming = req.cookies?.refreshToken || req.body?.refreshToken;
    const { token, user } = await authService.refreshAccessToken(incoming);
    res.status(HTTP_STATUS.OK).json({ success: true, token, data: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (req.user?.id) {
      await authService.clearRefreshToken(req.user.id);
    }
    res.cookie('token', 'none', { expires: new Date(Date.now() + 5000), httpOnly: true });
    res.cookie('refreshToken', 'none', { expires: new Date(Date.now() + 5000), httpOnly: true });
    res.status(HTTP_STATUS.OK).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateUserProfile(req.user.id, req.body);
    res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await authService.updateUserPassword(req.user.id, currentPassword, newPassword);
    await sendTokenResponse(user, HTTP_STATUS.OK, res);
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const info = await authService.createPasswordReset(req.body.email);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password reset instructions generated',
      ...info,
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const user = await authService.resetUserPassword(req.params.resettoken, req.body.password);
    await sendTokenResponse(user, HTTP_STATUS.OK, res);
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.status(HTTP_STATUS.OK).json({ success: true, results: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

exports.seedSampleData = async (req, res, next) => {
  try {
    const counts = await seedFullStudyDataForUser(req.user.id, { overwrite: true });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Full B.Tech study database successfully populated in MongoDB',
      data: counts,
    });
  } catch (err) {
    next(err);
  }
};
