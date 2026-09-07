# HR Management System — Backend

A **Node.js / Express / MongoDB REST API** for managing employees, departments, tasks, attendance, leave requests, payroll, and real-time notifications.

The system provides **role-based access control (RBAC)** for Admin, HR, Manager, Security, and Employee users, with JWT authentication, request validation, MongoDB transactions, and real-time notifications using Socket.io.

---

## Tech Stack

- **Runtime:** Node.js (ESM modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (Access + Refresh Tokens)
- **Cookies:** HTTP-only cookies
- **Validation:** Zod
- **Real-time:** Socket.io
- **Email:** Nodemailer
- **Password Hashing:** bcrypt
- **PDF Generation:** PDFKit

---

## Modules

### Authentication

- Login
- Access token authentication
- Refresh token rotation
- Logout
- OTP-based password reset
- Reset password
- HTTP-only cookie authentication

### Users

- User management
- Role-based access control
- Multiple system roles

### Employees

- Employee profiles
- Department assignment
- Job title
- Contract type
- Salary information
- Bank details
- Emergency contacts
- Employee status

### Departments

- Create departments
- View departments
- Assign managers
- Department-based employee management

### Tasks

- Create and assign tasks
- Employee task management
- Task status updates
- Task comments
- Deadlines
- Real-time task notifications

### Attendance

- Daily attendance records
- Present / Absent / Late status
- Check-in and check-out
- Late detection
- Security-based attendance management
- Employee attendance history

### Permissions / Leave

- Employee leave requests
- Start and end dates
- Request reasons
- Manager approval/rejection
- HR approval/rejection
- Overlapping request validation
- Employee request history

### Payroll

- Monthly payroll generation
- Base salary
- Transport allowance
- Housing allowance
- Medical allowance
- Absence deductions
- Late deductions
- Automatic net salary calculation
- Draft / Paid status
- Update unpaid payroll
- Mark payroll as paid
- Payslip PDF download
- Employee notification when payroll is paid

### Notifications

- Persistent notifications in MongoDB
- Read/unread status
- Unread notification count
- Task notifications
- Payroll notifications
- Real-time notifications using Socket.io
- User-specific Socket.io rooms

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB local instance or MongoDB Atlas
- npm

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/youssef-sheashia/HR-Management

cd HR-Management

npm install
```

---

## Environment Variables

Create a `config.env` file in the project root:

```env
# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
LOCAL_DATABASE=mongodb://localhost:27017/hr-management-system

# JWT
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_REFRESH_TOKEN_EXPIRES_IN=30d
JWT_RESET_PASSWORD_SECRET=your_reset_password_secret

# Mail
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=your_smtp_username
MAIL_PASSWORD=your_smtp_password
MAIL_FROM=no-reply@hrsystem.com
```

---

## Running the Server

Start the development server:

```bash
node server.js
```

The server connects to MongoDB first and then starts the Express server.

You should see messages similar to:

```text
db connect successfully
server running in port 3000
```

---

# Database Seeding

A seed script is included to populate the database with development/testing data.

The seed creates:

- Users
- Departments
- Employees
- Tasks
- Attendance records
- Notifications
- Permissions
- Payroll records

Run:

```bash
node seed.js
```

### ⚠️ Warning

The seed script **deletes existing data** from the connected database before creating new records.

Do not run the seed script against a production database.

### Seeded Credentials

All seeded users use:

```text
Password: 12345678
```

# Roles & Permissions

| Role         | Responsibilities                                          |
| ------------ | --------------------------------------------------------- |
| **admin**    | Full system access                                        |
| **hr**       | Employee management, payroll, leave approval              |
| **manager**  | Department-scoped access, task assignment, leave approval |
| **security** | Daily attendance management                               |
| **employee** | Own profile, tasks, attendance, leave requests, payslips  |

The API uses authentication middleware and role-based authorization to restrict access to protected resources.

---

# API Overview

Base URL:

```text
/api/v1
```

---

## Authentication

### `/api/v1/users`

| Method | Endpoint           | Access                        |
| ------ | ------------------ | ----------------------------- |
| POST   | `/login`           | Public                        |
| POST   | `/refresh`         | Public — valid refresh cookie |
| POST   | `/logout`          | Authenticated                 |
| POST   | `/forget-password` | Public                        |
| POST   | `/verify-otp`      | Public                        |
| POST   | `/reset-password`  | Public — valid reset cookie   |

---

## Employees

### `/api/v1/employees`

| Method | Endpoint | Access             |
| ------ | -------- | ------------------ |
| GET    | `/`      | Admin, HR          |
| GET    | `/:id`   | Admin, HR, Manager |
| POST   | `/`      | Admin, HR          |
| PATCH  | `/:id`   | Admin, HR          |
| DELETE | `/:id`   | Admin, HR          |

---

## Departments

### `/api/v1/department`

| Method | Endpoint | Access |
| ------ | -------- | ------ |
| GET    | `/`      | Admin  |
| POST   | `/`      | Admin  |

---

## Tasks

### `/api/v1/tasks`

| Method | Endpoint        | Access            |
| ------ | --------------- | ----------------- |
| GET    | `/`             | Admin, Manager    |
| POST   | `/`             | Manager           |
| GET    | `/my`           | Employee          |
| PATCH  | `/:id/status`   | Employee          |
| PATCH  | `/:id/comments` | Employee, Manager |

---

## Attendance

### `/api/v1/attendance`

| Method | Endpoint         | Access        |
| ------ | ---------------- | ------------- |
| GET    | `/`              | Admin, HR     |
| GET    | `/employee`      | Security      |
| POST   | `/`              | Security      |
| PATCH  | `/:id`           | Security      |
| GET    | `/my-attendance` | Authenticated |

---

## Permissions / Leave

### `/api/v1/permissions`

| Method | Endpoint              | Access    |
| ------ | --------------------- | --------- |
| POST   | `/`                   | Employee  |
| GET    | `/`                   | HR, Admin |
| GET    | `/manager`            | Manager   |
| PATCH  | `/:id/manager-action` | Manager   |
| PATCH  | `/:id/hr-action`      | HR        |
| DELETE | `/:id`                | Employee  |
| GET    | `/my`                 | Employee  |

---

# Payroll

### `/api/v1/payroll`

| Method | Endpoint         | Access              |
| ------ | ---------------- | ------------------- |
| GET    | `/`              | HR, Admin           |
| POST   | `/`              | HR, Admin           |
| GET    | `/:id/download`  | HR, Admin, Employee |
| GET    | `/my`            | Authenticated       |
| GET    | `/:id`           | HR, Admin           |
| PATCH  | `/:id`           | HR, Admin           |
| PATCH  | `/:id/mark-paid` | HR, Admin           |

### Payroll Workflow

Payroll follows this workflow:

```text
Active Employees
       │
       ▼
Generate Payroll
       │
       ▼
     Draft
       │
       ▼
HR / Admin Review
       │
       ▼
   Mark as Paid
       │
       ▼
     Paid
       │
       ▼
Employee Notification
```

### Payroll Calculation

```text
Gross Salary
=
Base Salary
+ Transport Allowance
+ Housing Allowance
+ Medical Allowance
```

```text
Total Deductions
=
Absence Deduction
+ Late Deduction
```

```text
Net Salary
=
Gross Salary
- Total Deductions
```

### Updating Payroll

Unpaid payroll records can be updated using:

```http
PATCH /api/v1/payroll/:id
```

Only editable payroll fields are accepted. Calculated values such as `netSalary` and total deductions are recalculated by the backend.

### Marking Payroll as Paid

```http
PATCH /api/v1/payroll/:id/mark-paid
```

This operation:

1. Finds the unpaid payroll.
2. Changes the status to `paid`.
3. Sets `paidAt`.
4. Creates a notification for the employee.
5. Commits the database transaction.
6. Sends a real-time Socket.io notification.

MongoDB sessions/transactions are used to keep the payroll update and notification creation consistent.

---

# Payslip PDF

Employees and authorized HR/Admin users can download a payroll payslip:

```http
GET /api/v1/payroll/:id/download
```

The generated PDF contains:

- Employee information
- Department
- Payroll month/year
- Base salary
- Allowances
- Deductions
- Net salary
- Payment status
- Payment date

---

# Notifications

Notifications are stored in MongoDB and delivered in real time using Socket.io.

### `/api/v1/notifications`

| Method | Endpoint        | Access                   |
| ------ | --------------- | ------------------------ |
| GET    | `/`             | Employee, Manager, Admin |
| PATCH  | `/mark-as-read` | Employee, Manager, Admin |
| GET    | `/unread-count` | Employee, Manager, Admin |

### Real-Time Flow

```text
Business Action
      │
      ▼
Create Notification
      │
      ▼
Save to MongoDB
      │
      ▼
Socket.io Emit
      │
      ▼
User-Specific Room
      │
      ▼
Employee / User
```

Socket.io rooms are associated with the authenticated user's ID.

For example:

```js
req.app
  .get("io")
  .to(employee.user.toString())
  .emit("notification", notification);
```

---

# Authentication & Security

The API uses JWT-based authentication with access and refresh tokens.

### Access Token

- Short-lived
- Used to authenticate API requests
- Stored in an HTTP-only cookie

### Refresh Token

- Long-lived
- Used to generate new access tokens
- Stored securely
- Hashed before being stored in the database

### Password Security

Passwords are hashed using bcrypt before being stored.

### Request Validation

Incoming request data is validated using Zod schemas before reaching the controllers.

### Role-Based Authorization

Protected routes use authentication and role-based authorization middleware.

Example:

```js
protect;
restrictTo("HR", "Admin");
```

---

# MongoDB Transactions

MongoDB sessions and transactions are used for operations that require multiple database changes to succeed together.

For example, when marking payroll as paid:

```text
Start Transaction
       │
       ├── Update Payroll
       │
       ├── Create Notification
       │
       ▼
Commit Transaction
       │
       ▼
Socket.io Notification
```

If a database operation fails:

```text
Rollback Transaction
```

This prevents situations where the payroll is marked as paid but the notification is not created.

The Socket.io event is emitted **after the transaction is successfully committed**.

---

# Project Structure

```text
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── employeeController.js
│   ├── departmentController.js
│   ├── taskController.js
│   ├── attendanceController.js
│   ├── permissionController.js
│   ├── payrollController.js
│   └── notificationController.js
│
├── models/
│   ├── userModel.js
│   ├── employeeModel.js
│   ├── departmentModel.js
│   ├── taskModel.js
│   ├── attendanceModel.js
│   ├── permissionModel.js
│   ├── payrollModel.js
│   └── notificationModel.js
│
├── routes/
│   ├── userRoute.js
│   ├── employeeRoute.js
│   ├── departmentRoute.js
│   ├── taskRoute.js
│   ├── attendanceRoute.js
│   ├── permissionRoute.js
│   ├── payrollRoute.js
│   └── notificationRoute.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── validationMiddleware.js
│   └── errorMiddleware.js
│
├── validation/
│   ├── authValidation.js
│   ├── employeeValidation.js
│   ├── taskValidation.js
│   ├── attendanceValidation.js
│   ├── permissionValidation.js
│   └── payrollValidation.js
│
├── utils/
│   ├── catchAsync.js
│   ├── appError.js
│   └── ...
│
├── app.js
├── server.js
├── seed.js
├── config.env
├── package.json
└── README.md
```

---

# API Testing

The API can be tested using Postman or any REST API client.

Authentication example:

```http
Authorization: Bearer <access_token>
```

For cookie-based authentication, the required HTTP-only cookies are automatically sent by the client.

Recommended testing flow:

```text
Login
  │
  ▼
Authentication
  │
  ▼
Access Protected Routes
  │
  ├── Employees
  ├── Tasks
  ├── Attendance
  ├── Permissions
  ├── Payroll
  └── Notifications
```

---

# Important Notes

- All timestamps and dates are currently stored using server-local time.
- No timezone normalization is currently applied.
- Passwords are hashed with bcrypt before being saved.
- Access tokens are short-lived.
- Refresh tokens are hashed before being stored.
- Authentication uses HTTP-only cookies.
- Cookie `secure` flags are currently disabled for local development.
- Set cookie `secure: true` when deploying behind HTTPS.
- Payroll records should not be modified after being marked as `paid`.
- Payroll payment and notification creation use MongoDB transactions.

---

# Known Areas for Improvement

The following areas can be improved in future iterations:

- Add ownership validation for employee payslip downloads.
- Include HR and Security roles in notification access where required.
- Add automated tests using Jest/Supertest.
- Add API documentation using Swagger/OpenAPI.
- Add audit logs for sensitive HR operations.
- Add advanced payroll rules.
- Add automated monthly payroll generation.
- Add email notifications.
- Add reporting and analytics.
- Add Docker support.
- Add production deployment configuration.

---

# Future Improvements

- Employee performance management
- Advanced attendance reports
- Payroll reports
- Excel export
- Dashboard analytics
- Audit trail
- Email notifications
- Automated payroll processing
- Automated attendance calculations
- Dockerization
- CI/CD pipeline
- Swagger API documentation
- Unit and integration testing

---

# Author

**Youssef Mohamed**

Full-Stack Developer focused on:

- Node.js
- Express.js
- MongoDB
- Mongoose
- React.js
- REST APIs
- JWT Authentication
- Role-Based Access Control
- Real-Time Applications
- Backend Architecture

---

## License

This project is intended for educational and portfolio purposes.
