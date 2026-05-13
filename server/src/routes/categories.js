const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all categories (user's own + defaults)
router.get('/', auth, async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId: req.userId }, { isDefault: true }],
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Create category
router.post('/', auth, async (req, res) => {
  try {
    const { nameEn, nameAr, type, icon, color } = req.body;
    const category = await prisma.category.create({
      data: {
        userId: req.userId,
        nameEn,
        nameAr,
        type,
        icon: icon || '📂',
        color: color || '#6366f1',
      },
    });
    res.status(201).json({ category });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update category
router.put('/:id', auth, async (req, res) => {
  try {
    const { nameEn, nameAr, type, icon, color } = req.body;
    const category = await prisma.category.updateMany({
      where: { id: req.params.id, userId: req.userId },
      data: { nameEn, nameAr, type, icon, color },
    });

    if (category.count === 0) {
      return res.status(404).json({ error: { message: 'Category not found' } });
    }

    const updated = await prisma.category.findUnique({ where: { id: req.params.id } });
    res.json({ category: updated });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Delete category
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await prisma.category.deleteMany({
      where: { id: req.params.id, userId: req.userId, isDefault: false },
    });

    if (category.count === 0) {
      return res.status(404).json({ error: { message: 'Category not found or is a default category' } });
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
