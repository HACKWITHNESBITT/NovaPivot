import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Import existing components
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
import Chat from './components/Chat'
import WelcomeBanner from './components/WelcomeBanner'
import RoadmapPage from './pages/RoadmapPage'
import JobsPage from './pages/JobsPage'
import InterviewPage from './pages/InterviewPage'

// Import auth pages
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

// Import app context
import { useApp } from './context/AppContext'

function HomePage() {
  return (
    <>
      <WelcomeBanner />
      
      {/* Alert Box */}
      <div className="mb-4 sm:mb-6 glass rounded-xl p-3 sm:p-4 border-l-4 border-nova-teal">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-nova-teal/20 flex items-center justify-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-nova-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-nova-teal font-semibold text-sm sm:text-base">Complete Your Profile Setup</h3>
            <p className="text-nova-text-muted text-xs sm:text-sm">Upload your resume and set your target role to get personalized career guidance.</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <Chat />
    </>
  )
}

function AssessmentPage() {
  const { userProfile, updateUserProfile } = useApp()
  const [newTargetRole, setNewTargetRole] = useState(userProfile.targetRole)

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserProfile({ targetRole: newTargetRole })
  }

  // Calculate skill matches for target role
  const marketSkillsMap: Record<string, string[]> = {
    "Data Scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
    "Software Engineer": ["Python", "Java", "System Design", "Algorithms", "Git"],
    "Product Manager": ["Strategy", "Roadmapping", "SQL", "Agile", "User Research"]
  }

  const requiredSkills = marketSkillsMap[userProfile.targetRole] || ["Communication", "Problem Solving", "Leadership", "Technical Proficiency"]
  const matchingSkills = userProfile.skills.filter(skill => 
    requiredSkills.some(req => req.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(req.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <div className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Career Transition Readiness Assessment</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column - Current Profile */}
          <div>
            <h3 className="text-nova-teal font-semibold mb-3">Your Current Profile</h3>
            
            {userProfile.resumeUploaded ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-2">Resume Analyzed</h4>
                  <p className="text-nova-text text-sm">{userProfile.skills.length} skills detected</p>
                </div>
                
                <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
                  <h4 className="text-white font-medium mb-2">Current Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-nova-teal/20 text-nova-teal text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-nova-text-muted">No skills detected yet. Upload your resume to start.</p>
            )}
          </div>

          {/* Right Column - Target Role Insight */}
          <div>
            <h3 className="text-nova-teal font-semibold mb-3">Target Role Insight</h3>
            
            <form onSubmit={handleRoleSubmit} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTargetRole}
                  onChange={(e) => setNewTargetRole(e.target.value)}
                  placeholder="Change Target Role"
                  className="flex-1 px-3 py-2 bg-nova-card border border-nova-border rounded-lg text-sm text-nova-text focus:outline-none focus:border-nova-teal/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-nova-teal text-white rounded-lg text-sm hover:bg-nova-teal/80 transition-colors"
                >
                  Update
                </button>
              </div>
            </form>

            {userProfile.targetRole ? (
              <div className="space-y-4">
                <div className="p-4 bg-nova-teal/10 border border-nova-teal/30 rounded-lg">
                  <h4 className="text-nova-teal font-semibold">Evaluating for: {userProfile.targetRole}</h4>
                </div>

                <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
                  <h4 className="text-white font-medium mb-2">Potential Career Paths:</h4>
                  <ul className="text-nova-text text-sm space-y-1 list-disc list-inside">
                    <li>{userProfile.targetRole} (Direct Match)</li>
                    <li>Senior {userProfile.targetRole} (3-5 years)</li>
                    <li>Managerial Role in related field</li>
                  </ul>
                </div>

                <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
                  <h4 className="text-white font-medium mb-2">Upskilling Priority:</h4>
                  <ul className="text-nova-text text-sm space-y-1">
                    <li>• Master top 3 missing skills shown in Dashboard</li>
                    <li>• Update your LinkedIn to highlight {matchingSkills.slice(0, 3).join(', ') || 'your core skills'}</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-nova-text-muted">Set a target role to see insights.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const { userProfile } = useApp()
  
  // Market skills mapping (from original Streamlit)
  const marketSkillsMap: Record<string, string[]> = {
    "Data Scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
    "Software Engineer": ["Python", "Java", "System Design", "Algorithms", "Git"],
    "Product Manager": ["Strategy", "Roadmapping", "SQL", "Agile", "User Research"]
  }

  const requiredSkills = marketSkillsMap[userProfile.targetRole] || ["Communication", "Problem Solving", "Leadership", "Technical Proficiency", "Teamwork"]
  
  // Calculate matching and missing skills
  const matchingSkills = requiredSkills.filter(req => 
    userProfile.skills.some(skill => 
      skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase())
    )
  )
  const missingSkills = requiredSkills.filter(req => !matchingSkills.includes(req))
  
  // Calculate readiness score
  const matchScore = requiredSkills.length > 0 
    ? Math.round((matchingSkills.length / requiredSkills.length) * 100) 
    : 0

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-500/20'
    if (score >= 40) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      
      <div className="glass rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
          Analysis for: <span className="text-nova-teal">{userProfile.targetRole || 'Not Specified'}</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* Skill Coverage */}
          <div>
            <h3 className="text-nova-teal font-semibold mb-4">Skill Coverage</h3>
            {!userProfile.skills.length ? (
              <p className="text-nova-text-muted">Upload your resume to see skill coverage.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {userProfile.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-nova-card/50 rounded-lg border border-nova-border">
                      <div className={`w-2 h-2 rounded-full ${matchingSkills.includes(skill) ? 'bg-green-400' : 'bg-nova-teal'}`} />
                      <span className="text-nova-text text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transition Readiness */}
          <div>
            <h3 className="text-nova-teal font-semibold mb-4">Transition Readiness</h3>
            <div className={`${getScoreBg(matchScore)} border ${getScoreColor(matchScore).replace('text', 'border')} rounded-lg p-6 text-center`}>
              <div className={`text-5xl font-bold ${getScoreColor(matchScore)} mb-2`}>{matchScore}%</div>
              <div className="text-nova-text-muted text-sm">Readiness Score</div>
              <div className="mt-4 w-full bg-nova-dark rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all ${
                    matchScore >= 70 ? 'bg-green-400' : matchScore >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${matchScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 pt-6 border-t border-nova-border">
          <h3 className="text-white font-semibold mb-4">Recommendations</h3>
          {userProfile.skills.length > 0 && missingSkills.length > 0 ? (
            <div>
              <p className="text-nova-text text-sm mb-3">
                To reach <strong className="text-nova-teal">{userProfile.targetRole}</strong> level, focus on these areas:
              </p>
              <ul className="space-y-2">
                {missingSkills.map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-nova-text">
                    <span className="text-red-400 mt-0.5">•</span>
                    <span><strong>{skill}</strong>: Consider taking a course or working on a project involving this skill.</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : userProfile.skills.length > 0 ? (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400">You are a great match! Start applying for roles.</p>
            </div>
          ) : (
            <p className="text-nova-text-muted">Process your resume to see detailed recommendations.</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Component (with authentication)
function Dashboard() {
  const { sidebarCollapsed, activeTab } = useApp()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />
      case 'assessment':
        return <AssessmentPage />
      case 'dashboard':
        return <DashboardPage />
      case 'roadmap':
        return <RoadmapPage />
      case 'jobs':
        return <JobsPage />
      case 'interview':
        return <InterviewPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nova-dark via-nova-dark to-nova-darker">
      {/* Header */}
      <Header onToggleSidebar={() => setMobileNavOpen(!mobileNavOpen)} sidebarCollapsed={sidebarCollapsed} />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar collapsed={sidebarCollapsed} />
        </div>

        {/* Mobile Navigation */}
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-3 sm:p-4 md:p-6 max-w-4xl md:max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

// Auth Loading Component
function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nova-dark via-nova-dark to-nova-darker">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-nova-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-nova-text-muted">Loading...</p>
      </div>
    </div>
  )
}

// Main App Component with Authentication
function AppWithAuth() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <AuthLoading />
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  )
}

// Root App Component
function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  )
}

export default App
