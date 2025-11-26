# TayseerulQuran Backend API

Backend API for TayseerulQuran Learning Management System built with Node.js, Express.js, and MySQL.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control (RBAC)** - Fine-grained permission system
- **MySQL Database** - Using Sequelize ORM
- **MVC Architecture** - Clean, organized code structure
- **Input Validation** - Joi validation for all inputs
- **Error Handling** - Comprehensive error handling middleware
- **API Documentation** - Well-structured RESTful API

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## 🔧 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update database credentials and JWT secrets

3. **Create MySQL database:**
   ```sql
   CREATE DATABASE tayseerulquran_db;
   ```

4. **Run the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/           # Configuration files (database, JWT, env)
├── controllers/      # Request handlers
├── middleware/       # Custom middleware (auth, RBAC, error handling)
├── models/          # Sequelize models
├── routes/          # API routes
├── services/        # Business logic services
├── utils/           # Utility functions
├── validators/      # Joi validation schemas
├── migrations/      # Database migrations (optional)
├── server.js        # Application entry point
└── package.json     # Dependencies and scripts
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 👥 User Roles

- **Super Admin** - Full system access
- **Admin** - Permissions assigned by Super Admin
- **Tutor** - Manage assigned students and courses
- **Staff** - Read-only access to students, courses, reports
- **Student** - View enrolled courses, profile, payment history

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/profile` - Get own profile
- `PUT /api/users/profile` - Update own profile

### Courses
- `GET /api/courses` - Get all courses (Public)
- `GET /api/courses/:id` - Get course by ID (Public)
- `POST /api/courses` - Create course (Admin/Tutor)
- `PUT /api/courses/:id` - Update course (Admin/Tutor)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `POST /api/courses/:courseId/enroll` - Enroll student (Admin)

### Students
- `GET /api/students` - Get all students (Admin/Staff)
- `GET /api/students/:id` - Get student by ID (Admin/Staff)
- `GET /api/students/:id/courses` - Get student courses (Admin/Staff)
- `POST /api/students/assign` - Assign student to tutor (Admin)

### Tutors
- `GET /api/tutors` - Get all tutors (Admin)
- `GET /api/tutors/:id` - Get tutor by ID (Admin)
- `GET /api/tutors/:id/students` - Get tutor's students (Admin)
- `POST /api/tutors/:id/approve` - Approve tutor (Super Admin)

### Blog Posts
- `GET /api/blog` - Get all blog posts (Public)
- `GET /api/blog/:id` - Get blog post by ID/slug (Public)
- `POST /api/blog` - Create blog post (Admin)
- `PUT /api/blog/:id` - Update blog post (Admin)
- `DELETE /api/blog/:id` - Delete blog post (Admin)

### Payments
- `GET /api/payments` - Get all payments (Admin)
- `GET /api/payments/:id` - Get payment by ID (Admin)
- `POST /api/payments` - Create payment (Admin)
- `PUT /api/payments/:id` - Update payment (Admin)
- `GET /api/payments/user/:userId` - Get user payments (Student/Admin)
- `GET /api/payments/me/payments` - Get own payments (Student)

### Admin (Super Admin Only)
- `GET /api/admin/roles` - Get all roles
- `POST /api/admin/roles` - Create role
- `PUT /api/admin/roles/:id` - Update role
- `POST /api/admin/roles/:id/permissions` - Assign permissions to role
- `GET /api/admin/permissions` - Get all permissions
- `POST /api/admin/permissions` - Create permission

### Health Check
- `GET /api/health` - API health check

## 🔒 Permissions

The system uses a permission-based access control system. Each role can have multiple permissions assigned. Super Admin has all permissions by default.

## 🗄️ Database Models

- **User** - User accounts
- **Role** - User roles
- **Permission** - System permissions
- **RolePermission** - Role-Permission mapping
- **UserRole** - User-Role mapping
- **Course** - Course information
- **Student** - Student profiles
- **Tutor** - Tutor profiles
- **BlogPost** - Blog articles
- **Payment** - Payment transactions
- **StudentCourse** - Student-Course enrollment

## 🛠️ Development

### Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=tayseerulquran_db
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRE=30d

CORS_ORIGIN=http://localhost:3000
```

## 📝 Notes

- All passwords are hashed using bcrypt
- JWT tokens expire after 7 days (configurable)
- Database models use Sequelize ORM
- All inputs are validated using Joi
- Error handling is centralized in middleware

## 🐛 Troubleshooting

1. **Database connection error**: Check MySQL is running and credentials are correct
2. **JWT errors**: Ensure JWT_SECRET is set in .env
3. **Port already in use**: Change PORT in .env file

## 📄 License

ISC

