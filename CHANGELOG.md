# Changelog

All notable changes to the Mshando Frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2025-09-02

### Added
- **Customer Navigation**: Implemented DashboardLayout component for consistent navigation across user roles
- **Customer Dashboard**: Added navigation header matching tasker interface for feature parity
- **DashboardLayout Component**: Shared layout component with user profile dropdown and role-based navigation
- **Enhanced Task Creation**: Improved LocalDateTime format handling for task due dates

### Fixed
- **JSX Compilation**: Resolved critical JSX syntax errors in TaskerDashboard and MyTasksPage components
- **Task Creation**: Fixed date format conversion from "YYYY-MM-DD" to "YYYY-MM-DDTHH:mm:ss"
- **Frontend Build**: Restored successful compilation and hot module replacement
- **Type Safety**: Fixed TypeScript compilation errors and improved type safety

### Changed
- **Task Status**: Updated to use proper TaskStatus enum values (PUBLISHED instead of OPEN)
- **Component Structure**: Refactored TaskerDashboard and MyTasksPage for better maintainability
- **Import Statements**: Corrected async thunk imports and selectors usage

### Removed
- **Temporary Files**: Cleaned up temporary backup files from JSX fixes
- **Unused Documentation**: Removed outdated sprint documentation files

### Security
- **Type Safety**: Enhanced TypeScript type safety across components
- **Component Validation**: Improved component prop validation and error handling

### Technical Improvements
- Unified navigation experience across customer and tasker roles
- Better component architecture with shared layouts
- Improved error handling and user feedback
- Enhanced development workflow with proper git branching

## [1.2.0] - Previous Release
- Task creation functionality
- Authentication system
- Basic dashboard interfaces

## [1.1.0] - Previous Release  
- Initial authentication implementation
- Basic user interface setup
- Core application structure
