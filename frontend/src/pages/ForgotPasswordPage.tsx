import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Clear errors when component unmounts or email changes
  useEffect(() => {
    clearError();
    setFieldErrors({});
    setSuccessMessage('');
  }, [email]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await forgotPassword(email);
      setSuccessMessage('Password reset link has been sent to your email address.');
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by auth context
      console.error('Forgot password failed:', error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsSubmitted(false); // Reset form if user changes email
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nova-dark via-nova-dark to-nova-darker px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-nova-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-nova-teal/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-nova-text-muted hover:text-nova-text transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        {/* Icon and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-nova-teal/20 to-nova-teal/10 rounded-2xl mb-4">
            <Mail className="w-8 h-8 text-nova-teal" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-nova-text-muted">
            {isSubmitted 
              ? "Check your email for the reset link"
              : "Enter your email address and we'll send you a link to reset your password"
            }
          </p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-8 border border-nova-border/50">
          {/* Success message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-nova-text mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-nova-text-muted" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full pl-10 pr-4 py-3 bg-nova-card/50 border rounded-lg text-nova-text placeholder-nova-text-muted focus:outline-none focus:ring-2 focus:ring-nova-teal/50 focus:border-nova-teal transition-all ${
                      fieldErrors.email 
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                        : 'border-nova-border'
                    }`}
                    placeholder="john@example.com"
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-nova-teal to-nova-teal-dark text-white font-medium rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-nova-teal/50 focus:ring-offset-2 focus:ring-offset-nova-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Reset Link...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
              <p className="text-nova-text-muted mb-6">
                We've sent a password reset link to your email address. 
                Please check your inbox and follow the instructions.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="w-full py-2 px-4 bg-nova-card/50 border border-nova-border rounded-lg text-nova-text hover:bg-nova-card/70 transition-colors"
                >
                  Send Another Email
                </button>
                <Link
                  to="/login"
                  className="block w-full py-2 px-4 text-center text-nova-teal hover:text-nova-teal/80 transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help text */}
        {!isSubmitted && (
          <div className="mt-6 text-center">
            <p className="text-sm text-nova-text-muted">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-nova-teal hover:text-nova-teal/80 transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
