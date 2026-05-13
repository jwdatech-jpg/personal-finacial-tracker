const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const defaultCategories = [
  // Income categories
  { nameEn: 'Salary', nameAr: 'الراتب', type: 'INCOME', icon: 'Coins', color: '#10b981' },
  { nameEn: 'Business', nameAr: 'عمل خاص', type: 'INCOME', icon: 'Briefcase', color: '#6366f1' },
  { nameEn: 'Other Income', nameAr: 'دخل آخر', type: 'INCOME', icon: 'Download', color: '#8b5cf6' },

  // Expense categories
  { nameEn: 'Food', nameAr: 'طعام', type: 'EXPENSE', icon: 'Utensils', color: '#ef4444' },
  { nameEn: 'Housing', nameAr: 'سكن', type: 'EXPENSE', icon: 'Home', color: '#a855f7' },
  { nameEn: 'Transport', nameAr: 'مواصلات', type: 'EXPENSE', icon: 'Car', color: '#f97316' },
  { nameEn: 'Bills', nameAr: 'فواتير', type: 'EXPENSE', icon: 'FileText', color: '#6366f1' },
  { nameEn: 'Pocket Money', nameAr: 'مصروف جيب', type: 'EXPENSE', icon: 'Wallet', color: '#ec4899' },
  { nameEn: 'Other Expense', nameAr: 'مصروف آخر', type: 'EXPENSE', icon: 'Upload', color: '#64748b' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing categories
  await prisma.category.deleteMany({});
  console.log('🗑️ Existing categories cleared');

  // Create default categories (no userId = system defaults)
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { id: `default-${cat.nameEn.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `default-${cat.nameEn.toLowerCase().replace(/\s+/g, '-')}`,
        ...cat,
        isDefault: true,
      },
    });
  }

  console.log('✅ Default categories seeded');

  // Create a demo user
  const hashedPassword = await bcrypt.hash('demo1234', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@tracker.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@tracker.com',
      password: hashedPassword,
      language: 'en',
    },
  });

  // Create demo accounts
  const accounts = await Promise.all([
    prisma.account.upsert({
      where: { id: 'demo-cash' },
      update: {},
      create: { id: 'demo-cash', userId: user.id, name: 'Cash', type: 'CASH', balance: 1500, currency: 'EGP', color: '#10b981' },
    }),
    prisma.account.upsert({
      where: { id: 'demo-bank' },
      update: {},
      create: { id: 'demo-bank', userId: user.id, name: 'Main Bank', type: 'BANK', balance: 25000, currency: 'EGP', color: '#3b82f6' },
    }),
    prisma.account.upsert({
      where: { id: 'demo-credit' },
      update: {},
      create: { id: 'demo-credit', userId: user.id, name: 'Credit Card', type: 'CREDIT_CARD', balance: -3200, currency: 'EGP', color: '#ef4444' },
    }),
    prisma.account.upsert({
      where: { id: 'demo-savings' },
      update: {},
      create: { id: 'demo-savings', userId: user.id, name: 'Savings', type: 'SAVINGS', balance: 50000, currency: 'EGP', color: '#f59e0b' },
    }),
  ]);

  console.log('✅ Demo user and accounts seeded');
  console.log(`   Email: demo@tracker.com`);
  console.log(`   Password: demo1234`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
