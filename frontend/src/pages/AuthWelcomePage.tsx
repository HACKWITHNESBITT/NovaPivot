import { Link } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, Shield, LogIn } from 'lucide-react'

export default function AuthWelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nova-dark via-nova-dark to-nova-darker px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-nova-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-nova-teal/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Logo and title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-nova-teal to-nova-teal-dark rounded-2xl mb-6">
            <span className="text-3xl font-bold text-white">NP</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to NovaPivot</h1>
          <p className="text-xl text-nova-text-muted mb-2">Choose your path to get started</p>
          <p className="text-nova-text">Secure access with enhanced features and data persistence</p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Login Card */}
          <Link
            to="/login"
            className="group glass rounded-2xl p-8 border border-nova-border/50 hover:border-nova-teal/50 transition-all cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-nova-teal/20 to-nova-teal/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LogIn className="w-8 h-8 text-nova-teal" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Sign In</h3>
            <p className="text-nova-text-muted mb-6">
              Already have an account? Sign in to access your personalized career transition dashboard.
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-nova-text">
                <Mail className="w-5 h-5 text-nova-teal" />
                <span>Secure email login</span>
              </div>
              <div className="flex items-center gap-3 text-nova-text">
                <Lock className="w-5 h-5 text-nova-teal" />
                <span>Protected account access</span>
              </div>
              <div className="flex items-center gap-3 text-nova-text">
                <Shield className="w-5 h-5 text-nova-teal" />
                <span>Remember me option</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6 text-nova-teal group-hover:text-nova-teal/80 transition-colors">
              <span className="font-medium">Sign In to Your Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Sign Up Card */}
          <Link
            to="/signup"
            className="group glass rounded-2xl p-8 border border-nova-border/50 hover:border-nova-teal/50 transition-all cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-nova-teal/20 to-nova-teal/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User className="w-8 h-8 text-nova-teal" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Create Account</h3>
            <p className="text-nova-text-muted mb-6">
              New to NovaPivot? Create an account to start your AI-powered career transition journey.
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 text-nova-text">
                <User className="w-5 h-5 text-nova-teal" />
                <span>Free account setup</span>
              </div>
              <div className="flex items-center gap-3 text-nova-text">
                <Shield className="w-5 h-5 text-nova-teal" />
                <span>Password strength indicator</span>
              </div>
              <div className="flex items-center gap-3 text-nova-text">
                <Mail className="w-5 h-5 text-nova-teal" />
                <span>Email verification</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6 text-nova-teal group-hover:text-nova-teal/80 transition-colors">
              <span className="font-medium">Create Your Free Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Additional Options */}
        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-nova-text-muted hover:text-nova-teal transition-colors"
          >
            Forgot your password? Reset it here
          </Link>
        </div>

        {/* Back to Landing */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-nova-text-muted hover:text-nova-text transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Mode Selection</span>
          </a>
        </div>
      </div>
    </div>
  )
}
