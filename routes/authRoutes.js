const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['donor', 'recipient', 'staff']).withMessage('Invalid role'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('address').notEmpty().withMessage('Address is required')
], authController.register);

router.post('/login', authController.login);
router.get('/profile', protect, authController.getProfile);
router.patch('/profile', protect, authController.updateProfile);

module.exports = router;