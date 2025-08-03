import { supabase } from '@/lib/supabase';
import { AuthError, LoginCredentials, RegisterCredentials, User } from '@/types/auth';

export const authHelpers = {
  // Sign up with email and password
  async signUp(credentials: RegisterCredentials): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.full_name,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          full_name: credentials.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
          email_confirmed_at: data.user.email_confirmed_at,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        };

        // Sync user data to MongoDB
        try {
          await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userData: user }),
          });
        } catch (mongoError) {
          console.error('Failed to sync user to MongoDB:', mongoError);
          // Don't fail the signup if MongoDB sync fails
        }

        return { user, error: null };
      }

      return { user: null, error: null };
    } catch (error: any) {
      return {
        user: null,
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    }
  },

  // Sign in with email and password
  async signIn(credentials: LoginCredentials): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      if (data.user) {
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          return {
            user: null,
            error: {
              message: 'Please check your email and click the confirmation link before signing in.',
              status: 401,
            },
          };
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          full_name: data.user.user_metadata?.full_name,
          avatar_url: data.user.user_metadata?.avatar_url,
          email_confirmed_at: data.user.email_confirmed_at,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        };

        // Sync user data to MongoDB
        try {
          await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userData: user }),
          });
        } catch (mongoError) {
          console.error('Failed to sync user to MongoDB:', mongoError);
          // Don't fail the signin if MongoDB sync fails
        }

        return { user, error: null };
      }

      return { user: null, error: null };
    } catch (error: any) {
      return {
        user: null,
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    }
  },

  // Sign in with Google OAuth
  async signInWithGoogle(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    }
  },

  // Sign out
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      if (user) {
        const userData: User = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name,
          avatar_url: user.user_metadata?.avatar_url,
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at,
          updated_at: user.updated_at || user.created_at,
        };

        return { user: userData, error: null };
      }

      return { user: null, error: null };
    } catch (error: any) {
      return {
        user: null,
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
      });

      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    }
  },

  // Update password
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    }
  },

  // Resend confirmation email
  async resendConfirmationEmail(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status,
          },
        };
      }

      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    }
  },
};

// Error message helpers
export const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.';
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link before signing in.';
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}; 