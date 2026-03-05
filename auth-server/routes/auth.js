const express = require('express');
const router = express.Router();

// Import controllers and middleware
const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

const {
  validateRegister,
  validateLogin,
  validatePasswordReset,
  validateNewPassword,
  handleValidationErrors
} = require('../utils/validation');

const { authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegister, handleValidationErrors, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, handleValidationErrors, login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', authenticate, getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Forgot password
 * @access  Public
 */
router.post('/forgot-password', validatePasswordReset, handleValidationErrors, forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password/:token', validateNewPassword, handleValidationErrors, resetPassword);

module.exports = router;
