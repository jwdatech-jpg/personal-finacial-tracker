require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('../server/src/routes/auth');
const accountRoutes = require('../server/src/routes/accounts');
const categoryRoutes = require('../server/src/routes/categories');
const transactionRoutes = require('../server/src/routes/transactions');
const budgetRoutes = require('../server/src/routes/budgets');
const goalRoutes = require('../server/src/routes/goals');
const dashboardRoutes = require('../server/src/routes/dashboard');
const userRoutes = require('../server/src/routes/users');

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    'http://localhost:5173',
    'http://localhost:5174'
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Personal Financial Tracker API', version: '1.0.0' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

module.exports = app;
