# Personal Financial Tracker

A modern, full-stack personal finance management application with bilingual support (English & Arabic), RTL layout, and advanced tracking features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v18%2B-green)
![React](https://img.shields.io/badge/react-v19-blue)

## 🎯 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Multi-Account Management**: Support for Cash, Bank, Credit Card, and Savings accounts
- **Transaction Tracking**: Categorized income & expense tracking with notes and recurring transactions
- **Budget Management**: Set monthly budget limits per category with visual alerts at 80% and 100%
- **Savings Goals**: Create and track progress towards financial goals
- **Dashboard Analytics**: Interactive charts including:
  - Monthly summary with income/expense overview
  - Category breakdown (donut chart)
  - 12-month trend analysis (bar chart)
- **Bilingual Support**: Full English & Arabic interface with RTL layout
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🏗️ Project Structure

```
personal-financial-tracker/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth, Toast)
│   │   ├── i18n/          # i18n configuration
│   │   ├── lib/           # Utilities (axios setup)
│   │   └── utils/         # Helper functions
│   └── vite.config.js     # Vite configuration
├── server/                 # Express backend application
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Express middleware
│   │   └── lib/           # Utilities (Prisma client)
│   ├── prisma/            # Database schema and migrations
│   └── seed.js            # Database seeding
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **PostgreSQL** 12+ database
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/personal-financial-tracker.git
   cd personal-financial-tracker
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create .env file (see .env.example)
   cp .env.example .env
   # Edit .env with your PostgreSQL connection string
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # Seed database with demo data
   npm run prisma:seed
   
   # Start development server
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   
   # Create .env file (see .env.example)
   cp .env.example .env
   
   # Start development server
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 🔐 Demo Credentials

- **Email**: demo@tracker.com
- **Password**: demo1234

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling with RTL support
- **react-i18next** - Internationalization
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Zustand** - State management
- **react-hook-form** - Form management

### Backend
- **Node.js & Express** - Server framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

## 🌍 Bilingual Support

The application includes full bilingual support with:

- **English & Arabic** interface
- **RTL (Right-to-Left)** layout for Arabic
- **Custom fonts**: Cairo for Arabic, Inter for English
- **Number & Date formatting** using `Intl` API
- **Language toggle** in navbar (persistent to database)

### Switching Languages

Click the globe icon (🌐) in the top-right corner of the navbar to toggle between languages.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Accounts
- `GET /api/accounts` - Get user's accounts
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Transactions
- `GET /api/transactions` - Get user's transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get categories
- `POST /api/categories` - Create category

### Budgets
- `GET /api/budgets` - Get user's budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget

### Savings Goals
- `GET /api/goals` - Get user's goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/financial_tracker
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 📦 Build & Deploy

### Production Build

**Frontend:**
```bash
cd client
npm run build
# Output: dist/
```

**Backend:**
```bash
cd server
npm run start
```

### Deploy to Vercel

1. **Frontend on Vercel**
   - Push code to GitHub
   - Connect repository to Vercel
   - Configure environment variables
   - Vercel automatically builds and deploys

2. **Backend Hosting Options**
   - Railway.app
   - Render
   - Heroku
   - DigitalOcean
   - AWS (EC2 or Elastic Beanstalk)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🧪 Testing

```bash
# Run linter (frontend)
cd client
npm run lint

# Run linter (backend)
cd server
npm run lint
```

## 📚 Documentation

- [PRD.md](PRD.md) - Product Requirements Document
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

## 🐛 Known Limitations

- File uploads require backend storage configuration (currently uses multer)
- Real-time updates require WebSocket implementation
- Mobile app version not available

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Created**: May 2026

## 📧 Support

For issues and questions, please use the [GitHub Issues](https://github.com/yourusername/personal-financial-tracker/issues) page.

---

**Made with ❤️ by Your Name**
