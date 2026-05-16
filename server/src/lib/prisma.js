const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: ['error', 'warn'],
});

// Test connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma connected to database');
  })
  .catch((err) => {
    console.error('❌ Prisma connection failed:', err.message);
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set');
    }
  });

module.exports = prisma;
