# Backend Setup Guide

This guide will help you set up the backend authentication system using your custom implementation for the Lyvo+ application.

## Prerequisites

- Node.js (v18 or higher)
- Database of your choice (PostgreSQL, MySQL, MongoDB, etc.)
- Email service (Gmail, SendGrid, etc.)
- Git

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Configure your custom authentication backend
5. Set up database connection
6. Run the development server: `npm run dev`

## Environment Configuration

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Custom Authentication
JWT_SECRET=your_jwt_secret_key_here

# Database Configuration (Choose your database)
DATABASE_URL=your_database_connection_string
# or for MongoDB: MONGODB_URI=mongodb://localhost:27017/lyvo-plus

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 2. Custom Authentication Setup

### JWT Configuration
1. Generate a secure JWT secret
2. Configure JWT token expiration
3. Set up refresh token mechanism

### Database Schema

### User Collection
```sql
-- Example for PostgreSQL
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  business_name VARCHAR(255),
  user_type VARCHAR(50) DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  profile_completed BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE
);
```

## Authentication Flow

### 1. User Registration
- User fills out registration form
- Backend validates input and creates user record
- Send email verification
- User receives confirmation email

### 2. User Login
- User enters credentials
- Backend verifies password and generates JWT
- User is redirected to dashboard with token

### 3. Session Management
- JWT tokens for session management
- Custom middleware protects routes
- User state available via custom hooks

### 4. User Logout
- Clear JWT tokens
- Update last login timestamp
- Redirect to home page

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/reset-password` - Reset password

### Protected Routes
- All dashboard routes are protected by custom middleware
- User must be authenticated to access protected content

## Security Features

- **Email Verification**: Custom email confirmation system
- **Password Security**: Bcrypt password hashing
- **JWT Tokens**: Secure session management
- **Rate Limiting**: Custom protection against abuse
- **CSRF Protection**: Custom CSRF protection

## Development

### Running the Application
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

## Troubleshooting

### Common Issues

1. **JWT Configuration Error:**
   - Verify your JWT secret is set
   - Check token expiration settings
   - Ensure proper token validation

2. **Database Connection Error:**
   - Verify database is running
   - Check connection string
   - Ensure network access is configured

3. **Authentication Issues:**
   - Check email service configuration
   - Verify email templates are set up
   - Check browser console for errors

4. **Environment Variables:**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Restart development server after changes

## Production Deployment

1. Set up production environment variables
2. Configure production database
3. Set up email service for production
4. Deploy to your hosting platform
5. Configure domain and SSL certificates

## Additional Resources

1. [Next.js Documentation](https://nextjs.org/docs)
2. [JWT.io](https://jwt.io/) - JWT debugging
3. [Bcrypt](https://github.com/dcodeIO/bcrypt.js) - Password hashing
4. Review your chosen database documentation 