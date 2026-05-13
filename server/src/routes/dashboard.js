const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // 1. Monthly Summary (Income, Expense, Balance)
    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        date: { gte: startDate, lte: endDate },
      },
    });

    const income = currentMonthTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = currentMonthTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const accounts = await prisma.account.findMany({ where: { userId: req.userId } });
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // 2. Category Breakdown (Donut Chart)
    const expensesByCategory = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId: req.userId, type: 'EXPENSE', date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    });

    const categories = await prisma.category.findMany({
      where: {
        id: { in: expensesByCategory.map((e) => e.categoryId) },
      },
    });

    const categoryBreakdown = expensesByCategory.map((expenseGrp) => {
      const category = categories.find((c) => c.id === expenseGrp.categoryId);
      return {
        nameEn: category?.nameEn || 'Unknown',
        nameAr: category?.nameAr || 'غير معروف',
        amount: expenseGrp._sum.amount || 0,
        color: category?.color || '#ccc',
      };
    });

    // 3. 12-Month Trend (Bar Chart)
    const twelveMonthsAgo = new Date(year, month - 12, 1);
    const trendTransactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId,
        date: { gte: twelveMonthsAgo, lte: endDate },
      },
      select: { amount: true, type: true, date: true },
    });

    const trend = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(year, month - 12 + i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const label = `${y}-${m.toString().padStart(2, '0')}`;

      const monthTx = trendTransactions.filter(
        (t) => t.date.getMonth() + 1 === m && t.date.getFullYear() === y
      );

      return {
        month: label,
        income: monthTx.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0),
        expense: monthTx.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0),
      };
    });

    res.json({
      summary: { income, expense, balance: totalBalance },
      categoryBreakdown,
      trend,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
