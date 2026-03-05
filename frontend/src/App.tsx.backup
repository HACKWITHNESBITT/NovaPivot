import { useState } from 'react'

// Import original App
import AppOriginal from './App_Original_Clean'

// Import authenticated App
import AppWithAuth from './App_Auth_Clean'

function LandingPage() {
  const [selectedMode, setSelectedMode] = useState<'original' | 'auth' | null>(null)

  if (selectedMode === 'original') {
    return <AppOriginal />
  }

  if (selectedMode === 'auth') {
    return <AppWithAuth />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nova-dark via-nova-dark to-nova-darker px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-nova-teal/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-nova-teal/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl text-center">
        {/* Logo and title */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-nova-teal to-nova-teal-dark rounded-2xl mb-6">
            <span className="text-3xl font-bold text-white">NP</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">NovaPivot</h1>
          <p className="text-xl text-nova-text-muted mb-2">AI Career Transition Platform</p>
          <p className="text-nova-text">Choose how you want to experience the platform</p>
        </div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Original Mode */}
          <div 
            onClick={() => setSelectedMode('original')}
            className="glass rounded-2xl p-8 border border-nova-border/50 hover:border-nova-teal/50 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-nova-teal/20 to-nova-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-nova-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Original Mode</h3>
            <p className="text-nova-text-muted mb-4">
              Access NovaPivot without authentication. All features available immediately.
            </p>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm text-nova-text">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Immediate access to all features</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-nova-text">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>No login required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-nova-text">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Perfect for testing and demos</span>
              </div>
            </div>
          </div>

          {/* Authenticated Mode */}
          <div 
            onClick={() => setSelectedMode('auth')}
            className="glass rounded-2xl p-8 border border-nova-border/50 hover:border-nova-teal/50 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-nova-teal/20 to-nova-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-nova-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Authenticated Mode</h3>
            <p className="text-nova-text-muted mb-4">
              Secure access with user accounts, data persistence, and enhanced features.
            </p>
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-sm text-nova-text">
                <div className="w-2 h-2 bg-nova-teal rounded-full"></div>
                <span>User accounts and profiles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-nova-text">
                <div className="w-2 h-2 bg-nova-teal rounded-full"></div>
                <span>Data persistence</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-nova-text">
                <div className="w-2 h-2 bg-nova-teal rounded-full"></div>
                <span>Enhanced security features</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="glass rounded-xl p-6 border border-nova-border/30">
          <h4 className="text-nova-teal font-semibold mb-3">Quick Start Guide</h4>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h5 className="text-white font-medium mb-2">🚀 Original Mode</h5>
              <p className="text-nova-text-muted text-sm">
                Click "Original Mode" to start using NovaPivot immediately. No setup required.
              </p>
            </div>
            <div>
              <h5 className="text-white font-medium mb-2">🔐 Authenticated Mode</h5>
              <p className="text-nova-text-muted text-sm">
                Click "Authenticated Mode" to create an account or login. Your data will be saved securely.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-nova-text-muted">
            NovaPivot AI Career Transition Platform • Transform your career with AI-powered guidance
          </p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
