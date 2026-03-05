import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'

// Import original App
import AppOriginal from './App_Original_Clean'

// Import authenticated App
import AppWithAuth from './App_Auth_Clean'

function LandingPage() {
  const [selectedMode, setSelectedMode] = useState<'original' | 'auth' | null>(null)

  // When clicking Original Mode, we render the original app version
  if (selectedMode === 'original') {
    return <AppOriginal />
  }

  // When clicking Auth Mode, we render the authenticated app version
  if (selectedMode === 'auth') {
    return <AppWithAuth />
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-nova-dark via-nova-dark to-nova-darker px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-nova-teal/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-nova-teal/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Logo and title */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-nova-teal to-nova-teal-dark rounded-2xl mb-6 shadow-lg shadow-nova-teal/20">
            <span className="text-3xl font-bold text-white">NP</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">NovaPivot</h1>
          <p className="text-xl text-nova-text-muted mb-2 font-medium">AI Career Transition Platform</p>
          <p className="text-nova-text">Choose how you want to experience the platform</p>
        </div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Original Mode (Guest/No Auth) */}
          <button
            onClick={() => setSelectedMode('original')}
            className="text-left glass rounded-2xl p-8 border border-nova-border/50 hover:border-nova-teal group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-nova-teal/50"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-nova-teal/20 to-nova-teal/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-nova-teal/30 transition-all duration-300">
              <svg className="w-8 h-8 text-nova-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Original Mode</h3>
            <p className="text-nova-text-muted mb-6 text-sm leading-relaxed">
              Explore NovaPivot instantly (Guest Mode). No account required to access AI guidance.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-nova-text">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                <span>Immediate agent access</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-nova-text">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                <span>No sign-up required</span>
              </div>
            </div>
          </button>

          {/* Authenticated Mode (Full Features) */}
          <button
            onClick={() => setSelectedMode('auth')}
            className="text-left glass rounded-2xl p-8 border border-nova-border/50 hover:border-nova-teal group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-nova-teal/50"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-nova-teal/20 to-nova-teal/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-nova-teal/30 transition-all duration-300">
              <svg className="w-8 h-8 text-nova-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Authenticated Mode</h3>
            <p className="text-nova-text-muted mb-6 text-sm leading-relaxed">
              Unlock full features including data persistence, profiles, and secure access.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-nova-text">
                <div className="w-1.5 h-1.5 bg-nova-teal rounded-full shadow-[0_0_8px_rgba(0,212,255,0.5)]"></div>
                <span>Save your progress</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-nova-text">
                <div className="w-1.5 h-1.5 bg-nova-teal rounded-full shadow-[0_0_8px_rgba(0,212,255,0.5)]"></div>
                <span>Personalized profiles</span>
              </div>
            </div>
          </button>
        </div>

        {/* Info Box */}
        <div className="glass rounded-2xl p-6 border border-nova-border/30 bg-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-nova-teal rounded-full"></div>
            <h4 className="text-nova-teal font-bold uppercase tracking-wider text-xs">Quick Selection Guide</h4>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <p className="text-white text-sm font-semibold mb-1">🚀 Fast Track</p>
              <p className="text-nova-text-muted text-xs leading-relaxed">
                Choose Original Mode for quick demos or one-off sessions without data saving.
              </p>
            </div>
            <div>
              <p className="text-white text-sm font-semibold mb-1">🔐 Personal Journey</p>
              <p className="text-nova-text-muted text-xs leading-relaxed">
                Choose Authenticated Mode to track your transition progress over time.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-nova-text-muted opacity-60">
            NovaPivot AI Career Transition Platform • Transforming careers with intelligence
          </p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <LandingPage />
    </AuthProvider>
  )
}

export default App
