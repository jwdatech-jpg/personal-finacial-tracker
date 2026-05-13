const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: { message: errors.array()[0].msg } });
      }

      const { name, email, password, language, currency } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: { message: 'Email already registered' } });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, language: language || 'en', currency: currency || 'EGP' },
      });

      // Copy default categories for new user
      const defaultCats = await prisma.category.findMany({ where: { isDefault: true } });
      for (const cat of defaultCats) {
        await prisma.category.create({
          data: {
            userId: user.id,
            nameEn: cat.nameEn,
            nameAr: cat.nameAr,
            type: cat.type,
            icon: cat.icon,
            color: cat.color,
          },
        });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      });

      res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, language: user.language, currency: user.currency },
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: { message: 'Server error' } });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: { message: errors.array()[0].msg } });
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: { message: 'Invalid credentials' } });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: { message: 'Invalid credentials' } });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      });

      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, language: user.language, currency: user.currency },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: { message: 'Server error' } });
    }
  }
);

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, language: true, currency: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
