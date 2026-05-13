const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

router.put('/language', auth, async (req, res) => {
  try {
    const { language } = req.body;
    if (!['en', 'ar'].includes(language)) {
      return res.status(400).json({ error: { message: 'Invalid language' } });
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { language },
      select: { id: true, name: true, email: true, language: true },
    });

    res.json({ user });
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update profile details
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, currency } = req.body;
    
    // Check if email is taken by another user
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, id: { not: req.userId } }
      });
      if (existing) {
        return res.status(400).json({ error: { message: 'Email already in use' } });
      }
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, email, currency },
      select: { id: true, name: true, email: true, language: true, currency: true },
    });

    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Change password
const bcrypt = require('bcryptjs');
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: { message: 'Incorrect current password' } });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
