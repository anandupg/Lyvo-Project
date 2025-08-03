import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Get the access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const decoded = verifyToken(accessToken);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Token is valid, return protected data
    return NextResponse.json({
      message: 'This is protected data',
      user: {
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.displayName,
        role: decoded.role
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const decoded = verifyToken(accessToken);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    // Process the request with authenticated user
    return NextResponse.json({
      message: 'Data processed successfully',
      user: {
        uid: decoded.uid,
        email: decoded.email,
        displayName: decoded.displayName,
        role: decoded.role
      },
      receivedData: body,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 