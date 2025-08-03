'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/navbar/Navbar';
import { signInWithEmailAndPasswordFirebase, signInWithGoogle } from '@/lib/firebase';
import EmailVerificationModal from '@/app/components/EmailVerificationModal';
import { useJWT } from '@/hooks/useJWT';

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<ValidationErrors>({});
  const [focusedField, setFocusedField] = useState<string>('');
  
  // Email verification modal state
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState<any>(null);

  // JWT authentication hook
  const { login: jwtLogin, isAuthenticated } = useJWT();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    return undefined;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFocusedField('');
  };

  const handleInputChange = (field: string, value: string) => {
    // Update the field value
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Mark as touched
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    newErrors.email = validateEmail(email);
    newErrors.password = validatePassword(password);
    
    setErrors(newErrors);
    setTouched({
      email: true, 
      password: true
    });
    
    // Check if there are any actual error values (not undefined)
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First try JWT login
      const jwtResult = await jwtLogin(email.trim(), password);
      
      if (jwtResult.success) {
        // JWT login successful, redirect to dashboard
        router.push(redirectTo);
        return;
      }
      
      // If JWT login fails, try Firebase login
      const { user, error } = await signInWithEmailAndPasswordFirebase(email.trim(), password);
      
      if (error) {
        console.error('Sign in error:', error);
        
        // Check if it's an email verification error
        if (error.includes('verify your email')) {
          // Show email verification modal instead of alert
          setUnverifiedUser({ email: email.trim() });
          setShowEmailVerificationModal(true);
        } else {
          alert(`Sign in failed: ${error}`);
        }
        return;
      }
      
      if (user) {
        // Firebase login successful, redirect to dashboard
        router.push(redirectTo);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      alert('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const { user, error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google sign-in error:', error);
        
        // Provide more helpful error messages
        if (error.includes('popup')) {
          alert('Google sign-in popup was blocked. Please allow popups for this site and try again, or use email/password sign-in.');
        } else if (error.includes('sessionStorage')) {
          alert('Google sign-in encountered a browser compatibility issue. Please try using email/password sign-in instead.');
        } else {
          alert(`Google sign-in failed: ${error}. Please try again or use email/password sign-in.`);
        }
        return;
      }
      
      // For mobile devices, user will be null because they're being redirected
      // For desktop devices, user will be available immediately
      if (user) {
        // Redirect to dashboard after successful Google sign-in (desktop)
        router.push(redirectTo);
      } else {
        // For mobile devices, the user is being redirected
        // The AuthContext will handle the redirect result when they return
        console.log('Google sign-in initiated. You will be redirected to Google...');
        // Show a brief message to the user
        alert('Redirecting to Google for sign-in. You will be returned to Lyvo+ after signing in.');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed. Please try again or use email/password sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center p-2 sm:p-4 pt-20 lg:pt-24" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-sm sm:text-base text-gray-600">Sign in to your account</p>
              
              {/* Email Verification Notice */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-blue-800">
                    New users: Check your email for verification link after registration
                  </span>
                </div>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mb-6"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                  <span>Signing in with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  onFocus={() => setFocusedField('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                    focusedField === 'email' 
                      ? 'border-red-500 shadow-sm' 
                      : touched.email && errors.email 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  onFocus={() => setFocusedField('password')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                    focusedField === 'password' 
                      ? 'border-red-500 shadow-sm' 
                      : touched.password && errors.password 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {touched.password && errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold py-3 px-4 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={handleNavigateToRegister}
                  className="text-red-600 hover:text-red-500 font-medium underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showEmailVerificationModal}
        onClose={() => setShowEmailVerificationModal(false)}
        user={unverifiedUser}
        email={unverifiedUser?.email || ''}
      />
    </div>
  );
}
