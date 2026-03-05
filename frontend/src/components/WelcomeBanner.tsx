import { Rocket, Sparkles } from 'lucide-react'

function WelcomeBanner() {
  return (
    <div className="mb-4 sm:mb-6 glass rounded-xl p-4 sm:p-6 border border-nova-border relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-nova-teal/20 to-nova-teal-dark/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-nova-teal to-nova-teal-dark flex items-center justify-center">
            <Rocket className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-white">Welcome to NovaPivot</h1>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-nova-teal" />
        </div>
        
        <p className="text-nova-text text-sm sm:text-base leading-relaxed max-w-2xl">
          Your personalized AI guide for navigating career changes, analyzing your skills, 
          and charting a new professional path. Let's explore your possibilities together.
        </p>
        
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
          <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-nova-teal/10 border border-nova-teal/30 text-nova-teal text-xs">
            AI-Powered
          </span>
          <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-nova-teal/10 border border-nova-teal/30 text-nova-teal text-xs">
            Skill Analysis
          </span>
          <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full bg-nova-teal/10 border border-nova-teal/30 text-nova-teal text-xs">
            Career Roadmaps
          </span>
        </div>
      </div>
    </div>
  )
}

export default WelcomeBanner
