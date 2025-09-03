# Frontend Git Workflow Guide

## Overview

This document outlines the comprehensive Git workflow and version control practices for the Mshando frontend project. We follow GitFlow with conventional commits, semantic versioning, automated quality checks, and comprehensive release management specifically tailored for React/TypeScript development.

## Version Control Strategy

### Semantic Versioning
We follow [Semantic Versioning](https://semver.org/) (SemVer):
- **MAJOR.MINOR.PATCH** (e.g., 1.3.0)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Version Tracking Files
- **`VERSION`**: Simple plaintext version file (e.g., "1.3.0")
- **`package.json`**: NPM package version (must stay in sync)
- **`CHANGELOG.md`**: Detailed change documentation following [Keep a Changelog](https://keepachangelog.com/)

## Branch Strategy

### Main Branches

- **`main`** - Production-ready code, protected branch
- **`develop`** - Integration branch for features, default branch for PRs

### Supporting Branches

- **`feature/*`** - New features and components
- **`hotfix/*`** - Production bug fixes (from main)
- **`release/*`** - Release preparation (version bumps, changelog updates)

## Release Management Workflow

### 1. Feature Development (feature/*)

```bash
# Start feature development
git checkout develop
git pull origin develop
git checkout -b feature/user-profile-component

# Development cycle with conventional commits
git add .
git commit -m "feat(ui): add user profile component skeleton"
git commit -m "style(ui): add responsive styling for user profile"
git commit -m "feat(ui): implement profile data display and editing"
git commit -m "test(ui): add user profile component tests"

# Keep up to date with develop
git fetch origin
git rebase origin/develop

# Push and create PR to develop
git push origin feature/user-profile-component
```

### 2. Release Preparation (release/*)

```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/1.4.0

# Update version files
echo "1.4.0" > VERSION
npm version 1.4.0 --no-git-tag-version

# Update CHANGELOG.md
# Add new version entry with:
# - Date
# - Added features
# - Fixed issues  
# - Changed items
# - Security updates
# - Breaking changes (if any)

# Example CHANGELOG.md entry:
## [1.4.0] - 2025-09-03

### Added
- User profile management interface
- Real-time notifications system

### Fixed
- Task creation date validation
- Navigation menu responsive issues

### Changed
- Updated task status workflow
- Improved error handling

# Commit version updates
git add .
git commit -m "chore(release): bump version to 1.4.0"

# Create PR to main for release
git push origin release/1.4.0
```

### 3. Production Release (main)

```bash
# After release PR is approved and merged to main
git checkout main
git pull origin main

# Create annotated git tag
git tag -a v1.4.0 -m "Release v1.4.0

Features:
- User profile management interface
- Real-time notifications system

Bug Fixes:
- Task creation date validation
- Navigation menu responsive issues

Changes:
- Updated task status workflow
- Improved error handling

Migration Notes:
- No breaking changes
- Users should refresh browser for new features"

# Push tag
git push origin v1.4.0

# Merge back to develop
git checkout develop
git merge main
git push origin develop
```

### 4. Hotfix Process (hotfix/*)

```bash
# Create hotfix from main for urgent production fixes
git checkout main
git pull origin main
git checkout -b hotfix/critical-auth-fix

# Fix the issue
git add .
git commit -m "fix(auth): resolve critical authentication bypass"

# Update version (patch increment)
echo "1.4.1" > VERSION
npm version 1.4.1 --no-git-tag-version

# Update CHANGELOG.md
## [1.4.1] - 2025-09-03

### Fixed
- Critical authentication bypass vulnerability

# Commit version update
git add .
git commit -m "chore(hotfix): bump version to 1.4.1"

# Merge to main
git checkout main
git merge hotfix/critical-auth-fix

# Tag the hotfix
git tag -a v1.4.1 -m "Hotfix v1.4.1 - Critical authentication fix"
git push origin main v1.4.1

# Merge back to develop
git checkout develop
git merge main
git push origin develop

# Clean up hotfix branch
git branch -d hotfix/critical-auth-fix
```

## CHANGELOG.md Management

### Format and Structure
We follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

All notable changes to the Mshando Frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-09-03

### Added
- New feature descriptions
- API integrations
- UI components

### Fixed
- Bug fix descriptions
- Security patches
- Performance improvements

### Changed
- Modified functionality
- Updated dependencies
- Refactored code

### Deprecated
- Features planned for removal

### Removed
- Deleted features
- Cleaned up code

### Security
- Security-related changes
- Vulnerability fixes
```

### Change Categories

- **Added**: New features, components, APIs
- **Fixed**: Bug fixes, error handling, patches
- **Changed**: Modifications to existing functionality
- **Deprecated**: Features marked for future removal
- **Removed**: Deleted features or code
- **Security**: Security-related changes

### Entry Guidelines

1. **Be Specific**: Include component/feature names
2. **User-Focused**: Describe impact on users
3. **Include Context**: Mention related issues/PRs
4. **Group Related Changes**: Organize by feature area

Example entries:
```markdown
### Added
- **Customer Navigation**: Implemented DashboardLayout component for consistent navigation across user roles
- **Enhanced Task Creation**: Improved LocalDateTime format handling for task due dates

### Fixed
- **JSX Compilation**: Resolved critical JSX syntax errors in TaskerDashboard and MyTasksPage components
- **Task Creation**: Fixed date format conversion from "YYYY-MM-DD" to "YYYY-MM-DDTHH:mm:ss"
```

## VERSION File Management

### VERSION File Format
Simple plaintext file containing only the version number:
```
1.4.0
```

### Synchronization Requirements
1. **VERSION file**: Manual update during release
2. **package.json**: Update with `npm version` command
3. **Git tags**: Create after version file updates

### Version Update Process
```bash
# Update VERSION file
echo "1.4.0" > VERSION

# Update package.json (without creating git tag)
npm version 1.4.0 --no-git-tag-version

# Verify synchronization
cat VERSION
grep '"version"' package.json
```

## Frontend-Specific Workflow

### 1. Component Development

```bash
# Feature branch for new component
git checkout -b feature/user-profile-component

# Component development with atomic commits
git commit -m "feat(ui): add user profile component skeleton"
git commit -m "style(ui): add responsive styling for user profile"
git commit -m "feat(ui): implement profile data display and editing"
git commit -m "test(ui): add user profile component tests"
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

## Git Tag Management

### Tag Naming Convention
- Format: `v{MAJOR}.{MINOR}.{PATCH}`
- Examples: `v1.3.0`, `v1.4.1`, `v2.0.0`

### Tag Creation
```bash
# Create annotated tag with detailed message
git tag -a v1.4.0 -m "Release v1.4.0

Features:
- User profile management interface
- Real-time notifications system
- Enhanced task creation workflow

Bug Fixes:
- Task creation date validation
- Navigation menu responsive issues
- Authentication error handling

Changes:
- Updated task status workflow
- Improved error handling
- Enhanced TypeScript type safety

Migration Notes:
- No breaking changes
- Users should refresh browser for new features
- New environment variables may be required"

# Push tag to remote
git push origin v1.4.0

# List all tags
git tag -l

# View tag details
git show v1.4.0
```

### Tag Management Commands
```bash
# Delete local tag
git tag -d v1.4.0

# Delete remote tag
git push origin --delete v1.4.0

# Checkout specific version
git checkout v1.4.0

# Create branch from tag
git checkout -b hotfix/from-v1.4.0 v1.4.0
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

### Version Control and Documentation

```bash
chore(release): bump version to 1.4.0
docs: update CHANGELOG.md for v1.4.0
docs: add comprehensive release notes for v1.4.0
chore(version): sync package.json with VERSION file
```

## Complete Release Example

Here's a complete example of our v1.3.0 release process:

### 1. Development Phase
```bash
# Feature development on develop branch
git checkout develop
git pull origin develop

# Multiple feature commits
git commit -m "feat(ui): implement DashboardLayout component"
git commit -m "fix(ui): resolve JSX compilation errors in TaskerDashboard"
git commit -m "feat(ui): add customer navigation parity"
git commit -m "fix(task): resolve LocalDateTime format handling"
```

### 2. Release Preparation
```bash
# Create release branch
git checkout -b release/1.3.0

# Update version files
echo "1.3.0" > VERSION
npm version 1.3.0 --no-git-tag-version

# Update CHANGELOG.md with comprehensive entries
# See actual v1.3.0 changelog for format example

# Commit version updates
git add .
git commit -m "chore(release): bump version to 1.3.0"
```

### 3. Release Finalization
```bash
# Merge to main (via PR in real workflow)
git checkout main
git merge release/1.3.0

# Create annotated tag
git tag -a v1.3.0 -m "Release v1.3.0

Added:
- Customer Navigation: DashboardLayout component for consistent navigation
- Customer Dashboard: Navigation header matching tasker interface
- Enhanced Task Creation: Improved LocalDateTime format handling

Fixed:
- JSX Compilation: Resolved critical syntax errors
- Task Creation: Fixed date format conversion
- Frontend Build: Restored successful compilation

Changed:
- Task Status: Updated to use proper TaskStatus enum values
- Component Structure: Refactored for better maintainability

Security:
- Type Safety: Enhanced TypeScript type safety
- Component Validation: Improved prop validation"

# Push everything
git push origin main v1.3.0

# Merge back to develop
git checkout develop
git merge main
git push origin develop
```

This release process resulted in:
- ✅ Synchronized version across VERSION file (1.3.0) and package.json
- ✅ Comprehensive CHANGELOG.md following Keep a Changelog format
- ✅ Proper git tag (v1.3.0) with detailed release notes
- ✅ Clean commit history with conventional commit messages

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

## Repository Synchronization

### Frontend & Backend Coordination

Both repositories follow the same versioning strategy:

```bash
# Check version alignment
cd /path/to/frontend && cat VERSION
cd /path/to/backend && cat VERSION

# Both should show: 1.3.0

# Check tag alignment
cd /path/to/frontend && git tag -l | tail -5
cd /path/to/backend && git tag -l | tail -5

# Both should have: v1.3.0
```

### Cross-Repository Release Process

1. **Coordinate Changes**: Ensure frontend and backend changes are compatible
2. **Version Sync**: Both repositories get same version number
3. **Tag Sync**: Both repositories get same git tags
4. **Documentation Sync**: CHANGELOGs reference each other when needed

Example coordinated commit messages:
```bash
# Frontend
git commit -m "feat(ui): add task creation with new backend API"

# Backend  
git commit -m "feat(api): add task creation endpoint for frontend integration"
```

## Quality Checks

### Before Committing

1. **TypeScript Compilation**: `npm run type-check`
2. **Linting**: `npm run lint`
3. **Component Testing**: `npm run test`
4. **Build Check**: `npm run build`
5. **Version Sync Check**: Verify VERSION file matches package.json

### Release Checklist

Before creating a release:

- [ ] All tests pass (`npm run test`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] VERSION file updated
- [ ] package.json version updated (via `npm version`)
- [ ] CHANGELOG.md updated with all changes
- [ ] Release notes prepared
- [ ] All PRs merged to develop
- [ ] Develop branch merged to main
- [ ] Git tag created and pushed
- [ ] Backend repository synchronized (if applicable)

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

## Version Control Commands Reference

### Daily Development Commands

```bash
# Check current status
git status

# View version information
cat VERSION
npm version
git tag -l | tail -5

# Development workflow
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
# ... make changes ...
git add .
git commit -m "feat(ui): add new feature"
git push origin feature/my-feature

# Keep up to date
git fetch origin
git rebase origin/develop
```

### Release Commands

```bash
# Create release branch
git checkout develop
git pull origin develop
git checkout -b release/1.5.0

# Update versions
echo "1.5.0" > VERSION
npm version 1.5.0 --no-git-tag-version

# Update CHANGELOG.md
# ... edit CHANGELOG.md ...

# Commit and finalize
git add .
git commit -m "chore(release): bump version to 1.5.0"

# Merge to main (via PR)
git checkout main
git merge release/1.5.0

# Tag and push
git tag -a v1.5.0 -m "Release v1.5.0 - Feature summary"
git push origin main v1.5.0

# Merge back to develop
git checkout develop
git merge main
git push origin develop
```

### Hotfix Commands

```bash
# Emergency fix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Fix and version bump
# ... make fixes ...
echo "1.4.1" > VERSION
npm version 1.4.1 --no-git-tag-version

# Update CHANGELOG.md
git add .
git commit -m "fix(critical): resolve security vulnerability"
git commit -m "chore(hotfix): bump version to 1.4.1"

# Merge and tag
git checkout main
git merge hotfix/critical-fix
git tag -a v1.4.1 -m "Hotfix v1.4.1 - Critical security fix"
git push origin main v1.4.1

# Merge back to develop
git checkout develop
git merge main
git push origin develop
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

1. **Version Mismatch**: 
   ```bash
   # Check synchronization
   cat VERSION
   grep '"version"' package.json
   git tag -l | tail -1
   
   # Fix if needed
   echo "1.3.0" > VERSION
   npm version 1.3.0 --no-git-tag-version
   ```

2. **TypeScript Errors**: Run `npm run type-check` to see all issues
3. **Linting Errors**: Run `npm run lint:fix` to auto-fix
4. **Build Failures**: Check for missing dependencies or type errors
5. **Hook Failures**: Ensure hooks are executable: `chmod +x .githooks/*`

### Git Issues

```bash
# Reset local changes
git reset --hard HEAD

# Update branch with latest develop
git fetch origin
git rebase origin/develop

# View commit history
git log --oneline --graph --decorate

# Check version history
git log --oneline --grep="chore(release)"
git tag -l --sort=-version:refname | head -10
```

### CHANGELOG.md Issues

```bash
# Validate CHANGELOG format
# Check for:
# - Proper markdown formatting
# - [Version] - Date format
# - Consistent category ordering
# - Clear, user-focused descriptions

# Compare with Keep a Changelog standard
# https://keepachangelog.com/en/1.0.0/
```

### Version Control Best Practices Summary

1. **Always sync versions**: VERSION file, package.json, and git tags
2. **Follow conventional commits**: Use consistent commit message format
3. **Update CHANGELOG.md**: Document all user-facing changes
4. **Use annotated tags**: Include detailed release information
5. **Coordinate with backend**: Ensure version compatibility
6. **Test before release**: Run full test suite and build checks
7. **Document breaking changes**: Clearly mark any breaking changes
8. **Keep develop updated**: Always merge releases back to develop

## File Structure for Version Control

```
mshando-v2-frontend/
├── VERSION                    # Plain version file (1.3.0)
├── CHANGELOG.md              # Keep a Changelog format
├── package.json              # NPM version (must sync with VERSION)
├── GIT_WORKFLOW.md           # This workflow documentation
├── RELEASE_NOTES_v1.3.0.md   # Detailed release notes
├── .gitignore                # Git ignore patterns
└── src/                      # Application source code
```

Remember: Clean, consistent version control leads to better collaboration and easier debugging!

## Current Implementation Status

### What We Have Implemented (v1.3.0)

✅ **Complete Version Control System**:
- VERSION file tracking (1.3.0)
- package.json synchronization (1.3.0)
- Comprehensive CHANGELOG.md following Keep a Changelog format
- Semantic versioning with proper git tags (v1.3.0)
- Conventional commit messages throughout history

✅ **Repository Structure**:
- main branch (production-ready)
- develop branch (integration)
- Proper tag management (v1.1.0, v1.1.1, v1.2.0, v1.2.1, v1.3.0)
- Cross-repository synchronization with backend

✅ **Release Documentation**:
- Detailed CHANGELOG.md with categorized changes
- Comprehensive release notes (RELEASE_NOTES_v1.3.0.md)
- This updated Git workflow documentation
- Migration notes and breaking change documentation

✅ **Quality Assurance**:
- TypeScript compilation validation
- ESLint configuration and enforcement
- Build verification processes
- Conventional commit format validation

### Current Repository State

```bash
# Version synchronization
$ cat VERSION
1.3.0

$ grep '"version"' package.json
  "version": "1.3.0",

$ git tag -l | tail -1
v1.3.0

# Branch status
$ git branch -a
* main
  remotes/origin/develop
  remotes/origin/main
  remotes/origin/feature/task-service

# Recent commits follow conventional format
$ git log --oneline -3
1a99316 (HEAD -> main, tag: v1.3.0, origin/main) docs: add comprehensive release notes for v1.3.0
6a683c8 docs: add version control documentation for v1.3.0
d8a2ddd feat: enhance task service with security improvements and validation
```

### Ready for Next Development Cycle

The repository is now properly configured for professional development:

1. **Feature Development**: Use `feature/*` branches from `develop`
2. **Release Management**: Use `release/*` branches for version preparation
3. **Hotfix Process**: Use `hotfix/*` branches from `main` for urgent fixes
4. **Documentation**: All changes tracked in CHANGELOG.md
5. **Versioning**: Automated with VERSION file and package.json sync

### Next Steps for Development

```bash
# Start new feature development
git checkout develop
git pull origin develop
git checkout -b feature/your-new-feature

# Follow conventional commits
git commit -m "feat(ui): add your new feature"

# When ready for next release
git checkout -b release/1.4.0
echo "1.4.0" > VERSION
npm version 1.4.0 --no-git-tag-version
# Update CHANGELOG.md
git commit -m "chore(release): bump version to 1.4.0"
```

## Support and Resources

- **Documentation**: Check README.md and component docs
- **Issues**: Use GitHub issues for bug reports
- **Questions**: Team chat or GitHub discussions
- **Code Review**: Follow PR template and guidelines
