import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear field-level errors when form data changes (NOT the auth context error)
  useEffect(() => {
    setFieldErrors({});
  }, [formData.fullName, formData.email, formData.password, formData.confirmPassword]);

  // Calculate password strength
  useEffect(() => {
    const password = formData.password;
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 12.5;
    if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;

    setPasswordStrength(strength);
  }, [formData.password]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    } else if (formData.fullName.length > 50) {
      errors.fullName = 'Full name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      errors.fullName = 'Full name can only contain letters and spaces';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(formData.fullName, formData.email, formData.password, formData.confirmPassword);
      setSuccessMessage('Account created successfully! Redirecting to dashboard...');
      // Navigation will be handled by useEffect
    } catch (error) {
      // Error is handled by auth context
      console.error('Registration failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-yellow-500';
    if (passwordStrength <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nova-dark via-nova-dark to-nova-darker px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-nova-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-nova-teal/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-nova-teal to-nova-teal-dark rounded-2xl mb-4">
            <span className="text-2xl font-bold text-white">NP</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-nova-text-muted">Join NovaPivot and transform your career</p>
        </div>

        {/* Sign up form */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full name field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-nova-text mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-nova-text-muted" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-nova-card/50 border rounded-lg text-nova-text placeholder-nova-text-muted focus:outline-none focus:ring-2 focus:ring-nova-teal/50 focus:border-nova-teal transition-all ${fieldErrors.fullName
                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                    : 'border-nova-border'
                    }`}
                  placeholder="John Doe"
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.fullName && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-nova-card/50 border rounded-lg text-nova-text placeholder-nova-text-muted focus:outline-none focus:ring-2 focus:ring-nova-teal/50 focus:border-nova-teal transition-all ${fieldErrors.email
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

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-nova-text mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-nova-text-muted" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 bg-nova-card/50 border rounded-lg text-nova-text placeholder-nova-text-muted focus:outline-none focus:ring-2 focus:ring-nova-teal/50 focus:border-nova-teal transition-all ${fieldErrors.password
                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                    : 'border-nova-border'
                    }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-nova-text-muted hover:text-nova-text transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-nova-text-muted hover:text-nova-text transition-colors" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-nova-text-muted">Password strength</span>
                    <span className={`text-xs font-medium ${passwordStrength <= 25 ? 'text-red-400' :
                      passwordStrength <= 50 ? 'text-yellow-400' :
                        passwordStrength <= 75 ? 'text-blue-400' :
                          'text-green-400'
                      }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-nova-border rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {fieldErrors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Confirm password field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-nova-text mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="w-5 h-5 text-nova-text-muted" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 bg-nova-card/50 border rounded-lg text-nova-text placeholder-nova-text-muted focus:outline-none focus:ring-2 focus:ring-nova-teal/50 focus:border-nova-teal transition-all ${fieldErrors.confirmPassword
                    ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                    : 'border-nova-border'
                    }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-nova-text-muted hover:text-nova-text transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-nova-text-muted hover:text-nova-text transition-colors" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.confirmPassword}
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
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-8 text-center">
            <p className="text-nova-text-muted">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-nova-teal hover:text-nova-teal/80 transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-nova-text-muted">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-nova-teal hover:text-nova-teal/80 transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-nova-teal hover:text-nova-teal/80 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
