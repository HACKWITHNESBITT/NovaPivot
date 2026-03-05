import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Clear field-level errors when form data changes (NOT the auth context error)
  useEffect(() => {
    setFieldErrors({});
  }, [formData.email, formData.password]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password, formData.rememberMe);
      // Navigation will be handled by useEffect
    } catch (error) {
      // Error is handled by auth context
      console.error('Login failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-nova-text-muted">Sign in to your NovaPivot account</p>
        </div>

        {/* Login form */}
        <div className="glass rounded-2xl p-8 border border-nova-border/50">
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

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
              {fieldErrors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Remember me & forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 bg-nova-card/50 border-nova-border rounded text-nova-teal focus:ring-nova-teal/50 focus:ring-2"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-nova-text-muted">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-nova-teal hover:text-nova-teal/80 transition-colors"
              >
                Forgot password?
              </Link>
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
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-nova-text-muted">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-nova-teal hover:text-nova-teal/80 transition-colors font-medium"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-nova-text-muted">
            By signing in, you agree to our{' '}
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
