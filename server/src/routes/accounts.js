const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all accounts
router.get('/', auth, async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.userId },
      include: { transactions: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Create account
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, balance, currency, color } = req.body;
    const account = await prisma.account.create({
      data: {
        userId: req.userId,
        name,
        type,
        balance: balance || 0,
        currency: currency || 'EGP',
        color: color || '#6366f1',
      },
    });
    res.status(201).json({ account });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update account
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, balance, currency, color } = req.body;
    const account = await prisma.account.updateMany({
      where: { id: req.params.id, userId: req.userId },
      data: { name, type, balance, currency, color },
    });

    if (account.count === 0) {
      return res.status(404).json({ error: { message: 'Account not found' } });
    }

    const updated = await prisma.account.findUnique({ where: { id: req.params.id } });
    res.json({ account: updated });
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Delete account
router.delete('/:id', auth, async (req, res) => {
  try {
    const account = await prisma.account.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    });

    if (account.count === 0) {
      return res.status(404).json({ error: { message: 'Account not found' } });
    }

    res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
