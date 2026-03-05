import { useState, useRef, useEffect } from 'react'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function UserProfileDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-nova-card/50 transition-colors"
        aria-label="User profile"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-nova-teal/20 border border-nova-teal/30 flex items-center justify-center">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-nova-teal" />
        </div>
        <ChevronDown className={`w-4 h-4 text-nova-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 glass rounded-xl border border-nova-border/50 shadow-lg z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-nova-border/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-nova-teal/20 border border-nova-teal/30 flex items-center justify-center">
                <User className="w-6 h-6 text-nova-teal" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">{user.fullName}</h4>
                <p className="text-nova-text-muted text-sm">{user.email}</p>
                <p className="text-nova-text-muted text-xs">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false)
                navigate('/profile-settings')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-nova-card/50 transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-nova-text-muted" />
              <span className="text-nova-text">Profile Settings</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="text-red-400">Logout</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-nova-border/30">
            <p className="text-nova-text-muted text-xs text-center">
              NovaPivot AI Career Platform
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
