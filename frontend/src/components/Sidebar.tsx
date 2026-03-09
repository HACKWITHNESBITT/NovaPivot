import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { 
  Home, 
  ClipboardList, 
  BarChart3, 
  Map, 
  Briefcase, 
  MessageSquare,
  Target,
  CheckCircle2,
  XCircle,
  Upload
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
}

function Sidebar({ collapsed }: SidebarProps) {
  const { userProfile, updateUserProfile, uploadResumeFile, isLoading, activeTab, setActiveTab } = useApp()
  const [targetRole, setTargetRole] = useState(userProfile.targetRole)

  const progress = (!userProfile.resumeUploaded ? 0 : 50) + (!userProfile.targetRole ? 0 : 50)

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'assessment', label: 'Assessment', icon: ClipboardList },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'interview', label: 'Interview', icon: MessageSquare },
  ]

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (targetRole.trim()) {
      updateUserProfile({ targetRole: targetRole.trim() })
    }
  }

  if (collapsed) {
    return null
  }

  return (
    <aside className="w-64 sm:w-80 h-full glass border-r border-nova-border flex flex-col overflow-hidden">
      {/* Title */}
      <div className="p-3 sm:p-4 border-b border-nova-border">
        <h2 className="text-center text-nova-teal text-lg sm:text-xl font-bold">NovaPivot</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Profile Progress */}
        <div className="bg-nova-teal/10 border border-nova-teal/30 rounded-lg p-3 sm:p-4">
          <div className="text-nova-text text-xs sm:text-sm mb-2 sm:mb-3">
            <span className="font-semibold">Profile Setup:</span> {progress}%
          </div>
          <div className="w-full bg-nova-dark rounded-full h-2 mb-2 sm:mb-3">
            <div 
              className="bg-gradient-to-r from-nova-teal to-nova-teal-dark h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-nova-text-muted space-y-1">
            <div className="flex items-center gap-2">
              {userProfile.resumeUploaded ? (
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              ) : (
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
              )}
              <span className="text-xs sm:text-sm">Resume Uploaded</span>
            </div>
            <div className="flex items-center gap-2">
              {userProfile.targetRole ? (
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              ) : (
                <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
              )}
              <span className="text-xs sm:text-sm">Target Role Set</span>
            </div>
          </div>
        </div>

        {/* Core Journey */}
        <div>
          <h3 className="text-nova-teal font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Core Journey</h3>
          <nav className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm transition-all text-left ${
                    activeTab === item.id
                      ? 'bg-nova-teal/20 border border-nova-teal/30 text-nova-teal'
                      : 'bg-white/5 border border-white/10 text-nova-text hover:bg-nova-teal/10 hover:border-nova-teal/30'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Profile Setup Section */}
        <div className="border-t border-nova-border pt-4 sm:pt-6">
          <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Profile Setup</h3>
          <p className="text-nova-text-muted text-xs mb-3 sm:mb-4">
            Tell us about your background and goals so we can tailor your experience.
          </p>

          {/* Resume Upload */}
          <div className="mb-3 sm:mb-4">
            <label className="text-nova-text text-xs sm:text-sm font-medium block mb-2">
              Resume Upload
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={async (e) => {
                  if (e.target.files?.[0]) {
                    await uploadResumeFile(e.target.files[0])
                  }
                }}
                disabled={isLoading}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-2 sm:py-3 bg-nova-card border border-nova-border rounded-lg text-nova-text text-xs sm:text-sm cursor-pointer hover:border-nova-teal/50 transition-colors"
              >
                <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Upload PDF/DOCX</span>
                <span className="sm:hidden">Upload</span>
              </label>
            </div>
            {userProfile.resumeUploaded && (
              <div className="mt-2 sm:mt-3 space-y-2">
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Resume uploaded successfully</span>
                  <span className="sm:hidden">Uploaded</span>
                </div>
                {userProfile.skills.length > 0 && (
                  <div className="bg-nova-card/50 rounded-lg p-2 sm:p-3 border border-nova-border">
                    <p className="text-nova-text-muted text-xs mb-2">
                      Found <strong className="text-nova-teal">{userProfile.skills.length}</strong> skills:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {userProfile.skills.slice(0, 6).map((skill, idx) => (
                        <span key={idx} className="px-1 sm:px-2 py-0.5 bg-nova-teal/20 text-nova-teal text-xs rounded-full">
                          {skill.length > 10 ? skill.substring(0, 10) + '...' : skill}
                        </span>
                      ))}
                      {userProfile.skills.length > 6 && (
                        <span className="px-1 sm:px-2 py-0.5 bg-nova-teal/10 text-nova-teal text-xs rounded-full">
                          +{userProfile.skills.length - 6}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Target Role */}
          <div>
            <label className="text-nova-text text-xs sm:text-sm font-medium block mb-2">
              Target Role
            </label>
            <form onSubmit={handleRoleSubmit} className="space-y-2 sm:space-y-3">
              <div className="relative">
                <Target className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-nova-text-muted" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="What is your goal?"
                  className="w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 bg-nova-card border border-nova-border rounded-lg text-nova-text text-xs sm:text-sm placeholder:text-nova-text-muted focus:outline-none focus:border-nova-teal/50"
                />
              </div>
              <button
                type="submit"
                className="w-full px-3 sm:px-4 py-2 bg-nova-teal text-white rounded-lg text-xs sm:text-sm hover:bg-nova-teal/80 transition-colors"
              >
                Update Target Role
              </button>
            </form>
            {userProfile.targetRole && (
              <p className="mt-2 text-nova-teal text-xs">
                Targeting: <span className="font-semibold">{userProfile.targetRole}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
