# Branch Protection Configuration

## Required Branch Protection Rules

### Main Branch (`main`)

**Protection Rules:**
- ✅ Require a pull request before merging
- ✅ Require approvals: 1
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require review from code owners
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Include administrators in restrictions

**Required Status Checks:**
- `test` - All unit and integration tests
- `build` - Production build successful
- `security-scan` - Security vulnerability scan
- `lighthouse` - Performance and accessibility checks

**Additional Settings:**
- ✅ Restrict pushes that create files larger than 100MB
- ✅ Block force pushes
- ✅ Block deletions

### Develop Branch (`develop`)

**Protection Rules:**
- ✅ Require a pull request before merging
- ✅ Require approvals: 1
- ✅ Require review from code owners
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

**Required Status Checks:**
- `test` - All tests must pass
- `build` - Build must succeed
- `security-scan` - No high-severity vulnerabilities

## Implementation Steps

### 1. GitHub Repository Settings

Navigate to: `Settings` → `Branches` → `Add rule`

#### For Main Branch:
```
Branch name pattern: main
☑️ Restrict pushes that create files larger than 100MB
☑️ Require a pull request before merging
  ☑️ Require approvals: 1
  ☑️ Dismiss stale PR approvals when new commits are pushed
  ☑️ Require review from code owners
☑️ Require status checks to pass before merging
  ☑️ Require branches to be up to date before merging
  Required status checks:
    - test
    - build
    - security-scan
    - lighthouse
☑️ Require conversation resolution before merging
☑️ Include administrators
☑️ Restrict pushes that create files larger than 100MB
☑️ Block force pushes
☑️ Block deletions
```

#### For Develop Branch:
```
Branch name pattern: develop
☑️ Require a pull request before merging
  ☑️ Require approvals: 1
  ☑️ Require review from code owners
☑️ Require status checks to pass before merging
  ☑️ Require branches to be up to date before merging
  Required status checks:
    - test
    - build
    - security-scan
```

### 2. Required Status Checks

These checks must pass before merging:

#### Test Job
- ESLint validation
- TypeScript compilation
- Unit tests execution
- Test coverage requirements

#### Build Job
- Production build success
- No build warnings/errors
- Asset optimization verification

#### Security Scan
- npm audit (no high vulnerabilities)
- Trivy security scanner
- Dependency vulnerability check

#### Lighthouse (Main branch only)
- Performance score ≥ 90
- Accessibility score ≥ 95
- Best practices score ≥ 90
- SEO score ≥ 90

### 3. Code Owners Integration

CODEOWNERS file ensures:
- ✅ Automatic reviewer assignment
- ✅ Required reviews for critical files
- ✅ Security-focused reviews for auth components
- ✅ Architecture review for state management changes

### 4. Workflow Integration

The protection rules work with our CI/CD pipeline:

```yaml
# GitHub Actions will report status to these check names
- name: test
- name: build  
- name: security-scan
- name: lighthouse
```

## Enforcement Strategy

### Pull Request Requirements

1. **All Branches → Develop**:
   - 1 approval required
   - All tests must pass
   - Security scan must pass
   - Branch must be up-to-date

2. **Develop → Main**:
   - 1 approval required
   - All tests must pass
   - Build must succeed
   - Security scan must pass
   - Lighthouse checks must pass
   - Performance requirements met

### Emergency Procedures

#### Hotfix Process
For critical production issues:

1. Create hotfix branch from `main`
2. Make minimal necessary changes
3. Create PR to `main` with expedited review
4. Require 1 approval (can be expedited)
5. All automated checks must still pass
6. Merge to `main` and cherry-pick to `develop`

#### Override Procedures
Only repository administrators can:
- Temporarily disable branch protection
- Force merge in extreme emergencies
- Must document reason and restore protection immediately

## Monitoring and Compliance

### Regular Reviews

**Weekly:**
- Review failed status checks
- Monitor bypass attempts
- Check compliance with approval requirements

**Monthly:**
- Review protection rule effectiveness
- Update status check requirements
- Assess security scan results

### Metrics to Track

- Pull request approval time
- Status check pass rates
- Security vulnerability trends
- Build failure rates
- Performance score trends

## Exceptions and Special Cases

### Automated Updates

Dependabot and similar automated updates:
- Can target `develop` branch directly
- Must pass all status checks
- Require manual approval for major updates

### Documentation Changes

Documentation-only changes:
- Still require approval
- Reduced status check requirements
- Fast-track review process

### Configuration Changes

Build/config changes require:
- Extra scrutiny in review
- Testing in staging environment
- Verification of no breaking changes

## Team Training

### Developer Onboarding

New team members must understand:
1. Branch protection purpose and benefits
2. How to create compliant pull requests
3. Status check requirements and troubleshooting
4. Code review expectations

### Best Practices

1. **Create small, focused PRs** for easier review
2. **Write clear PR descriptions** explaining changes
3. **Respond promptly to review feedback**
4. **Keep branches up-to-date** to avoid conflicts
5. **Test locally before pushing** to avoid CI failures

## Troubleshooting

### Common Issues

**Status Checks Failing:**
- Check GitHub Actions logs
- Run checks locally: `npm run lint`, `npm run test`, `npm run build`
- Ensure all dependencies are updated

**Branch Protection Blocking Merge:**
- Verify all required approvals received
- Check that branch is up-to-date with target
- Ensure all conversations are resolved

**Emergency Override Needed:**
1. Contact repository administrator
2. Document the emergency reason
3. Temporarily disable protection
4. Merge with caution
5. Immediately restore protection
6. Post-incident review

## Configuration Script

```bash
# Example GitHub CLI commands to set up branch protection
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["test","build","security-scan","lighthouse"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true}' \
  --field restrictions=null
```

---

**Status**: ✅ Ready for Implementation  
**Requires**: Repository admin access to configure  
**Priority**: High - Implement before team collaboration begins
