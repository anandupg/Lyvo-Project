'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import Navbar from '@/app/components/navbar/Navbar';
import Footer from '@/app/components/footer/Footer';

interface ValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  agreeToTerms?: string;
}

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  barColor: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPasswordValidation, setShowPasswordValidation] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: '',
    color: 'text-gray-400',
    barColor: 'bg-gray-200'
  });
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const validatePasswordRequirements = (password: string): PasswordValidation => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
  };

  const passwordValidation = validatePasswordRequirements(password);

  // Calculate password strength with visual feedback
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return {
        score: 0,
        label: '',
        color: 'text-gray-400',
        barColor: 'bg-gray-200'
      };
    }

    let score = 0;
    let feedback = '';

    // Length check
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 20;
    if (/[@$!%*?&]/.test(password)) score += 20;

    // Additional complexity
    if (password.length > 8 && /[a-z]/.test(password) && /[A-Z]/.test(password)) score += 10;
    if (password.length > 8 && /\d/.test(password) && /[@$!%*?&]/.test(password)) score += 10;

    // Cap at 100
    score = Math.min(score, 100);

    // Determine strength level and colors
    let label = '';
    let color = '';
    let barColor = '';

    if (score < 20) {
      label = 'weak';
      color = 'text-orange-500';
      barColor = 'bg-orange-500';
    } else if (score < 40) {
      label = 'weak';
      color = 'text-orange-500';
      barColor = 'bg-orange-500';
    } else if (score < 60) {
      label = 'medium';
      color = 'text-yellow-500';
      barColor = 'bg-gradient-to-r from-orange-500 to-yellow-500';
    } else if (score < 80) {
      label = 'good';
      color = 'text-yellow-500';
      barColor = 'bg-gradient-to-r from-orange-500 to-yellow-500';
    } else {
      label = 'strong';
      color = 'text-green-500';
      barColor = 'bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 to-green-500';
    }

    // Generate feedback
    if (score < 20) {
      feedback = 'This password is not acceptable. Add another word or two.';
    } else if (score < 40) {
      feedback = 'Weak password. Try adding numbers and special characters.';
    } else if (score < 60) {
      feedback = 'Fair password. Add more variety to make it stronger.';
    } else if (score < 80) {
      feedback = 'Good password. Almost there!';
    } else {
      feedback = 'Strong password! Uncommon words are better. Capitalization doesn&apos;t help very much.';
    }

    setPasswordFeedback(feedback);

    return {
      score,
      label,
      color,
      barColor
    };
  };

  // Minimize password validation card if all requirements are met
  const allPasswordValid = Object.values(passwordValidation).every(Boolean);

  // Calculate password strength when password changes
  useEffect(() => {
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  // Auto-minimize when all requirements are met
  useEffect(() => {
    if (allPasswordValid && showPasswordValidation) {
      const timer = setTimeout(() => {
        setShowPasswordValidation(false);
      }, 1000); // Auto-minimize after 1 second
      return () => clearTimeout(timer);
    }
  }, [allPasswordValid, showPasswordValidation]);

  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Full name is required';
    }
    if (name.trim().length < 2) {
      return 'Full name must be at least 2 characters long';
    }
    if (name.trim().length > 50) {
      return 'Full name must be less than 50 characters';
    }
    return undefined;
  };

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
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[@$!%*?&]/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return undefined;
  };

  const validateTerms = (agreed: boolean): string | undefined => {
    if (!agreed) {
      return 'You must agree to the terms and conditions';
    }
    return undefined;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    let error: string | undefined;
    
    switch (field) {
      case 'fullName':
        error = validateFullName(fullName);
        break;
      case 'email':
        error = validateEmail(email);
        break;
      case 'password':
        error = validatePassword(password);
        break;
      case 'agreeToTerms':
        error = validateTerms(agreeToTerms);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'fullName':
        setFullName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
    }
    
    // Clear error when user starts typing
    if (touched[field] && errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    newErrors.fullName = validateFullName(fullName);
    newErrors.email = validateEmail(email);
    newErrors.password = validatePassword(password);
    newErrors.agreeToTerms = validateTerms(agreeToTerms);
    
    setErrors(newErrors);
    setTouched({
      fullName: true, 
      email: true, 
      password: true, 
      agreeToTerms: true 
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setRegisteredEmail(email.trim());
      setShowSuccessMessage(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Simulate Google sign-in
    alert('Google sign-in functionality would be implemented here');
  };

  const handleNavigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center p-2 sm:p-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="w-full max-w-lg mx-auto">
          {/* Success Message Card */}
          {showSuccessMessage && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Account Created Successfully!
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Your account has been created for <strong>{registeredEmail}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  You can now sign in to your account.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowSuccessMessage(false)}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium py-3 px-4 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Create Another Account
                  </button>
                  <button
                    onClick={handleNavigateToLogin}
                    className="w-full bg-gray-100 text-gray-700 rounded-lg font-medium py-3 px-4 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                  >
                    Sign In Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Register Form Card */}
          {!showSuccessMessage && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
                <p className="text-sm sm:text-base text-gray-600">Join us and start your journey today</p>
              </div>

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center mb-6"
              >
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
                Continue with Google
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
                {/* Full Name Field */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    onFocus={() => setFocusedField('fullName')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                      focusedField === 'fullName' 
                        ? 'border-red-500 shadow-sm' 
                        : touched.fullName && errors.fullName 
                          ? 'border-red-500' 
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
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
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your email address"
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
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onBlur={() => handleBlur('password')}
                      onFocus={() => setFocusedField('password')}
                      className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 ${
                        focusedField === 'password' 
                          ? 'border-red-500 shadow-sm' 
                          : touched.password && errors.password 
                            ? 'border-red-500' 
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowPassword(!showPassword);
                        console.log('Password visibility toggled:', !showPassword);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center w-10 h-full text-gray-400 hover:text-gray-600 focus:text-gray-600 focus:outline-none transition-colors duration-200"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Bar */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className={`text-sm font-medium ${passwordStrength.color}`}>
                            {passwordStrength.label}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.barColor}`}
                          style={{ width: `${passwordStrength.score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {touched.password && errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Password Validation Indicator */}
                {password && (
                  <div>
                    {/* Mobile minimized state */}
                    <div className="block sm:hidden">
                      {allPasswordValid && !showPasswordValidation ? (
                        <div
                          className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 cursor-pointer transition-all duration-300"
                          onClick={() => setShowPasswordValidation(true)}
                          title="Show password requirements"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-700 text-sm font-medium">Strong password!</span>
                          <span className="ml-auto text-xs text-green-500">Tap to show</span>
                        </div>
                      ) : (
                        <div
                          className={`bg-gray-50 rounded-lg p-3 border border-gray-200 transition-all duration-300 ${allPasswordValid ? 'cursor-pointer' : ''}`}
                          onClick={() => allPasswordValid && setShowPasswordValidation(false)}
                          title={allPasswordValid ? 'Tap to minimize' : ''}
                        >
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Password Requirements:</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              {passwordValidation.length ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${passwordValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                                Must be at least 8 characters!
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {passwordValidation.uppercase ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                                Must contain at least 1 uppercase letter!
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {passwordValidation.lowercase ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                                Must contain at least 1 lowercase letter!
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {passwordValidation.number ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${passwordValidation.number ? 'text-green-600' : 'text-red-600'}`}>
                                Must contain at least 1 number!
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {passwordValidation.special ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${passwordValidation.special ? 'text-green-600' : 'text-red-600'}`}>
                                Must contain at least 1 special character!
                              </span>
                            </div>
                          </div>
                          {allPasswordValid && (
                            <div className="mt-3 text-xs text-green-600 text-right">Tap to minimize</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Desktop expanded state */}
                    <div className="hidden sm:block">
                      {allPasswordValid && !showPasswordValidation ? (
                        <div
                          className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 cursor-pointer transition-all duration-300"
                          onClick={() => setShowPasswordValidation(true)}
                          title="Show password requirements"
                        >
                          <Check className="h-5 w-5 text-green-600" />
                          <span className="text-green-700 font-medium">Strong password!</span>
                          <span className="ml-auto text-xs text-green-500">Show details</span>
                        </div>
                      ) : (
                        <div
                          className={`bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 ${allPasswordValid ? 'cursor-pointer hover:shadow-md' : ''}`}
                          onClick={() => allPasswordValid && setShowPasswordValidation(false)}
                          title={allPasswordValid ? 'Click to minimize' : ''}
                        >
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Password Requirements:</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              {passwordValidation.length ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${passwordValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                                Must be at least 8 characters!
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {passwordValidation.uppercase ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                                Must contain at least 1 uppercase letter!
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {passwordValidation.lowercase ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                                Must contain at least 1 lowercase letter!
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {passwordValidation.number ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${passwordValidation.number ? 'text-green-600' : 'text-red-600'}`}>
                                Must contain at least 1 number!
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {passwordValidation.special ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${passwordValidation.special ? 'text-green-600' : 'text-red-600'}`}>
                                Must contain at least 1 special character!
                              </span>
                            </div>
                          </div>
                          {allPasswordValid && (
                            <div className="mt-3 text-xs text-green-600 text-right">Click to minimize</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => {
                        setAgreeToTerms(e.target.checked);
                        if (touched.agreeToTerms) {
                          const termsError = validateTerms(e.target.checked);
                          setErrors(prev => ({ ...prev, agreeToTerms: termsError }));
                        }
                      }}
                      onBlur={() => handleBlur('agreeToTerms')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeToTerms" className="text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-red-600 hover:text-red-500 hover:underline font-medium transition-all duration-200">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-red-600 hover:text-red-500 hover:underline font-medium transition-all duration-200">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
                {touched.agreeToTerms && errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                )}

                {/* Create Account Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-700">
                  Already have an account?{' '}
                  <button 
                    onClick={handleNavigateToLogin}
                    className="font-medium text-red-600 hover:text-red-500 hover:underline transition-all duration-200"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
