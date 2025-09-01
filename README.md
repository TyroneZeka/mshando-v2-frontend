# Mshando v2 Frontend

> 🎯 **Modern Task Marketplace Platform** - Connecting customers with skilled taskers through a comprehensive bidding system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [📋 Frontend Documentation](./FRONTEND_DOCUMENTATION.md) | Complete technical documentation and architecture guide |
| [🎯 Sprint 2 Summary](./SPRINT_2_SUMMARY.md) | Latest sprint implementation details and features |
| [🔧 Development Guide](./FRONTEND_DOCUMENTATION.md#development-guide) | Setup, workflow, and contribution guidelines |

## 🏗️ Architecture Overview

```
Frontend (React + TypeScript)
├── 🔐 Authentication System (JWT-based)
├── 🎨 Modern UI/UX (TailwindCSS)
├── 🔄 State Management (Redux Toolkit)
├── 🛡️ Protected Routing (Role-based)
├── 📱 Responsive Design (Mobile-first)
└── 🔌 API Integration (Axios + Interceptors)
```

## ✨ Key Features

### 🔐 **Authentication & Security**
- JWT-based authentication with automatic refresh
- Role-based access control (Customer/Tasker/Admin)
- Protected routes with seamless redirects
- Secure token management

### 👥 **User Roles & Workflows**

#### 🛍️ **Customer Journey**
```
Register → Create Tasks → Add Photos → Receive Bids → Accept Bids → Monitor Progress
```

#### 🔨 **Tasker Journey** 
```
Register → Browse Tasks → Submit Bids → Win Assignments → Complete Tasks → Get Paid
```

### 💰 **Bidding System**
- **Create Bids**: Submit competitive proposals with validation
- **Manage Bids**: Edit, withdraw, and track bid status
- **Review Bids**: Customer interface for accepting/rejecting bids
- **Assignment Tracking**: Monitor assigned tasks and progress

### 📸 **Media Management**
- Drag-and-drop image upload
- Multiple file support with preview
- File validation and size limits
- Seamless integration with task workflow

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React 18 + TypeScript | Modern, type-safe frontend development |
| **State Management** | Redux Toolkit | Predictable state management with async handling |
| **Styling** | TailwindCSS | Utility-first CSS with responsive design |
| **Routing** | React Router v6 | Client-side routing with protection |
| **Forms** | React Hook Form | Performant forms with validation |
| **HTTP Client** | Axios | API integration with interceptors |
| **Build Tool** | Vite | Fast development and optimized builds |
| **Icons** | Lucide React | Consistent icon system |

## 📊 Current Status

### ✅ **Sprint 1: Authentication & Core Tasks** (Complete)
- User authentication system
- Task creation and management
- Basic browsing functionality
- Profile management

### ✅ **Sprint 2: Collaboration & Bidding** (Complete)
- Complete bidding system
- Photo upload functionality
- Assignment management
- Customer bid review system

### 🔄 **Sprint 3: Payments & Reviews** (Planned)
- Payment integration
- Review and rating system
- Real-time notifications
- Advanced features

## 🎯 Sprint 2 Achievements

### 📱 **New Pages Implemented**
1. **CreateBidPage** - Tasker bid submission with validation
2. **MyBidsPage** - Comprehensive bid management dashboard
3. **TaskBidsPage** - Customer bid review and acceptance
4. **AddPhotosPage** - Drag-and-drop image upload interface
5. **MyAssignmentsPage** - Assignment tracking and status updates

### � **Enhanced Services**
- **bidService.ts** - Complete CRUD operations for bid management
- **taskService.ts** - Photo upload capabilities with FormData handling
- **State Management** - Redux slices for bidding system
- **API Integration** - RESTful endpoints with error handling

### 🎨 **UI/UX Improvements**
- Responsive design across all devices
- Consistent loading states and error handling
- Form validation with real-time feedback
- Modern component library with TailwindCSS

## 🚦 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm 8+
- Git

### **Development Setup**
```bash
# 1. Clone repository
git clone <repository-url>
cd mshando-v2-frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your API URL

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:5173
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📈 Quality Metrics

| Metric | Status | Details |
|--------|--------|---------|
| **TypeScript Coverage** | ✅ 100% | Full type safety implementation |
| **Build Status** | ✅ Passing | Zero compilation errors |
| **ESLint** | ✅ Clean | Minor unused import warnings only |
| **Responsive Design** | ✅ Complete | Mobile-first approach |
| **Error Handling** | ✅ Comprehensive | User-friendly error messages |
| **Loading States** | ✅ Implemented | Consistent loading indicators |

## 🤝 Contributing

1. **Branch Naming**: `feature/sprint-n-feature-name`
2. **Commit Messages**: Follow conventional commits
3. **Code Style**: ESLint + Prettier configuration
4. **Testing**: Include tests for new features
5. **Documentation**: Update relevant documentation

## 📞 Support

For technical documentation and implementation details, see:
- [📋 Complete Frontend Documentation](./FRONTEND_DOCUMENTATION.md)
- [🎯 Sprint 2 Implementation Summary](./SPRINT_2_SUMMARY.md)

---

**Built with ❤️ using modern React development practices**
