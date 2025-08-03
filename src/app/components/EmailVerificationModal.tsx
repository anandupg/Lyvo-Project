'use client';

import { useState } from 'react';
import { sendEmailVerificationFirebase } from '@/lib/firebase';
import { User } from 'firebase/auth';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  email: string;
}

export default function EmailVerificationModal({ isOpen, onClose, user, email }: EmailVerificationModalProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendEmail = async () => {
    if (!user) return;
    
    setIsResending(true);
    try {
      const { error } = await sendEmailVerificationFirebase(user);
      if (error) {
        alert(`Failed to resend email: ${error}`);
      } else {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      }
    } catch (error) {
      alert('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Email Verification Required
          </h2>
          <p className="text-gray-600">
            Please verify your email address before signing in
          </p>
        </div>

        {/* Email Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <span className="text-blue-900 font-semibold">{email}</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-900 mb-2">What to do next:</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              Check your email inbox for a verification link
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              Click the verification link in the email
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              Return here and try signing in again
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold py-3 px-4 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Resending...
              </div>
            ) : (
              'Resend Verification Email'
            )}
          </button>

          {resendSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm text-center">
                ✓ Verification email sent successfully!
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 rounded-lg font-medium py-3 px-4 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-300 border border-gray-300"
          >
            Close
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Can't find the email? Check your spam folder or{' '}
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-500 font-medium underline"
            >
              resend it
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 