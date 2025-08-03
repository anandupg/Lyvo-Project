# JWT Authentication Implementation in Lyvo+

This document explains the JWT (JSON Web Token) authentication system implemented in the Lyvo+ project.

## 🔐 Overview

The JWT implementation works alongside Firebase Authentication to provide:
- **Enhanced security** with server-side token validation
- **Automatic token refresh** before expiration
- **HTTP-only cookies** for secure token storage
- **Route protection** with middleware
- **API route authentication** for backend endpoints

## 📁 File Structure

```
src/
├── lib/
│   ├── jwt.ts                    # JWT utility functions
│   └── firebase.ts               # Firebase auth (existing)
├── hooks/
│   └── useJWT.ts                 # JWT authentication hook
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── jwt/
│   │   │       └── route.ts      # JWT auth endpoints
│   │   └── protected/
│   │       └── example/
│   │           └── route.ts      # Example protected API
│   └── auth/
│       └── login/
│           └── page.tsx          # Updated login page
├── components/
│   └── navbar/
│       └── Navbar.tsx            # Updated navbar
└── middleware.ts                 # Route protection middleware
```

## 🚀 Key Features

### 1. **Dual Authentication System**
- **Firebase Authentication** for user management
- **JWT tokens** for API access and session management
- **Seamless integration** between both systems

### 2. **Token Management**
- **Access tokens**: 15-minute expiration
- **Refresh tokens**: 7-day expiration
- **Automatic refresh**: 1 minute before expiration
- **HTTP-only cookies**: Secure token storage

### 3. **Route Protection**
- **Middleware-based protection** for client routes
- **API route authentication** for backend endpoints
- **Automatic redirects** for unauthenticated users

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### JWT Secret

**IMPORTANT**: Change the JWT secret in production:
1. Generate a strong secret: `openssl rand -base64 32`
2. Set it in your environment variables
3. Never commit the secret to version control

## 📖 Usage

### 1. **Client-Side Authentication**

```typescript
import { useJWT } from '@/hooks/useJWT';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useJWT();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // Redirect to dashboard
    } else {
      // Handle error
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.displayName}!</p>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}
    </div>
  );
}
```

### 2. **Protected API Routes**

```typescript
// app/api/protected/my-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = verifyToken(accessToken);
  if (!decoded) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Your protected logic here
  return NextResponse.json({ data: 'Protected data' });
}
```

### 3. **Route Protection**

The middleware automatically protects routes defined in `middleware.ts`:

```typescript
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings'
];
```

## 🔄 Authentication Flow

### 1. **Login Process**
1. User submits login form
2. JWT login attempted first
3. If JWT fails, Firebase login attempted
4. JWT tokens generated and stored in cookies
5. User redirected to dashboard

### 2. **Token Refresh**
1. Access token expires after 15 minutes
2. Refresh token used to get new access token
3. New access token stored in cookies
4. User session continues seamlessly

### 3. **Logout Process**
1. Firebase sign out called
2. JWT logout called
3. Cookies cleared
4. User redirected to login page

## 🛡️ Security Features

### 1. **Token Security**
- **HTTP-only cookies**: Prevents XSS attacks
- **Secure cookies**: In production environments
- **SameSite strict**: Prevents CSRF attacks
- **Short expiration**: Access tokens expire quickly

### 2. **Route Protection**
- **Middleware-based**: Protects all routes automatically
- **API authentication**: Server-side token verification
- **Automatic redirects**: Unauthenticated users redirected

### 3. **Error Handling**
- **Graceful degradation**: Falls back to Firebase if JWT fails
- **Comprehensive logging**: All errors logged for debugging
- **User-friendly messages**: Clear error messages for users

## 🔧 API Endpoints

### JWT Authentication (`/api/auth/jwt`)

#### POST - Login
```bash
POST /api/auth/jwt
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "action": "login"
}
```

#### POST - Refresh Token
```bash
POST /api/auth/jwt
Content-Type: application/json

{
  "action": "refresh"
}
```

#### POST - Logout
```bash
POST /api/auth/jwt
Content-Type: application/json

{
  "action": "logout"
}
```

#### GET - Verify Token
```bash
GET /api/auth/jwt
```

## 🧪 Testing

### 1. **Test Protected Routes**
```bash
# Test without authentication
curl http://localhost:3000/api/protected/example

# Should return 401 Unauthorized
```

### 2. **Test Authentication**
```bash
# Login
curl -X POST http://localhost:3000/api/auth/jwt \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","action":"login"}'

# Should return user data and set cookies
```

## 🚀 Production Deployment

### 1. **Environment Variables**
```bash
# Production environment
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. **Security Headers**
The middleware automatically adds security headers:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

### 3. **Cookie Settings**
In production, cookies are set with:
- `secure: true` - HTTPS only
- `sameSite: 'strict'` - CSRF protection
- `httpOnly: true` - XSS protection

## 🔍 Troubleshooting

### Common Issues

1. **"JWT verification failed"**
   - Check JWT_SECRET environment variable
   - Ensure token is not expired
   - Verify token format

2. **"No access token provided"**
   - User not logged in
   - Cookies not set properly
   - Check browser cookie settings

3. **"Invalid refresh token"**
   - Refresh token expired
   - User needs to login again
   - Check token storage

### Debug Mode

Enable debug logging by adding to your environment:
```bash
DEBUG_JWT=true
```

## 📚 Additional Resources

- [JWT.io](https://jwt.io/) - JWT token debugger
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [HTTP-only Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Firebase Auth](https://firebase.google.com/docs/auth)

## 🤝 Contributing

When adding new protected routes:
1. Add route to `protectedRoutes` array in middleware
2. Use `verifyToken` in API routes
3. Test authentication flow
4. Update documentation

---

This JWT implementation provides a robust, secure authentication system that works seamlessly with your existing Firebase setup while adding server-side security and API protection. 