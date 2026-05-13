# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-14

### Added
- Initial release of Personal Financial Tracker
- User authentication with JWT and bcrypt
- Multi-account management (Cash, Bank, Credit Card, Savings)
- Transaction tracking with categories and notes
- Monthly budget management with visual alerts
- Savings goals with progress tracking
- Dashboard with interactive charts
  - Monthly summary
  - Category breakdown (donut chart)
  - 12-month trend (bar chart)
- Bilingual support (English & Arabic)
- RTL layout support
- Responsive design for all devices
- Database migrations with Prisma
- RESTful API with Express.js
- Password hashing with bcryptjs
- File upload support with Multer

### Features
- Transaction filtering by type, account, and category
- Recurring transaction support
- Budget alerts at 80% and 100% usage
- Custom account names and colors
- User profile management
- Logout functionality

---

## [Unreleased]

### Planned Features
- Real-time updates with WebSocket
- Mobile app (React Native)
- Advanced reporting and analytics
- Export to CSV/PDF
- Account reconciliation
- Investment tracking
- Bill reminders
- Email notifications
- Dark mode
- Two-factor authentication
- API rate limiting
- Audit logs

---

## Guidelines for Contributors

When adding changes, update this file with:

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

Example:

```markdown
## [0.1.0] - 2026-05-20

### Added
- New search feature in transactions
- Category sorting options

### Fixed
- Budget calculation error for credit cards

### Security
- Updated dependencies to patch vulnerability
```

---

**Current Version**: 1.0.0 (Public Release)
