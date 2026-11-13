const express = require('express');
const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  getAllUsers,
  seedSampleData,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateRequest');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} = require('../validators/authValidator');
const { ROLES } = require('../constants');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.get('/logout', logout);
router.post('/logout', logout);
router.post('/forgotpassword', validate(forgotPasswordSchema), forgotPassword);
router.put('/resetpassword/:resettoken', validate(resetPasswordSchema), resetPassword);

router.get('/me', protect, getMe);
router.put('/me', protect, validate(updateProfileSchema), updateProfile);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.put('/updatepassword', protect, updatePassword);
router.post('/seed-sample-data', protect, seedSampleData);

// Admin-only RBAC endpoint
router.get('/users', protect, authorize(ROLES.ADMIN), getAllUsers);

module.exports = router;
