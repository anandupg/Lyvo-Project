import { NextRequest, NextResponse } from 'next/server';
import { generateTokens, verifyToken, refreshAccessToken } from '@/lib/jwt';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json();

    if (action === 'login') {
      // Authenticate with Firebase first
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        return NextResponse.json(
          { error: 'Please verify your email address before signing in.' },
          { status: 401 }
        );
      }

      // Generate JWT tokens
      const tokens = generateTokens(user);

      // Set HTTP-only cookies
      const response = NextResponse.json({
        message: 'Login successful',
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        }
      });

      // Set secure cookies (in production, set secure: true)
      response.cookies.set('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: tokens.expiresIn
      });

      response.cookies.set('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    }

    if (action === 'refresh') {
      const refreshToken = request.cookies.get('refreshToken')?.value;

      if (!refreshToken) {
        return NextResponse.json(
          { error: 'No refresh token provided' },
          { status: 401 }
        );
      }

      const newAccessToken = refreshAccessToken(refreshToken);

      if (!newAccessToken) {
        return NextResponse.json(
          { error: 'Invalid refresh token' },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        message: 'Token refreshed successfully'
      });

      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 // 15 minutes
      });

      return response;
    }

    if (action === 'logout') {
      const response = NextResponse.json({
        message: 'Logout successful'
      });

      // Clear cookies
      response.cookies.set('accessToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0
      });

      response.cookies.set('refreshToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('JWT auth error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(accessToken);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid access token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.displayName,
        emailVerified: decoded.emailVerified,
        role: decoded.role
      }
    });

  } catch (error: any) {
    console.error('JWT verification error:', error);
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 401 }
    );
  }
} 