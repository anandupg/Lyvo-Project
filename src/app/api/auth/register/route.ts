import { NextRequest, NextResponse } from 'next/server';
import { createUserInClerk, getUserByEmail } from '@/lib/clerk';
import dbConnect from '@/lib/mongodb';
import User, { IUserModel } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, businessName, userType } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (userType === 'owner' && !businessName) {
      return NextResponse.json(
        { error: 'Business name is required for owner registration' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await dbConnect();

    // Check if user already exists in MongoDB
    const existingUser = await (User as IUserModel).findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if user already exists in Clerk
    const existingClerkUser = await getUserByEmail(email);
    if (existingClerkUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Parse full name into first and last name
    const nameParts = fullName ? fullName.split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Create user in Clerk
    const clerkUser = await createUserInClerk({
      email,
      password,
      firstName,
      lastName,
      publicMetadata: {
        full_name: fullName,
        business_name: businessName,
        user_type: userType || 'user'
      }
    });

    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Failed to create user in Clerk' },
        { status: 500 }
      );
    }

    // Create user in MongoDB
    const newUser = new User({
      clerkId: clerkUser.id,
      email,
      fullName,
      businessName,
      userType: userType || 'user',
      emailVerified: true, // Clerk handles email verification
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newUser.save();

    return NextResponse.json({
      message: 'Account Created Successfully!',
      user: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        fullName,
        businessName,
        userType: userType || 'user',
        emailVerified: true
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 