# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Mshando Frontend

A modern React TypeScript frontend for the Mshando task marketplace platform, built with Vite for optimal performance.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **TailwindCSS** for styling
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Recharts** for data visualization (admin dashboard)

## 📋 Features

### Authentication & User Management
- User registration with role selection (Customer/Tasker)
- JWT-based authentication with auto-refresh
- Role-based routing and access control
- Profile management

### Customer Features
- Create and manage tasks
- Upload task images
- Publish tasks and receive bids
- Review and accept/reject bids
- Track task progress
- Make payments securely

### Tasker Features
- Browse available tasks with filters
- Submit bids on tasks
- Manage bid portfolio
- Track assigned tasks
- View earnings and payment history

### Admin Features
- User management (search, view, delete)
- Category management (create, update, activate/deactivate)
- System reports and analytics
- Platform monitoring

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Clone and navigate to the project**
   ```bash
   cd mshando-v2-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your API endpoints:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://localhost:8080
   VITE_USER_SERVICE_URL=http://localhost:8081/api/v1
   VITE_TASK_SERVICE_URL=http://localhost:8082/api/v1
   VITE_BIDDING_SERVICE_URL=http://localhost:8083/api/v1
   VITE_PAYMENT_SERVICE_URL=http://localhost:8084/api/v1
   VITE_NOTIFICATION_SERVICE_URL=http://localhost:8085/api/v1

   # App Configuration
   VITE_APP_NAME=Mshando
   VITE_APP_VERSION=1.0.0
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   └── common/         # Common UI components
├── pages/              # Page components
│   ├── auth/           # Login, Register pages
│   ├── customer/       # Customer dashboard and features
│   ├── tasker/         # Tasker dashboard and features
│   └── admin/          # Admin dashboard and features
├── store/              # Redux store configuration
│   └── slices/         # Redux slices for different domains
├── services/           # API service classes
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

## 🔐 Authentication Flow

1. **Registration**: Users choose between Customer and Tasker roles
2. **Login**: JWT token received and stored securely
3. **Auto-refresh**: Tokens refreshed automatically before expiration
4. **Role-based routing**: Users redirected to appropriate dashboards
5. **Protected routes**: Unauthorized access blocked

## 🎨 Styling

- **TailwindCSS** for utility-first styling
- **Responsive design** with mobile-first approach
- **Custom color palette** for brand consistency
- **Component-based styling** for maintainability

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🧪 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## 🔧 API Integration

The frontend integrates with the following microservices:

- **User Service** (Port 8081): Authentication, user management
- **Task Service** (Port 8082): Task CRUD, categories, images
- **Bidding Service** (Port 8083): Bid management, statistics
- **Payment Service** (Port 8084): Payment processing, refunds
- **Notification Service** (Port 8085): Email/SMS notifications

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build artifacts will be in the `dist/` directory.

### Environment Variables for Production
Ensure all environment variables are properly configured for your production environment.

## 🔒 Security Features

- JWT token storage with httpOnly cookies (recommended for production)
- Automatic token refresh
- XSS protection through React's built-in sanitization
- CORS handling
- Input validation and sanitization

## 📊 State Management

Redux Toolkit is used for state management with the following slices:
- **Auth**: User authentication and profile data
- **Tasks**: Task management and filtering
- **Bids**: Bid creation and management
- **Payments**: Payment processing and history
- **Notifications**: System notifications

## 🎯 Sprint Implementation Status

### ✅ Sprint 1 (MVP - Authentication & Core Tasks)
- [x] User Registration and Login
- [x] JWT Authentication with auto-refresh
- [x] Role-based routing (Customer/Tasker/Admin)
- [x] Basic dashboard layouts
- [x] Protected route components

### 🚧 Sprint 2 (Collaboration & Bidding) - In Progress
- [ ] Task creation and management
- [ ] Task browsing and filtering
- [ ] Bidding system
- [ ] Task image uploads

### 📋 Sprint 3 (Payments & Notifications) - Planned
- [ ] Payment processing
- [ ] Earnings dashboard
- [ ] Notification system
- [ ] Refund management

### 📋 Sprint 4 (Admin & Enhancements) - Planned
- [ ] Admin user management
- [ ] Category management
- [ ] System reports and analytics
- [ ] Enhanced UI/UX

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please refer to the project documentation or create an issue in the repository.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
