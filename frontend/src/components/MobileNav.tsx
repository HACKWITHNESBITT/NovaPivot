import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { 
  Home, 
  ClipboardList, 
  BarChart3, 
  Map, 
  Briefcase, 
  MessageSquare,
  X,
  Upload,
  Target,
  CheckCircle2,
  XCircle
} from 'lucide-react'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

function MobileNav({ isOpen, onClose }: MobileNavProps) {
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

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Mobile Navigation */}
      <div className="fixed inset-y-0 left-0 w-80 sm:w-96 glass border-r border-nova-border z-50 lg:hidden overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-nova-border">
          <h2 className="text-nova-teal text-xl font-bold">NovaPivot</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-nova-card border border-nova-border text-nova-text hover:bg-nova-teal/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Profile Progress */}
          <div className="bg-nova-teal/10 border border-nova-teal/30 rounded-lg p-4">
            <div className="text-nova-text text-sm mb-3">
              <span className="font-semibold">Profile Setup:</span> {progress}%
            </div>
            <div className="w-full bg-nova-dark rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-nova-teal to-nova-teal-dark h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-nova-text-muted space-y-1">
              <div className="flex items-center gap-2">
                {userProfile.resumeUploaded ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span>Resume Uploaded</span>
              </div>
              <div className="flex items-center gap-2">
                {userProfile.targetRole ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span>Target Role Set</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-nova-teal font-semibold mb-3 text-sm">Navigation</h3>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left ${
                      activeTab === item.id
                        ? 'bg-nova-teal/20 border border-nova-teal/30 text-nova-teal'
                        : 'bg-white/5 border border-white/10 text-nova-text hover:bg-nova-teal/10 hover:border-nova-teal/30'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Profile Setup */}
          <div className="border-t border-nova-border pt-6">
            <h3 className="text-white font-semibold mb-4">Profile Setup</h3>
            
            {/* Resume Upload */}
            <div className="mb-4">
              <label className="text-nova-text text-sm font-medium block mb-2">
                Resume Upload
              </label>
              <div className="relative">
                <input
                  ref={(input) => {
                    if (input) {
                      input.addEventListener('touchstart', (e) => {
                        e.stopPropagation()
                      })
                    }
                  }}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={async (e) => {
                    console.log('Mobile file input changed', e.target.files)
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0]
                      console.log('Uploading file:', file.name, file.type, file.size)
                      
                      // Validate file type
                      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
                      if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
                        alert('Please upload a PDF or DOCX file')
                        return
                      }
                      
                      // Validate file size (10MB limit)
                      if (file.size > 10 * 1024 * 1024) {
                        alert('File size must be less than 10MB')
                        return
                      }
                      
                      try {
                        await uploadResumeFile(file)
                        console.log('Upload successful')
                      } catch (error) {
                        console.error('Upload failed:', error)
                        alert('Failed to upload resume. Please try again.')
                      }
                    }
                  }}
                  disabled={isLoading}
                  className="hidden"
                  id="mobile-resume-upload"
                  capture={false}
                />
                <label
                  htmlFor="mobile-resume-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-nova-card border border-nova-border rounded-lg text-nova-text text-sm cursor-pointer hover:border-nova-teal/50 transition-colors active:scale-95 touch-manipulation"
                  onTouchStart={(e) => {
                    e.preventDefault()
                    const input = document.getElementById('mobile-resume-upload') as HTMLInputElement
                    input?.click()
                  }}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload PDF/DOCX</span>
                </label>
              </div>
              {isLoading && (
                <div className="mt-2 text-nova-teal text-xs flex items-center gap-2">
                  <div className="w-3 h-3 border border-nova-teal border-t-transparent rounded-full animate-spin"></div>
                  Uploading resume...
                </div>
              )}
              {userProfile.resumeUploaded && (
                <div className="mt-3 text-green-400 text-xs">
                  Resume uploaded successfully
                </div>
              )}
            </div>

            {/* Target Role */}
            <div>
              <label className="text-nova-text text-sm font-medium block mb-2">
                Target Role
              </label>
              <form onSubmit={handleRoleSubmit} className="space-y-3">
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nova-text-muted" />
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="What is your goal?"
                    className="w-full pl-10 pr-4 py-3 bg-nova-card border border-nova-border rounded-lg text-nova-text text-sm placeholder:text-nova-text-muted focus:outline-none focus:border-nova-teal/50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-nova-teal text-white rounded-lg text-sm hover:bg-nova-teal/80 transition-colors"
                >
                  Update Target Role
                </button>
              </form>
              {userProfile.targetRole && (
                <div className="mt-2 text-nova-teal text-xs">
                  Currently targeting: <span className="font-semibold">{userProfile.targetRole}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileNav
