const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all goals
router.get('/', auth, async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    const goalsWithProgress = goals.map((goal) => ({
      ...goal,
      progress: goal.targetAmount > 0
        ? Math.round((goal.currentAmount / goal.targetAmount) * 100 * 100) / 100
        : 0,
    }));

    res.json({ goals: goalsWithProgress });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Create goal
router.post('/', auth, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline, icon, color } = req.body;
    const goal = await prisma.goal.create({
      data: {
        userId: req.userId,
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount || 0),
        deadline: deadline ? new Date(deadline) : null,
        icon: icon || '🎯',
        color: color || '#10b981',
      },
    });

    res.status(201).json({
      goal: {
        ...goal,
        progress: goal.targetAmount > 0
          ? Math.round((goal.currentAmount / goal.targetAmount) * 100 * 100) / 100
          : 0,
      },
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update goal
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, targetAmount, currentAmount, deadline, icon, color } = req.body;
    const result = await prisma.goal.updateMany({
      where: { id: req.params.id, userId: req.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(targetAmount !== undefined && { targetAmount: parseFloat(targetAmount) }),
        ...(currentAmount !== undefined && { currentAmount: parseFloat(currentAmount) }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: { message: 'Goal not found' } });
    }

    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });
    res.json({
      goal: {
        ...goal,
        progress: goal.targetAmount > 0
          ? Math.round((goal.currentAmount / goal.targetAmount) * 100 * 100) / 100
          : 0,
      },
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Delete goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await prisma.goal.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: { message: 'Goal not found' } });
    }

    res.json({ message: 'Goal deleted' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
