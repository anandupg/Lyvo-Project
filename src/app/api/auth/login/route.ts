import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/clerk';
import dbConnect from '@/lib/mongodb';
import User, { IUserModel } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Check if user exists in Clerk
    const clerkUser = await getUserByEmail(email);
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user exists in MongoDB
    const mongoUser = await (User as IUserModel).findByEmail(email);
    if (!mongoUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Check if email is verified (Clerk handles this automatically)
    if (!clerkUser.emailAddresses[0]?.verification?.status === 'verified') {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 401 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        fullName: mongoUser.fullName,
        businessName: mongoUser.businessName,
        userType: mongoUser.userType,
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 