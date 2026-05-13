# Contributing to Personal Financial Tracker

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🎯 Code of Conduct

Please be respectful and constructive in all interactions. We're building this together!

## 🚀 Getting Started

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/yourusername/personal-financial-tracker.git
   cd personal-financial-tracker
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/personal-financial-tracker.git
   ```

### Setup Development Environment

Follow the [Quick Start](README.md#-quick-start) guide in README.md

## 📝 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/your-bug-fix
```

Branch naming convention:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

### 2. Make Changes

- Write clean, readable code
- Follow project code style
- Add comments for complex logic
- Ensure changes work locally

### 3. Test Your Changes

```bash
# Frontend
cd client
npm run lint

# Backend
cd server
npm run lint
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting changes
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template:
   - **Title**: Clear, descriptive title
   - **Description**: What does this PR do?
   - **Related Issues**: Links to issues (fixes #123)
   - **Testing**: How did you test this?
   - **Screenshots**: If UI changes (optional)

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Fork and branch from `main`
- [ ] Tests pass locally
- [ ] Code follows project style
- [ ] No unrelated changes
- [ ] Updated documentation if needed
- [ ] Added entry to CHANGELOG (if major)

### PR Title Examples

- `feat: add recurring transaction support`
- `fix: resolve RTL layout issue in Arabic`
- `docs: update deployment guide`

### Review Process

1. Code review by maintainers
2. Address any comments/suggestions
3. Approved and merged

## 🎨 Code Style

### Frontend (React/JavaScript)

```javascript
// Use functional components
const MyComponent = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

- Use PascalCase for components
- Use camelCase for variables/functions
- Use Tailwind CSS for styling
- Use meaningful names

### Backend (Node.js/Express)

```javascript
// Clean route handlers
router.get('/accounts', authenticateUser, async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.user.id }
    });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

- Use async/await
- Proper error handling
- Consistent indentation (2 spaces)
- Clear variable names

## 🌐 Bilingual Development

When adding new features:

1. **Add translations** in `client/src/i18n/config.js`
2. **Use i18n hook** in components:
   ```javascript
   const { t } = useTranslation();
   return <h1>{t('key.name')}</h1>;
   ```
3. **Add Arabic field names** in database models if needed

## 🐛 Reporting Issues

### Bug Report Template

```markdown
**Describe the Bug**
Clear description of the issue

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox
- Version: 1.0.0
```

### Feature Request Template

```markdown
**Description**
What would you like to add?

**Motivation**
Why is this useful?

**Implementation**
How should this work?

**Example**
Code example or mockup
```

## 📚 Documentation

Update documentation for:
- New features
- API changes
- Configuration options
- Breaking changes

## 🔍 Testing

### Frontend Testing

```bash
cd client
npm run lint
# Manual testing of component interactions
```

### Backend Testing

```bash
cd server
npm run lint
# Manual testing with Postman/Insomnia
```

## 📦 Commit and Push

Keep commits atomic and focused:

```bash
# Good - specific changes
git commit -m "fix: resolve pagination bug in transactions list"

# Bad - too vague
git commit -m "fixed stuff"
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma ORM](https://www.prisma.io/docs)
- [i18next Documentation](https://www.i18next.com)

## ✅ Checklist Before Submitting PR

- [ ] Code works locally
- [ ] No console errors or warnings
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Follows code style
- [ ] Commit messages are clear
- [ ] PR description is complete

## 🎉 Thank You!

Your contributions help make this project better for everyone. We appreciate your time and effort!

---

**Questions?** Open a discussion or issue on GitHub!
