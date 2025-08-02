import { UserProfile } from './clerk';

export interface AuthSession {
  user: UserProfile | null;
  session: any | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName?: string;
  businessName?: string;
  userType: 'user' | 'owner';
}

// Register user
export async function registerUser(credentials: RegisterCredentials) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Registration failed');
  }
}

// Login user
export async function loginUser(credentials: LoginCredentials) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Login failed');
  }
}

// Logout user - Clerk handles this automatically through the SignOut component
export async function logoutUser() {
  try {
    // Clerk handles logout through the SignOut component
    // This function is kept for compatibility but doesn't need to do anything
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// Get current user session - Clerk handles this automatically
export async function getCurrentSession() {
  try {
    // Clerk handles sessions automatically through the auth() function
    // This function is kept for compatibility but returns null
    return null;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

// Get current user - Clerk handles this automatically
export async function getCurrentUser() {
  try {
    // Clerk handles user state automatically through the useUser() hook
    // This function is kept for compatibility but returns null
    return null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// Listen to auth state changes - Clerk handles this automatically
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  // Clerk handles auth state changes automatically through the useUser() hook
  // This function is kept for compatibility but returns a no-op
  return { data: { subscription: { unsubscribe: () => {} } } };
}

// Refresh session - Clerk handles this automatically
export async function refreshSession() {
  try {
    // Clerk handles session refresh automatically
    // This function is kept for compatibility but returns null
    return null;
  } catch (error) {
    console.error('Refresh session error:', error);
    throw error;
  }
} 