# Backend Setup Guide

This guide will help you set up the backend authentication system using Clerk and MongoDB for the Lyvo+ application.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database (local or cloud)
- Clerk account and application
- Git

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Configure Clerk authentication
5. Set up MongoDB connection
6. Run the development server: `npm run dev`

## Environment Configuration

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lyvo-plus

# JWT Secret (if needed for additional tokens)
JWT_SECRET=your_jwt_secret_key_here

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 2. Clerk Setup

1. Create a new Clerk application at [clerk.com](https://clerk.com)
2. Get your publishable key and secret key from the Clerk dashboard
3. Configure your application settings:
   - Set up email templates
   - Configure social login providers (optional)
   - Set up webhooks for user events (optional)

## 3. MongoDB Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create a database named `lyvo-plus`

### Cloud MongoDB (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment variables

## Database Schema

### User Collection
```javascript
{
  clerkId: String (unique),
  email: String (unique),
  fullName: String,
  businessName: String,
  userType: String (enum: ['user', 'owner']),
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  profileCompleted: Boolean,
  isActive: Boolean
}
```

## Authentication Flow

### 1. User Registration
- User fills out registration form
- Clerk handles user creation and email verification
- Backend creates user record in MongoDB with `clerkId`
- User receives confirmation email

### 2. User Login
- User enters credentials
- Clerk handles authentication
- Backend verifies user exists in MongoDB
- User is redirected to dashboard

### 3. Session Management
- Clerk handles session management automatically
- Middleware protects routes
- User state available via `useUser()` hook

### 4. User Logout
- Clerk handles logout process
- Session is cleared automatically
- User is redirected to home page

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user

### Protected Routes
- All dashboard routes are protected by Clerk middleware
- User must be authenticated to access protected content

## Security Features

- **Email Verification**: Automatic email confirmation
- **Password Security**: Clerk handles password hashing and validation
- **Session Management**: Secure session handling
- **Rate Limiting**: Built-in protection against abuse
- **CSRF Protection**: Automatic CSRF protection

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

1. **Clerk Configuration Error:**
   - Verify your Clerk environment variables
   - Check Clerk dashboard settings
   - Ensure application is properly configured

2. **MongoDB Connection Error:**
   - Verify MongoDB is running
   - Check connection string
   - Ensure network access is configured

3. **Authentication Issues:**
   - Check Clerk webhook configuration
   - Verify email templates are set up
   - Check browser console for errors

4. **Environment Variables:**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Restart development server after changes

## Production Deployment

1. Set up production environment variables
2. Configure Clerk for production
3. Set up MongoDB production cluster
4. Deploy to your hosting platform
5. Configure domain and SSL certificates

## Additional Resources

1. [Clerk Documentation](https://clerk.com/docs)
2. [MongoDB Documentation](https://docs.mongodb.com)
3. [Next.js Documentation](https://nextjs.org/docs)
4. Review Clerk and MongoDB documentation 