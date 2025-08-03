import jwt from 'jsonwebtoken';
import { User } from 'firebase/auth';

// JWT Secret - In production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// Interface for JWT payload
interface JWTPayload {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  role?: string;
  iat?: number;
  exp?: number;
}

// Interface for token response
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Generate JWT tokens for a user
 */
export const generateTokens = (user: User, role: string = 'user'): TokenResponse => {
  const payload: JWTPayload = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || undefined,
    emailVerified: user.emailVerified,
    role
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 // 15 minutes in seconds
  };
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = (refreshToken: string): string | null => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as JWTPayload;
    
    // Generate new access token
    const newPayload: JWTPayload = {
      uid: decoded.uid,
      email: decoded.email,
      displayName: decoded.displayName,
      emailVerified: decoded.emailVerified,
      role: decoded.role
    };

    return jwt.sign(newPayload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

/**
 * Decode JWT token without verification (for client-side)
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    console.error('Token decode failed:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
}; 