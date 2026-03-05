import { Menu, Rocket } from 'lucide-react'
import UserProfileDropdown from './UserProfileDropdown'

interface HeaderProps {
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
}

function Header({ onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  return (
    <header className="h-16 glass border-b border-nova-border flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-50">
      {/* Left: Toggle Button & Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg bg-gradient-to-r from-nova-teal to-nova-teal-dark text-white hover:opacity-90 transition-opacity flex items-center gap-1 sm:gap-2"
          aria-label={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline text-xs sm:text-sm font-medium">
            {sidebarCollapsed ? 'Show' : 'Hide'}
          </span>
          <span className="sm:hidden text-xs font-medium">
            Menu
          </span>
        </button>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-nova-teal to-nova-teal-dark flex items-center justify-center">
            <Rocket className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-base sm:text-xl font-bold text-white hidden sm:block">NovaPivot</span>
        </div>
      </div>

      {/* Right: User Profile Dropdown */}
      <UserProfileDropdown />
    </header>
  )
}

export default Header
