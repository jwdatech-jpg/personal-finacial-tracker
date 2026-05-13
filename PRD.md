> You are a senior full-stack developer. Help me build a **Personal Financial Tracker** web application from scratch with the following specifications:
>
> **Core Features:**
> - User authentication (register, login, logout, password reset) using JWT and bcrypt
> - Multiple account/wallet types: Cash, Bank, Credit Card, Savings
> - Income & expense transaction tracking with categories, notes, and recurring transactions
> - Monthly budget management per category with alerts at 80% and 100% usage
> - Savings goals with progress tracking
> - Dashboard with charts: monthly summary, category breakdown (donut chart), 12-month trend (bar chart)
>
> **Bilingual Support (Arabic &English ):**
> - Full RTL layout when Arabic is selected using CSS logical properties
> - Arabic font: Cairo (Google Fonts)
> - Number and date formatting using `Intl.NumberFormat` and `Intl.DateTimeFormat` with locale `ar-SA`
> - Language toggle in navbar, preference saved to database
> - All category names stored with both `name_en` and `name_ar` fields
>
> **Tech Stack:**
> - Frontend: React 18 + Vite + Tailwind CSS (with RTL support) + react-i18next + Recharts
> - Backend: Node.js + Express + Prisma ORM
> - Database: PostgreSQL
> - Auth: JWT + bcrypt
>
> **Start by:**
> 1. Generating the full project folder structure
> 2. Setting up the PostgreSQL schema with Prisma (all models: User, Account, Category, Transaction, Budget, Goal)
> 3. Building the Express API with all routes
> 4. Building the React frontend with bilingual support from the start
