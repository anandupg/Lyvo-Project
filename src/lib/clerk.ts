import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';

// Types for user data
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  business_name?: string;
  user_type: 'user' | 'owner';
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    business_name?: string;
    user_type?: 'user' | 'owner';
  };
}

// Get current user from Clerk
export async function getCurrentUser() {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    
    const user = await clerkClient.users.getUser(userId);
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const users = await clerkClient.users.getUserList({
      emailAddress: [email],
    });
    return users[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Create user in Clerk
export async function createUserInClerk(userData: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  publicMetadata?: Record<string, any>;
}) {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [userData.email],
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      publicMetadata: userData.publicMetadata,
    });
    return user;
  } catch (error) {
    console.error('Error creating user in Clerk:', error);
    throw error;
  }
}

// Update user metadata
export async function updateUserMetadata(userId: string, metadata: Record<string, any>) {
  try {
    const user = await clerkClient.users.updateUser(userId, {
      publicMetadata: metadata,
    });
    return user;
  } catch (error) {
    console.error('Error updating user metadata:', error);
    throw error;
  }
} 