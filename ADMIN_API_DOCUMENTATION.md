# Admin API Endpoints Documentation

**Version**: 1.4.0  
**Last Updated**: September 7, 2025  
**Base URL**: `http://localhost:8080/api`

## 🔐 Authentication

All admin endpoints require JWT authentication with `ADMIN` role.

**Headers Required**:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

## 👥 User Management Endpoints

### Search Users
```http
GET /api/admin/users/search
```

**Query Parameters**:
- `username` (optional): Filter by username
- `email` (optional): Filter by email
- `role` (optional): Filter by role (`CUSTOMER`, `TASKER`, `ADMIN`)
- `active` (optional): Filter by active status (`true`, `false`)
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)

**Response**:
```json
{
  "content": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "+1234567890",
      "role": "CUSTOMER",
      "emailVerified": true,
      "createdAt": "2025-09-01T10:00:00Z",
      "updatedAt": "2025-09-07T15:30:00Z"
    }
  ],
  "totalElements": 150,
  "totalPages": 8,
  "number": 0,
  "size": 20,
  "first": true,
  "last": false
}
```

### Get All Users (Paginated)
```http
GET /api/admin/users
```

**Query Parameters**:
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)

**Response**: Same as search users

### Get User by ID
```http
GET /api/admin/users/{userId}
```

**Path Parameters**:
- `userId`: User ID (integer)

**Response**:
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "bio": "Experienced handyman",
  "role": "TASKER",
  "emailVerified": true,
  "profilePictureUrl": "https://example.com/profile.jpg",
  "createdAt": "2025-09-01T10:00:00Z",
  "updatedAt": "2025-09-07T15:30:00Z"
}
```

### Delete User
```http
DELETE /api/admin/users/{userId}
```

**Path Parameters**:
- `userId`: User ID (integer)

**Response**:
```json
{
  "message": "User deleted successfully",
  "success": true
}
```

### Activate User
```http
POST /api/admin/users/{userId}/activate
```

**Path Parameters**:
- `userId`: User ID (integer)

**Response**: Updated User object

### Deactivate User
```http
POST /api/admin/users/{userId}/deactivate
```

**Path Parameters**:
- `userId`: User ID (integer)

**Response**: Updated User object

## 🏷️ Category Management Endpoints

### Get All Categories
```http
GET /api/admin/categories
```

**Query Parameters**:
- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 20)
- `search` (optional): Search by category name
- `active` (optional): Filter by active status

**Response**:
```json
{
  "content": [
    {
      "id": 1,
      "name": "Home Cleaning",
      "description": "Professional home cleaning services",
      "active": true,
      "createdAt": "2025-09-01T10:00:00Z",
      "updatedAt": "2025-09-07T15:30:00Z"
    }
  ],
  "totalElements": 25,
  "totalPages": 2,
  "number": 0,
  "size": 20
}
```

### Create Category
```http
POST /api/admin/categories
```

**Request Body**:
```json
{
  "name": "Gardening",
  "description": "Garden maintenance and landscaping services",
  "active": true
}
```

**Response**: Created Category object

### Update Category
```http
PUT /api/admin/categories/{categoryId}
```

**Path Parameters**:
- `categoryId`: Category ID (integer)

**Request Body**:
```json
{
  "name": "Garden Maintenance",
  "description": "Updated description for garden services",
  "active": true
}
```

**Response**: Updated Category object

### Delete Category
```http
DELETE /api/admin/categories/{categoryId}
```

**Path Parameters**:
- `categoryId`: Category ID (integer)

**Response**:
```json
{
  "message": "Category deleted successfully",
  "success": true
}
```

### Activate Category
```http
POST /api/admin/categories/{categoryId}/activate
```

**Response**: Updated Category object

### Deactivate Category
```http
POST /api/admin/categories/{categoryId}/deactivate
```

**Response**: Updated Category object

## 📊 Statistics & Analytics Endpoints

### Get Admin Statistics
```http
GET /api/admin/stats
```

**Response**:
```json
{
  "totalUsers": 1250,
  "totalCustomers": 850,
  "totalTaskers": 380,
  "totalTasks": 2100,
  "totalActiveTasks": 450,
  "totalCompletedTasks": 1500,
  "totalBids": 5600,
  "totalActiveBids": 320,
  "totalRevenue": 125000.50,
  "monthlyRevenue": 18500.75,
  "platformHealth": {
    "status": "healthy",
    "uptime": 99.9,
    "activeConnections": 156,
    "errorRate": 0.1,
    "averageResponseTime": 245
  }
}
```

### Get Bid Statistics
```http
GET /api/admin/stats/bids
```

**Response**:
```json
{
  "totalBids": 5600,
  "pendingBids": 320,
  "acceptedBids": 1850,
  "rejectedBids": 3430,
  "averageBidAmount": 125.75,
  "bidsByCategory": [
    {
      "categoryName": "Home Cleaning",
      "bidCount": 850,
      "averageAmount": 95.50
    }
  ],
  "bidsTrend": [
    {
      "date": "2025-09-01",
      "count": 45,
      "amount": 5675.25
    }
  ]
}
```

### Get Payment Statistics
```http
GET /api/admin/stats/payments
```

**Response**:
```json
{
  "totalPayments": 1850,
  "totalAmount": 125000.50,
  "totalServiceFees": 6250.25,
  "averageTaskValue": 67.57,
  "monthlyRevenue": [
    {
      "month": "2025-09",
      "amount": 18500.75
    }
  ],
  "paymentMethodDistribution": [
    {
      "method": "CREDIT_CARD",
      "count": 1200,
      "percentage": 64.9
    }
  ]
}
```

### Get User Statistics
```http
GET /api/admin/stats/users
```

**Response**:
```json
{
  "totalUsers": 1250,
  "newUsersThisMonth": 85,
  "activeUsers": 940,
  "usersByRole": [
    {
      "role": "CUSTOMER",
      "count": 850
    },
    {
      "role": "TASKER", 
      "count": 380
    },
    {
      "role": "ADMIN",
      "count": 20
    }
  ],
  "topTaskers": [
    {
      "user": {
        "id": 45,
        "username": "expertworker",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "completedTasks": 156,
      "totalEarnings": 8950.25,
      "averageRating": 4.9
    }
  ],
  "userGrowthTrend": [
    {
      "month": "2025-09",
      "newUsers": 85,
      "totalUsers": 1250
    }
  ]
}
```

### Get Service Fees
```http
GET /api/admin/stats/fees
```

**Response**:
```json
{
  "totalFees": 6250.25,
  "monthlyFees": [
    {
      "month": "2025-09",
      "amount": 925.13
    }
  ],
  "feesByCategory": [
    {
      "categoryName": "Home Cleaning",
      "totalFees": 1850.50
    }
  ]
}
```

### Get Recent Activity
```http
GET /api/admin/activity/recent
```

**Query Parameters**:
- `limit` (optional): Number of activities to return (default: 10, max: 100)

**Response**:
```json
[
  {
    "id": 1,
    "type": "USER_REGISTERED",
    "description": "New user registered as Customer",
    "userId": 1251,
    "userName": "newuser123",
    "timestamp": "2025-09-07T15:45:00Z"
  },
  {
    "id": 2,
    "type": "TASK_CREATED",
    "description": "New task posted: 'Kitchen Deep Clean'",
    "userId": 850,
    "userName": "homeowner_jane",
    "timestamp": "2025-09-07T15:30:00Z"
  },
  {
    "id": 3,
    "type": "BID_PLACED",
    "description": "Bid placed on task #2101",
    "userId": 45,
    "userName": "expertworker",
    "timestamp": "2025-09-07T15:15:00Z"
  }
]
```

### Get Platform Health
```http
GET /api/admin/health
```

**Response**:
```json
{
  "status": "healthy",
  "uptime": 99.9,
  "activeUsers": 156,
  "errorRate": 0.1,
  "averageResponseTime": 245,
  "databaseStatus": "connected",
  "serviceStatuses": {
    "userService": "healthy",
    "taskService": "healthy", 
    "biddingService": "healthy",
    "paymentService": "healthy",
    "notificationService": "healthy"
  },
  "memoryUsage": {
    "used": 2.1,
    "total": 8.0,
    "percentage": 26.25
  },
  "diskUsage": {
    "used": 45.2,
    "total": 100.0,
    "percentage": 45.2
  }
}
```

## ⚙️ System Configuration Endpoints

### Get System Configuration
```http
GET /api/admin/config
```

**Response**:
```json
{
  "maintenanceMode": false,
  "registrationEnabled": true,
  "paymentProcessingEnabled": true,
  "notificationsEnabled": true,
  "maxTasksPerUser": 50,
  "maxBidsPerTask": 20,
  "serviceFeePercentage": 5.0
}
```

### Update System Configuration
```http
PUT /api/admin/config
```

**Request Body**:
```json
{
  "maintenanceMode": false,
  "registrationEnabled": true,
  "paymentProcessingEnabled": true,
  "notificationsEnabled": true,
  "maxTasksPerUser": 75,
  "maxBidsPerTask": 25,
  "serviceFeePercentage": 5.5
}
```

**Response**: Updated configuration object

## 🚨 Error Responses

### Standard Error Format
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid request parameters",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2025-09-07T15:30:00Z"
}
```

### Common Error Codes
- `400 BAD_REQUEST`: Invalid request parameters
- `401 UNAUTHORIZED`: Missing or invalid authentication
- `403 FORBIDDEN`: Insufficient permissions (non-admin user)
- `404 NOT_FOUND`: Resource not found
- `409 CONFLICT`: Resource already exists
- `500 INTERNAL_SERVER_ERROR`: Server error

## 📋 Rate Limiting

Admin endpoints are rate-limited to prevent abuse:
- **User Operations**: 100 requests per minute
- **Statistics**: 60 requests per minute  
- **Configuration**: 20 requests per minute

## 🔍 Audit Logging

All admin operations are logged with:
- **Admin User ID**: Who performed the action
- **Action Type**: What operation was performed
- **Target Resource**: What was modified
- **Timestamp**: When the action occurred
- **IP Address**: Where the request originated
- **Result**: Success or failure status

## 📚 Additional Resources

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Gateway Health**: http://localhost:8080/actuator/health
- **Eureka Dashboard**: http://localhost:8761
- **Admin Frontend**: http://localhost:5173/admin

---

**Documentation Version**: 1.4.0  
**API Version**: v1  
**Last Updated**: September 7, 2025
