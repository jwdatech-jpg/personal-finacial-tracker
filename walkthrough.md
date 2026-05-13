# Personal Financial Tracker - Walkthrough

This application is a full-stack personal finance management tool with bilingual support (Arabic & English), RTL layout, and advanced tracking features.

## Project Structure
- `/server`: Node.js + Express + Prisma (Backend)
- `/client`: React + Vite + Tailwind CSS (Frontend)

## Prerequisites
- Node.js installed
- PostgreSQL database running (or update `.env` in `/server` with your connection string)

## Getting Started

### 1. Setup the Backend
Open a terminal in the `/server` directory:
```bash
# Install dependencies
npm install

# Run Prisma migrations to create the database schema
npx prisma migrate dev --name init

# Seed the database with default categories and a demo user
npm run prisma:seed
```

### 2. Run the Backend
```bash
npm run dev
```
The API will be available at `http://localhost:5000`.

### 3. Setup the Frontend
Open another terminal in the `/client` directory:
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be available at `http://localhost:5173`.

## Features Walkthrough

### Bilingual Support & RTL
- Toggle language from the globe icon in the navbar.
- The layout automatically switches to RTL (Right-to-Left) when Arabic is selected.
- Fonts change to **Cairo** for Arabic and **Inter** for English for a premium feel.

### Dashboard
- **Monthly Summary**: View your total balance, monthly income, and expenses.
- **Visual Analytics**: Interactive donut charts for category breakdown and bar charts for 12-month trends.

### Transactions
- View all transactions with category icons and color-coded amounts.
- Filter by type (Income/Expense), Account, or Category.

### Budgets
- Set monthly limits per category.
- Progress bars show usage with alerts at 80% (warning) and 100% (exceeded).

### Savings Goals
- Track progress towards specific financial targets.
- Visual progress bars and target deadlines.

## Demo Credentials
- **Email**: `demo@tracker.com`
- **Password**: `demo1234`
