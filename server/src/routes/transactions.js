const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  }
});

const router = express.Router();

// Get all transactions (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const { type, accountId, categoryId, startDate, endDate, page = 1, limit = 20 } = req.query;

    const where = { userId: req.userId };
    if (type) where.type = type;
    if (accountId) where.accountId = accountId;
    if (categoryId) where.categoryId = categoryId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          account: { select: { id: true, name: true, type: true, color: true } },
          category: { select: { id: true, nameEn: true, nameAr: true, icon: true, color: true, type: true } },
        },
        orderBy: { date: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Create transaction
router.post('/', auth, upload.single('attachment'), async (req, res) => {
  try {
    const { accountId, categoryId, type, amount, note, date, isRecurring, recurringInterval } = req.body;
    const attachment = req.file ? `/uploads/${req.file.filename}` : null;

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.userId,
        accountId,
        categoryId,
        type,
        amount: parseFloat(amount),
        note,
        date: date ? new Date(date) : new Date(),
        isRecurring: isRecurring === 'true' || isRecurring === true,
        recurringInterval,
        attachment,
      },
      include: {
        account: { select: { id: true, name: true, type: true, color: true } },
        category: { select: { id: true, nameEn: true, nameAr: true, icon: true, color: true, type: true } },
      },
    });

    // Update account balance
    const balanceChange = type === 'INCOME' ? parseFloat(amount) : -parseFloat(amount);
    await prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: balanceChange } },
    });

    res.status(201).json({ transaction });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const existing = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!existing) {
      return res.status(404).json({ error: { message: 'Transaction not found' } });
    }

    const { accountId, categoryId, type, amount, note, date, isRecurring, recurringInterval } = req.body;

    // Reverse old balance change
    const oldBalanceChange = existing.type === 'INCOME' ? -existing.amount : existing.amount;
    await prisma.account.update({
      where: { id: existing.accountId },
      data: { balance: { increment: oldBalanceChange } },
    });

    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: {
        accountId,
        categoryId,
        type,
        amount: parseFloat(amount),
        note,
        date: date ? new Date(date) : undefined,
        isRecurring,
        recurringInterval,
      },
      include: {
        account: { select: { id: true, name: true, type: true, color: true } },
        category: { select: { id: true, nameEn: true, nameAr: true, icon: true, color: true, type: true } },
      },
    });

    // Apply new balance change
    const newBalanceChange = type === 'INCOME' ? parseFloat(amount) : -parseFloat(amount);
    await prisma.account.update({
      where: { id: accountId || existing.accountId },
      data: { balance: { increment: newBalanceChange } },
    });

    res.json({ transaction });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: { message: 'Transaction not found' } });
    }

    // Reverse balance change
    const balanceChange = transaction.type === 'INCOME' ? -transaction.amount : transaction.amount;
    await prisma.account.update({
      where: { id: transaction.accountId },
      data: { balance: { increment: balanceChange } },
    });

    await prisma.transaction.delete({ where: { id: req.params.id } });

    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;
