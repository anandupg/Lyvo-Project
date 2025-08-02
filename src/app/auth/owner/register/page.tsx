'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Check, X, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import { useAuth } from '@/hooks/useAuth';

interface ValidationErrors {
  fullName?: string;
  businessName?: string;
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

export default function OwnerRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPasswordValidation, setShowPasswordValidation] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

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

  // Calculate password strength and feedback
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }

    let strength = 0;
    let feedback = '';

    // Length check
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[@$!%*?&]/.test(password)) strength += 20;

    // Additional complexity
    if (password.length > 8 && /[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 10;
    if (password.length > 8 && /\d/.test(password) && /[@$!%*?&]/.test(password)) strength += 10;

    // Cap at 100
    strength = Math.min(strength, 100);

    // Generate feedback
    if (strength < 20) {
      feedback = 'This password is not acceptable. Add another word or two.';
    } else if (strength < 40) {
      feedback = 'Weak password. Try adding numbers and special characters.';
    } else if (strength < 60) {
      feedback = 'Fair password. Add more variety to make it stronger.';
    } else if (strength < 80) {
      feedback = 'Good password. Almost there!';
    } else {
      feedback = 'Strong password! Uncommon words are better. Capitalization doesn&apos;t help very much.';
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  };

  // Minimize password validation card if all requirements are met
  const allPasswordValid = Object.values(passwordValidation).every(Boolean);

  // Calculate password strength when password changes
  useEffect(() => {
    calculatePasswordStrength(password);
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
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return 'Full name can only contain letters and spaces';
    }
    return undefined;
  };

  const validateBusinessName = (name: string): string | undefined => {
    if (!name.trim()) {
      return 'Business name is required';
    }
    if (name.trim().length < 2) {
      return 'Business name must be at least 2 characters long';
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required';
    }
    
    // Remove leading/trailing spaces
    const cleanEmail = email.trim();
    
    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return 'Please enter a valid email address';
    }
    
    // Check for common email issues
    if (cleanEmail.length > 254) {
      return 'Email address is too long';
    }
    
    if (cleanEmail.includes('..') || cleanEmail.includes('--')) {
      return 'Email address contains invalid characters';
    }
    
    if (cleanEmail.startsWith('.') || cleanEmail.endsWith('.') || 
        cleanEmail.startsWith('-') || cleanEmail.endsWith('-')) {
      return 'Email address cannot start or end with . or -';
    }
    
    // Check domain has at least one dot
    const domain = cleanEmail.split('@')[1];
    if (!domain || !domain.includes('.')) {
      return 'Please enter a valid email address';
    }
    
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password.trim()) {
      return 'Password is required';
    }
    const validation = validatePasswordRequirements(password);
    if (!validation.length || !validation.uppercase || !validation.lowercase || !validation.number || !validation.special) {
      return 'Password does not meet all requirements';
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
    
    let fieldError: string | undefined;
    
    switch (field) {
      case 'fullName':
        fieldError = validateFullName(fullName);
        break;
      case 'businessName':
        fieldError = validateBusinessName(businessName);
        break;
      case 'email':
        fieldError = validateEmail(email);
        break;
      case 'password':
        fieldError = validatePassword(password);
        break;
      case 'agreeToTerms':
        fieldError = validateTerms(agreeToTerms);
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'fullName':
        setFullName(value);
        break;
      case 'businessName':
        setBusinessName(value);
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
    const fullNameError = validateFullName(fullName);
    const businessNameError = validateBusinessName(businessName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const termsError = validateTerms(agreeToTerms);
    
    const newErrors: ValidationErrors = {};
    if (fullNameError) newErrors.fullName = fullNameError;
    if (businessNameError) newErrors.businessName = businessNameError;
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    if (termsError) newErrors.agreeToTerms = termsError;
    
    setErrors(newErrors);
    setTouched({ 
      fullName: true, 
      businessName: true,
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
      const credentials = {
        email,
        password,
        fullName,
        businessName,
        userType: 'owner' as const
      };
      
      await register(credentials);
      
      // Redirect to owner dashboard or show success message
      router.push('/dashboard/owner');
    } catch (error: any) {
      console.error('Owner registration error:', error);
      // Handle error - you might want to show a toast or error message
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Simulate Google OAuth
    setTimeout(() => {
      setIsLoading(false);
      console.log('Owner Google sign-in initiated');
    }, 1000);
  };

  const handleNavigateToLogin = () => {
    router.push('/auth/login');
  };

  const handleNavigateToUserRegister = () => {
    router.push('/auth/register');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center p-2 sm:p-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="w-full max-w-lg mx-auto">
        {/* Owner Register Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Register Your Business</h1>
            <p className="text-sm sm:text-base text-gray-600">Create your business account and start managing your services</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
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
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">OR CREATE ACCOUNT WITH EMAIL</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-blue-600 mb-2">
                Owner Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                  touched.fullName && errors.fullName 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {touched.fullName && errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Business Name Field */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-blue-600 mb-2">
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                value={businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                onBlur={() => handleBlur('businessName')}
                className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                  touched.businessName && errors.businessName 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter your business name"
              />
              {touched.businessName && errors.businessName && (
                <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-600 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                  touched.email && errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-600 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  onFocus={() => setShowPasswordValidation(true)}
                  className={`block w-full pr-10 px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                    touched.password && errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3">
                  {/* Strength Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength < 20 ? 'bg-red-500' :
                        passwordStrength < 40 ? 'bg-orange-500' :
                        passwordStrength < 60 ? 'bg-yellow-500' :
                        passwordStrength < 80 ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${passwordStrength}%` }}
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 hover:underline font-medium transition-all duration-200">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 hover:underline font-medium transition-all duration-200">
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
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating business account...
                </>
              ) : (
                'Create Business Account'
              )}
            </button>
          </form>

          

          
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
} 