# Frontend Version Control Guidelines

## 🏷️ Tagging Strategy

### Semantic Versioning (SemVer)
- **MAJOR** (X.0.0): Breaking changes to user interface or API contracts
- **MINOR** (0.X.0): New features, UI improvements
- **PATCH** (0.0.X): Bug fixes, minor improvements

### Tag Format
```
v[MAJOR].[MINOR].[PATCH]
```

Examples:
- `v1.0.0` - Initial stable release
- `v1.1.0` - New UI features
- `v1.1.1` - Bug fixes

## 📝 Commit Message Format

### Structure
```
<type>(<scope>): <description>

<body>

<footer>
```

### Types
- `feat`: New feature or UI component
- `fix`: Bug fix
- `style`: UI/UX improvements
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `docs`: Documentation changes
- `chore`: Build process, dependencies

### Scopes (Frontend Areas)
- `auth`: Authentication and authorization
- `dashboard`: Dashboard components
- `tasks`: Task management features
- `profile`: User profile management
- `payments`: Payment interfaces
- `ui`: General UI components
- `api`: API service layer
- `store`: Redux store and state management

### Examples
```bash
feat(tasks): add task creation form
fix(auth): resolve login redirect issue
style(dashboard): improve responsive layout
refactor(api): optimize service calls
perf(ui): lazy load dashboard components
```

## 🚀 Release Process

### 1. Feature Development
```bash
git checkout -b feature/task-creation
# Develop feature
git commit -m "feat(tasks): implement task creation form"
git push origin feature/task-creation
# Create PR and merge to main
```

### 2. Bug Fixes
```bash
git checkout -b fix/login-redirect
# Fix bug
git commit -m "fix(auth): resolve login redirect loop"
git push origin fix/login-redirect
# Create PR and merge to main
```

### 3. Release Preparation
```bash
git checkout main
git pull origin main
# Update version in package.json
npm version patch  # or minor/major
git commit -m "chore: bump version to v1.2.0"
git tag -a v1.2.0 -m "Release v1.2.0: New task management features"
git push origin main --tags
```

## 🔄 Branch Strategy

### Main Branches
- `main`: Production-ready code
- `develop`: Integration branch for features

### Supporting Branches
- `feature/*`: New features or components
- `fix/*`: Bug fixes
- `style/*`: UI/UX improvements
- `hotfix/*`: Critical production fixes

## 📋 Pre-commit Checklist

- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] ESLint checks pass
- [ ] Code formatted with Prettier
- [ ] Components properly typed
- [ ] No console.log statements (except for debugging)
- [ ] Responsive design tested
- [ ] Accessibility checked

## 🏗️ Build and Deploy

### Local Development
```bash
npm install           # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run type-check   # TypeScript validation
```

### Production Build
```bash
git checkout v1.2.0  # Checkout specific version
npm ci               # Clean install
npm run build        # Production build
npm run preview      # Test build locally
```

## 📊 Version Tracking

### Package.json Version
```json
{
  "name": "mshando-v2-frontend",
  "version": "1.1.0",
  "dependencies": { ... }
}
```

### Check Current Version
```bash
git describe --tags --abbrev=0  # Latest tag
npm version                     # Package version
git log --oneline -10          # Recent commits
```

### View Changes Between Versions
```bash
git log v1.0.0..v1.1.0 --oneline
git diff v1.0.0..v1.1.0 src/
```

## 🧪 Testing Strategy

### Unit Tests
```bash
npm run test          # Run unit tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### E2E Tests
```bash
npm run test:e2e      # End-to-end tests
```

### Manual Testing Checklist
- [ ] Authentication flow (login/register/logout)
- [ ] Dashboard loading and data display
- [ ] Task creation and management
- [ ] Profile management
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Browser compatibility
- [ ] Performance metrics

## 🔧 Development Workflow

### Starting Work
```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature
```

### Daily Development
```bash
git add .
git commit -m "feat(scope): work in progress"
git push origin feature/new-feature
```

### Finishing Feature
```bash
npm run build        # Ensure it builds
npm run lint         # Check code quality
npm run test         # Run tests
git add .
git commit -m "feat(scope): complete feature implementation"
git push origin feature/new-feature
# Create Pull Request
```

## 📱 Mobile-First Considerations

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Testing Requirements
- [ ] Mobile Safari
- [ ] Chrome Mobile
- [ ] Firefox Mobile
- [ ] Touch interactions
- [ ] Performance on slower devices

## 🎨 UI/UX Version Control

### Component Documentation
- Document new components in Storybook
- Include usage examples
- Add accessibility notes
- Specify responsive behavior

### Design System Updates
- Update design tokens
- Document color/typography changes
- Version design system components
- Maintain backwards compatibility
