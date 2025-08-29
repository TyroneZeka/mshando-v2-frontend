# Git Commit Guidelines for Mshando Frontend

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit
- **security**: Security-related changes

## Frontend-Specific Scopes

Common scopes for the frontend:
- **ui**: User interface components
- **auth**: Authentication-related changes
- **api**: API integration changes
- **routing**: React Router changes
- **state**: Redux/state management changes
- **hooks**: Custom hooks
- **utils**: Utility functions
- **types**: TypeScript type definitions
- **styles**: CSS/styling changes
- **config**: Configuration changes

## Examples

### Good Examples

```bash
feat(ui): add user registration form

Implement comprehensive registration form with:
- Form validation using react-hook-form
- Role selection (Customer/Tasker)
- Phone number validation
- Email verification integration
- Responsive design with TailwindCSS

Closes #123
```

```bash
fix(auth): resolve JWT token storage issue

The token was not being persisted correctly after successful
login due to localStorage timing issues.

- Update AuthService to handle token storage properly
- Add token validation before API requests
- Update Redux state management for auth flow
```

```bash
style(ui): improve responsive design for mobile

- Adjust form layouts for small screens
- Update navigation menu for touch devices
- Fix button spacing and font sizes
- Ensure consistent styling across components
```

### Frontend-Specific Examples

```bash
feat(state): implement user profile management
fix(api): resolve CORS issues with backend
refactor(hooks): extract authentication logic
style(ui): update button component styling
test(auth): add login form validation tests
docs(api): update service documentation
build(deps): upgrade React to v18.2.0
```

## Rules

1. **Subject Line**:
   - Keep it under 50 characters
   - Use imperative mood ("add" not "added" or "adds")
   - Don't end with a period
   - Capitalize the first letter after the colon

2. **Body** (optional):
   - Wrap at 72 characters
   - Explain what and why, not how
   - Use bullet points for multiple changes
   - Reference issues/PRs when applicable

3. **Breaking Changes**:
   - Add `!` after the type/scope: `feat!: change API response format`
   - Describe the breaking change in the footer

4. **Footer** (optional):
   - Reference issues: `Closes #123`, `Fixes #456`
   - Note breaking changes: `BREAKING CHANGE: Component props changed`

## Frontend Workflow

### Component Development
```bash
# Create feature branch
git checkout main
git pull origin main
git checkout -b feature/user-profile-component

# Make changes and commit regularly
git add .
git commit -m "feat(ui): add user profile component skeleton"
git commit -m "style(ui): add profile component styling"
git commit -m "feat(ui): implement profile data display"
git commit -m "test(ui): add profile component tests"

# Push and create PR
git push origin feature/user-profile-component
```

### Before Committing

1. **Check for errors**: Ensure no TypeScript errors
2. **Remove debug code**: Remove unnecessary console.log statements
3. **Test functionality**: Verify components work as expected
4. **Format code**: Use Prettier/ESLint if configured
5. **Review changes**: `git diff --cached`

## Security Considerations

### Never Commit
- API keys or secrets in code
- Environment variables with sensitive data
- User credentials or tokens
- Debug information with sensitive data

### Always Check
```bash
# Review staged changes
git diff --cached

# Check for sensitive data
grep -r "password\|secret\|token\|key" src/ --exclude-dir=node_modules
```

## Common Frontend Patterns

### Component Changes
```bash
feat(ui): add loading spinner component
fix(ui): resolve form validation edge case
style(ui): update component responsive design
refactor(ui): extract reusable form components
```

### State Management
```bash
feat(state): implement user authentication flow
fix(state): resolve Redux action dispatch issue
refactor(state): normalize API response data
```

### API Integration
```bash
feat(api): integrate user registration endpoint
fix(api): handle network error scenarios
refactor(api): extract common API utilities
```

### Build and Dependencies
```bash
build(deps): update React and related packages
chore(deps): remove unused dependencies
ci: add automated testing workflow
```

## Tools and Quality

### Recommended VS Code Extensions
- GitLens
- Conventional Commits
- Prettier
- ESLint
- Auto Rename Tag

### Pre-commit Checks
The git hooks will automatically check for:
- ✅ File type validation
- ✅ Basic code quality issues
- ✅ Commit message format
- ⚠️ Console.log warnings
- ℹ️ TODO/FIXME notifications

## Example Commit History

```
feat(ui): implement user authentication pages
fix(auth): resolve token refresh timing issue
feat(api): integrate with user service endpoints
style(ui): improve form validation styling
refactor(hooks): extract authentication logic
test(auth): add comprehensive login tests
docs: update component documentation
chore(deps): update TailwindCSS to v3.3.0
```

This approach ensures:
- Clear understanding of changes
- Easy debugging and rollbacks
- Automated changelog generation
- Consistent code quality
- Team collaboration efficiency
