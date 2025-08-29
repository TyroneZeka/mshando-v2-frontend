# Frontend Git Workflow Guide

## Overview

This document outlines the Git workflow and version control practices for the Mshando frontend project. We follow GitFlow with conventional commits and automated quality checks specifically tailored for React/TypeScript development.

## Branch Strategy

### Main Branches

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features

### Supporting Branches

- **`feature/*`** - New features and components
- **`hotfix/*`** - Production bug fixes
- **`release/*`** - Release preparation

## Frontend-Specific Workflow

### 1. Component Development

```bash
# Create feature branch for new component
git checkout develop
git pull origin develop
git checkout -b feature/user-profile-component

# Work on component
# ... create component files ...
git add .
git commit -m "feat(ui): add user profile component skeleton"

# Add styling
# ... add CSS/TailwindCSS ...
git commit -m "style(ui): add responsive styling for user profile"

# Add functionality
# ... implement component logic ...
git commit -m "feat(ui): implement profile data display and editing"

# Add tests
# ... write component tests ...
git commit -m "test(ui): add user profile component tests"

# Push and create PR
git push origin feature/user-profile-component
```

### 2. State Management Changes

```bash
# Redux/state changes
git checkout -b feature/user-state-management

git commit -m "feat(state): add user profile slice"
git commit -m "feat(state): implement profile update actions"
git commit -m "fix(state): resolve async thunk error handling"
```

### 3. API Integration

```bash
# API service changes
git checkout -b feature/profile-api-integration

git commit -m "feat(api): add user profile endpoints"
git commit -m "fix(api): handle authentication errors"
git commit -m "refactor(api): extract common error handling"
```

## Conventional Commits for Frontend

### Component-Related

```bash
feat(ui): add new dashboard component
fix(ui): resolve responsive layout issue
style(ui): update button component styling
refactor(ui): extract reusable form components
```

### State Management

```bash
feat(state): implement user authentication flow
fix(state): resolve Redux action dispatch issue
refactor(state): normalize API response data
```

### API and Services

```bash
feat(api): integrate user registration endpoint
fix(api): handle network timeout scenarios
refactor(api): extract authentication utilities
```

### Configuration and Build

```bash
build(deps): update React to v18.3.0
chore(config): update Vite configuration
ci: add frontend deployment workflow
```

## Git Hooks for Frontend

### Pre-commit Hook Features

- ✅ **TypeScript/React file detection**
- ✅ **Configuration file validation**
- ✅ **Console.log warnings** (helps catch debug code)
- ✅ **TODO/FIXME notifications**
- ✅ **File count reporting**

### Commit Message Validation

- ✅ **Conventional commit format enforcement**
- ✅ **Frontend-specific examples**
- ✅ **Scope validation** (ui, state, api, etc.)

## Quality Checks

### Before Committing

1. **TypeScript Compilation**: `npm run type-check`
2. **Linting**: `npm run lint`
3. **Component Testing**: `npm run test`
4. **Build Check**: `npm run build`

### CI/CD Pipeline

Our automated pipeline runs:

1. **Test Job**:
   - ESLint checks
   - TypeScript compilation
   - Unit tests
   - Coverage reports

2. **Build Job**:
   - Production build
   - Build artifact storage

3. **Security Scan**:
   - npm audit
   - Trivy vulnerability scanner

4. **Performance**:
   - Lighthouse CI
   - Performance metrics

5. **E2E Tests**:
   - Playwright end-to-end tests
   - User flow validation

## Development Workflow

### Daily Development

```bash
# Start development
git checkout develop
git pull origin develop
git checkout -b feature/my-feature

# Make changes and test locally
npm run dev
npm run lint
npm run type-check

# Commit frequently with clear messages
git add .
git commit -m "feat(ui): add login form component"

# Keep up to date
git fetch origin
git rebase origin/develop

# Push when ready
git push origin feature/my-feature
```

### Code Review Process

1. **Create Pull Request**
   - Target: `develop` branch
   - Include component screenshots if UI changes
   - Add description of functionality

2. **Review Checklist**
   - [ ] Components follow design system
   - [ ] TypeScript types are properly defined
   - [ ] State management is efficient
   - [ ] No console.log statements
   - [ ] Responsive design works
   - [ ] Accessibility considered

3. **Merge Requirements**
   - ✅ All CI checks pass
   - ✅ TypeScript compilation successful
   - ✅ ESLint passes with no errors
   - ✅ Build completes successfully
   - ✅ At least one approval

## Frontend-Specific Best Practices

### Component Development

1. **Atomic Commits**: One component feature per commit
2. **Clear Naming**: Use descriptive component and file names
3. **Type Safety**: Always define proper TypeScript interfaces
4. **State Management**: Keep state updates logical and traceable

### File Organization

```
src/
├── components/     # Reusable UI components
├── pages/         # Route-level components
├── hooks/         # Custom React hooks
├── services/      # API and external services
├── store/         # Redux store and slices
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── assets/        # Static assets
```

### Commit Patterns

```bash
# New component
feat(ui): add UserCard component

# Component enhancement
feat(ui): add edit mode to UserCard

# Styling changes
style(ui): improve UserCard responsive design

# Bug fixes
fix(ui): resolve UserCard loading state issue

# Refactoring
refactor(ui): extract common card layout
```

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Hook testing
- Utility function testing

### Integration Tests
- API service testing
- Redux store testing
- Component integration testing

### E2E Tests
- User flow testing
- Critical path validation
- Cross-browser testing

## Deployment

### Staging Deployment
- Triggered on `develop` branch push
- Deploys to staging environment
- Runs smoke tests

### Production Deployment
- Triggered on `main` branch push
- Requires all quality gates
- Includes performance validation

## Common Frontend Commands

```bash
# Development
npm run dev                # Start development server
npm run build              # Production build
npm run preview           # Preview production build

# Quality checks
npm run lint              # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript compilation check

# Testing
npm run test             # Run unit tests
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Run `npm run type-check` to see all issues
2. **Linting Errors**: Run `npm run lint:fix` to auto-fix
3. **Build Failures**: Check for missing dependencies or type errors
4. **Hook Failures**: Ensure hooks are executable: `chmod +x .githooks/*`

### Git Issues

```bash
# Reset local changes
git reset --hard HEAD

# Update branch with latest develop
git fetch origin
git rebase origin/develop

# View commit history
git log --oneline --graph --decorate
```

## Support and Resources

- **Documentation**: Check README.md and component docs
- **Issues**: Use GitHub issues for bug reports
- **Questions**: Team chat or GitHub discussions
- **Code Review**: Follow PR template and guidelines

Remember: Clean, consistent commits lead to better collaboration and easier debugging!
