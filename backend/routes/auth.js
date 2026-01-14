const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, updatePassword, deleteAccount  } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.put('/update-password', protect, updatePassword);
router.delete('/profile', protect, deleteAccount);

module.exports = router;