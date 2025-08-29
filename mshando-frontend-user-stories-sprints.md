
# 📋 User Stories & Acceptance Criteria – React Frontend for Mshando

This document includes **epics, user stories, acceptance criteria, and sprint prioritization** for building the Mshando frontend.

---

# 🏃 Sprint Prioritization

### **Sprint 1 (MVP – Authentication & Core Tasks)**
- Epic 1: Authentication & User Management  
  - Story 1.1 – User Registration  
  - Story 1.2 – User Login  
  - Story 1.3 – Session Management  
- Epic 2: Task Management (Customer)  
  - Story 2.1 – Create Task  
  - Story 2.2 – Manage My Tasks  
- Epic 3: Task Browsing (Tasker)  
  - Story 3.1 – Browse Tasks  
  - Story 3.2 – View Task Details  

### **Sprint 2 (Collaboration & Bidding)**
- Epic 2: Task Management (Customer)  
  - Story 2.3 – Publish & Assign Task  
  - Story 2.4 – Upload Task Images  
- Epic 3: Task Browsing (Tasker)  
  - Story 3.3 – View My Assignments  
- Epic 4: Bidding System  
  - Story 4.1 – Create Bid  
  - Story 4.2 – Manage My Bids  
  - Story 4.3 – Customer Manages Bids  

### **Sprint 3 (Payments & Notifications)**
- Epic 5: Payments  
  - Story 5.1 – Task Payments (Customer)  
  - Story 5.2 – Earnings (Tasker)  
  - Story 5.3 – Refunds  
- Epic 6: Notifications  
  - Story 6.1 – View Notifications  
  - Story 6.2 – System Alerts  

### **Sprint 4 (Admin & Enhancements)**
- Epic 7: Admin Features  
  - Story 7.1 – Manage Users  
  - Story 7.2 – Manage Categories  
  - Story 7.3 – System Reports  
- UI/UX Enhancements:  
  - Improved dashboards, charts, responsive UI  
  - Advanced search & filtering  

---

## Epic 1: **Authentication & User Management**

**Story 1.1 – User Registration**  
- As a new user, I want to register with username, email, password, and role (CUSTOMER or TASKER) so I can use the platform.  
✅ **Acceptance Criteria**  
- Registration form with validation (required fields, email format, password length).  
- On submit, call `POST /auth/register`.  
- Show success message: *“User registered successfully”*.  
- Redirect to login page after registration.  

**Story 1.2 – User Login**  
- As a user, I want to log in with my credentials so I can access my dashboard.  
✅ **Acceptance Criteria**  
- Login form with username & password.  
- On submit, call `POST /auth/login`.  
- Store JWT & refresh token (httpOnly cookie/localStorage).  
- Redirect user based on role:  
  - CUSTOMER → Customer Dashboard  
  - TASKER → Tasker Dashboard  
  - ADMIN → Admin Dashboard  

**Story 1.3 – Session Management**  
- As a user, I want my session to stay valid and refresh tokens automatically.  
✅ **Acceptance Criteria**  
- Refresh token flow using `POST /auth/refresh`.  
- If token expires, auto-refresh without logging user out.  
- If refresh fails, redirect to login.  

**Story 1.4 – User Profile Management**  
- As a user, I want to view and edit my profile.  
✅ **Acceptance Criteria**  
- Profile page fetches data from `GET /users/me`.  
- Update profile form calls `PUT /users/me`.  
- Show success message when profile is updated.  

---

## Epic 2: **Task Management (Customer)**

**Story 2.1 – Create Task**  
- As a CUSTOMER, I want to create a task so TASKERS can bid.  
✅ **Acceptance Criteria**  
- Task creation form (title, description, budget, category, location, due date, requirements).  
- Calls `POST /tasks`.  
- Shows confirmation message: *“Task created successfully”*.  

**Story 2.2 – Manage My Tasks**  
- As a CUSTOMER, I want to view, edit, and delete my tasks.  
✅ **Acceptance Criteria**  
- Fetch tasks using `GET /tasks/my-tasks`.  
- Edit form calls `PUT /tasks/{id}`.  
- Delete task calls `DELETE /tasks/{id}` with confirmation modal.  

**Story 2.3 – Publish & Assign Task**  
- As a CUSTOMER, I want to publish and assign a task.  
✅ **Acceptance Criteria**  
- Publish button → `PATCH /tasks/{id}/publish`.  
- Assign task button → `PATCH /tasks/{id}/assign?taskerId={id}`.  

**Story 2.4 – Upload Task Images**  
- As a CUSTOMER, I want to upload images for my task.  
✅ **Acceptance Criteria**  
- Upload form calls `POST /tasks/{taskId}/images`.  
- Set primary image via `PATCH /tasks/{taskId}/images/{imageId}/set-primary`.  

---

## Epic 3: **Task Browsing (Tasker)**

**Story 3.1 – Browse Tasks**  
- As a TASKER, I want to browse and filter published tasks.  
✅ **Acceptance Criteria**  
- Fetch tasks via `GET /tasks/search`.  
- Filters: category, budget, location, remote toggle.  
- Paginated results with task cards.  

**Story 3.2 – View Task Details**  
- As a TASKER, I want to view task details.  
✅ **Acceptance Criteria**  
- Task details page fetches data from `GET /tasks/{id}`.  
- Show task description, budget, due date, images.  

**Story 3.3 – View My Assignments**  
- As a TASKER, I want to see tasks assigned to me.  
✅ **Acceptance Criteria**  
- Fetch assignments with `GET /tasks/my-assignments`.  

---

## Epic 4: **Bidding System**

**Story 4.1 – Create Bid**  
- As a TASKER, I want to submit a bid on a task.  
✅ **Acceptance Criteria**  
- Bid form (amount, message, estimated hours).  
- Calls `POST /bids`.  
- Show confirmation on success.  

**Story 4.2 – Manage My Bids**  
- As a TASKER, I want to view and update my bids.  
✅ **Acceptance Criteria**  
- Fetch my bids using `GET /bids/my-bids`.  
- Update via `PUT /bids/{bidId}`.  
- Withdraw via `PATCH /bids/{bidId}/withdraw`.  

**Story 4.3 – Customer Manages Bids**  
- As a CUSTOMER, I want to view bids on my tasks and accept/reject them.  
✅ **Acceptance Criteria**  
- Fetch bids using `GET /bids/my-tasks-bids`.  
- Accept via `PATCH /bids/{bidId}/accept`.  
- Reject via `PATCH /bids/{bidId}/reject`.  

---

## Epic 5: **Payments**

**Story 5.1 – Task Payments (Customer)**  
- As a CUSTOMER, I want to pay for completed tasks.  
✅ **Acceptance Criteria**  
- Payment form (amount, method).  
- Calls `POST /payments`.  
- Show confirmation & update payment history.  

**Story 5.2 – Earnings (Tasker)**  
- As a TASKER, I want to view my earnings.  
✅ **Acceptance Criteria**  
- Fetch data via `GET /payments/tasker/{taskerId}/earnings`.  
- Show total + breakdown.  

**Story 5.3 – Refunds**  
- As a CUSTOMER, I want to request a refund if task is not completed.  
✅ **Acceptance Criteria**  
- Refund request form calls `POST /payments/{paymentId}/refund`.  
- Show refund status.  

---

## Epic 6: **Notifications**

**Story 6.1 – View Notifications**  
- As a user, I want to see my notifications.  
✅ **Acceptance Criteria**  
- Fetch via `GET /notifications/recipient/{recipientId}`.  
- Show list with type (email, SMS), subject, and status.  

**Story 6.2 – System Alerts**  
- As a user, I want to see alerts when tasks or bids are updated.  
✅ **Acceptance Criteria**  
- Show toast notifications on important events (bid accepted, task assigned, payment received).  

---

## Epic 7: **Admin Features**

**Story 7.1 – Manage Users**  
- As an ADMIN, I want to search, view, and delete users.  
✅ **Acceptance Criteria**  
- Search via `GET /users/search`.  
- Delete via `DELETE /users/{id}`.  

**Story 7.2 – Manage Categories**  
- As an ADMIN, I want to add, update, or deactivate categories.  
✅ **Acceptance Criteria**  
- Create via `POST /categories`.  
- Update via `PUT /categories/{id}`.  
- Deactivate/activate via `PATCH /categories/{id}/deactivate|activate`.  

**Story 7.3 – System Reports**  
- As an ADMIN, I want to view statistics (tasks, bids, payments).  
✅ **Acceptance Criteria**  
- Fetch reports using `/bids/statistics`, `/payments/service-fees`, etc.  
- Display graphs/charts on admin dashboard.  

---
