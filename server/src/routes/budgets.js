const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// Get budgets for a given month/year
router.get('/', auth, async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const budgets = await prisma.budget.findMany({
      where: { userId: req.userId, month, year },
      include: {
        category: { select: { id: true, nameEn: true, nameAr: true, icon: true, color: true, type: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate spent amounts for each budget
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          where: {
            userId: req.userId,
            categoryId: budget.categoryId,
            type: 'EXPENSE',
            date: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
        });

        const spentAmount = spent._sum.amount || 0;
        const percentage = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;

        return {
          ...budget,
          spent: spentAmount,
          percentage: Math.round(percentage * 100) / 100,
          status: percentage >= 100 ? 'exceeded' : percentage >= 80 ? 'warning' : 'ok',
        };
      })
    );

    res.json({ budgets: budgetsWithSpent });
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Create or update budget
router.post('/', auth, async (req, res) => {
  try {
    const { categoryId, amount, month, year } = req.body;

    const budget = await prisma.budget.upsert({
      where: {
        userId_categoryId_month_year: {
          userId: req.userId,
          categoryId,
          month: parseInt(month),
          year: parseInt(year),
        },
      },
      update: { amount: parseFloat(amount) },
      create: {
        userId: req.userId,
        categoryId,
        amount: parseFloat(amount),
        month: parseInt(month),
        year: parseInt(year),
      },
      include: {
        category: { select: { id: true, nameEn: true, nameAr: true, icon: true, color: true, type: true } },
      },
    });

    res.status(201).json({ budget });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await prisma.budget.deleteMany({
      where: { id: req.params.id, userId: req.userId },
    });

    if (budget.count === 0) {
      return res.status(404).json({ error: { message: 'Budget not found' } });
    }

    res.json({ message: 'Budget deleted' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
