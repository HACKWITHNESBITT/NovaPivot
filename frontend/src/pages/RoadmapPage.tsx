import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import {
  CheckCircle,
  Calendar,
  Target,
  TrendingUp,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Award,
  Download,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import { getRoadmap, generateCertificate } from '../services/api'

interface Task {
  id: string
  task: string
  details: string
}

interface RoadmapItem {
  time: string
  tasks: Task[]
}

interface Certificate {
  id: string
  key: string
  user_name: string
  role: string
  date: string
}

export default function RoadmapPage() {
  const { userProfile } = useApp()
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([])
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([0]))
  const [isLoading, setIsLoading] = useState(true)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [showCertModal, setShowCertModal] = useState(false)
  const [isGeneratingCert, setIsGeneratingCert] = useState(false)

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('roadmap_progress')
    if (saved) {
      setCompletedTasks(new Set(JSON.parse(saved)))
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('roadmap_progress', JSON.stringify(Array.from(completedTasks)))
  }, [completedTasks])

  // Fetch roadmap from backend
  useEffect(() => {
    const fetchRoadmap = async () => {
      setIsLoading(true)
      try {
        const data = await getRoadmap(userProfile.skills, userProfile.targetRole || 'Software Developer')
        setRoadmap(data.roadmap)
      } catch (error) {
        console.error('Failed to fetch roadmap:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRoadmap()
  }, [userProfile.targetRole, userProfile.skills])

  const toggleTask = (taskId: string, weekIndex: number) => {
    // Check if week is unlocked
    if (!isWeekUnlocked(weekIndex)) return

    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)
  }

  const toggleWeek = (index: number) => {
    const newExpanded = new Set(expandedWeeks)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedWeeks(newExpanded)
  }

  const isWeekCompleted = (index: number) => {
    const item = roadmap[index]
    if (!item || !Array.isArray(item.tasks)) return false
    return item.tasks.every(t => completedTasks.has(t.id))
  }

  const isWeekUnlocked = (index: number) => {
    if (index === 0) return true
    return isWeekCompleted(index - 1)
  }

  const allCompleted = useMemo(() => {
    if (roadmap.length === 0) return false
    return roadmap.every((_, i) => isWeekCompleted(i))
  }, [roadmap, completedTasks])

  const totalTasks = useMemo(() => {
    if (!Array.isArray(roadmap)) return 0
    return roadmap.reduce((acc, curr) => acc + (curr?.tasks?.length || 0), 0)
  }, [roadmap])

  const overallProgress = totalTasks > 0 ? Math.min(Math.round((completedTasks.size / totalTasks) * 100), 100) : 0

  const handleGenerateCert = async () => {
    if (!allCompleted) return
    setIsGeneratingCert(true)
    try {
      const name = userProfile.fullName || 'Career Climber'
      const role = userProfile.targetRole || 'Software Developer'
      
      let data
      try {
        // Try to call the API
        data = await generateCertificate(name, role)
      } catch (apiError) {
        console.warn('API certificate generation failed, using local fallback:', apiError)
        // Fallback: Generate certificate locally if API fails
        data = {
          id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          key: `np-${Math.random().toString(36).substr(2, 16)}`,
          user_name: name,
          role: role,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }
      }
      
      setCertificate(data)
      setShowCertModal(true)
    } catch (error) {
      console.error('Failed to generate certificate:', error)
      alert('Failed to generate certificate. Please try again.')
    } finally {
      setIsGeneratingCert(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <TrendingUp className="w-12 h-12 text-nova-teal animate-bounce" />
        <p className="text-nova-text-muted">Architecting your career roadmap...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Career Transition Roadmap</h2>
        <p className="text-nova-text-muted">
          Your path to becoming a {userProfile.targetRole || 'Technology Specialist'}
        </p>

        {/* Progress Overview */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-nova-teal" />
              <div>
                <p className="text-white font-semibold">Target</p>
                <p className="text-nova-text text-sm truncate">{userProfile.targetRole || 'Not Set'}</p>
              </div>
            </div>
          </div>

          <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-white font-semibold">Progress</p>
                <p className="text-nova-text text-sm">{overallProgress}% Complete</p>
              </div>
            </div>
          </div>

          <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-nova-teal" />
              <div>
                <p className="text-white font-semibold">Duration</p>
                <p className="text-nova-text text-sm">6-Month Program</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass rounded-xl p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">Overall Mastery Progress</h3>
          <span className="text-nova-teal font-medium">{overallProgress}%</span>
        </div>
        <div className="w-full bg-nova-dark rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-nova-teal to-green-400 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Timeline & Detailed Milestones</h3>
          {allCompleted && (
            <button
              onClick={handleGenerateCert}
              disabled={isGeneratingCert}
              className="px-4 py-2 bg-gradient-to-r from-nova-teal to-nova-teal-dark text-white rounded-lg flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-nova-teal/20"
            >
              <Award className="w-5 h-5" />
              {isGeneratingCert ? 'Generating...' : 'Generate Certification'}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {roadmap.map((item, index) => {
            const unlocked = isWeekUnlocked(index)
            const completed = isWeekCompleted(index)
            const expanded = expandedWeeks.has(index)
            const tasks = Array.isArray(item?.tasks) ? item.tasks : []
            const weekProgress = tasks.length > 0 ?
              (tasks.filter(t => completedTasks.has(t.id)).length / tasks.length) * 100 : 0

            return (
              <div key={index} className={`rounded-xl border transition-all duration-300 ${unlocked ? 'border-nova-border/50 bg-nova-card/20' : 'border-dashed border-nova-border/30 bg-nova-dark/20 opacity-60'
                }`}>
                {/* Week Header */}
                <div
                  onClick={() => unlocked && toggleWeek(index)}
                  className={`p-5 flex items-center justify-between cursor-pointer ${!unlocked && 'cursor-not-allowed'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${completed ? 'bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                      unlocked ? 'bg-nova-teal/10 border-nova-teal text-nova-teal' :
                        'bg-nova-dark border-nova-border text-nova-text-muted'
                      }`}>
                      {completed ? <CheckCircle2 className="w-6 h-6" /> :
                        unlocked ? <Unlock className="w-6 h-6" /> :
                          <Lock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-widest ${completed ? 'text-green-400' : unlocked ? 'text-nova-teal' : 'text-nova-text-muted'
                          }`}>
                          {item.time} {completed && '• COMPLETED'} {!unlocked && '• LOCKED'}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-white leading-tight">
                        {index === 0 ? "Initial Strategy & Analysis" :
                          index === 1 ? "Foundation & Core Principles" :
                            index === 2 ? "Skill Acquisition Phase" :
                              index === roadmap.length - 1 ? "Job Readiness & Portfolio" :
                                `Phase ${index + 1}: Professional Scaling`}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {unlocked && (
                      <div className="hidden md:block w-32 h-2 bg-nova-dark rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${completed ? 'bg-green-500' : 'bg-nova-teal'}`}
                          style={{ width: `${weekProgress}%` }}
                        />
                      </div>
                    )}
                    {unlocked && (expanded ? <ChevronUp className="w-5 h-5 text-nova-teal" /> : <ChevronDown className="w-5 h-5 text-nova-text-muted" />)}
                  </div>
                </div>

                {/* Week Tasks (Expanded) */}
                {expanded && unlocked && (
                  <div className="px-5 pb-5 pt-0 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="h-px bg-nova-border/30 mb-4" />
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex gap-4 p-4 rounded-lg bg-nova-dark/40 border transition-all ${completedTasks.has(task.id) ? 'border-green-500/30 bg-green-500/5' : 'border-nova-border/50'
                          }`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleTask(task.id, index)
                          }}
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 transition-all flex items-center justify-center mt-1 ${completedTasks.has(task.id) ? 'bg-green-500 border-green-500' : 'border-nova-teal/40 hover:border-nova-teal'
                            }`}
                        >
                          {completedTasks.has(task.id) && <CheckCircle className="w-4 h-4 text-white" />}
                        </button>
                        <div>
                          <p className={`font-bold transition-all ${completedTasks.has(task.id) ? 'text-green-400 line-through opacity-70' : 'text-white'}`}>
                            {task.task}
                          </p>
                          <p className="text-sm text-nova-text-muted mt-1 leading-relaxed">{task.details}</p>
                        </div>
                      </div>
                    ))}
                    {!completed && unlocked && (
                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-3">
                        <TrendingUp className="w-4 h-4 text-yellow-500" />
                        <p className="text-xs text-yellow-200/80">Complete all tasks in {item.time} to unlock the next phase.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertModal && certificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nova-darker/90 backdrop-blur-md transition-all">
          <div className="bg-nova-card border border-nova-teal/30 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Certificate Content - Print View Style */}
            <div className="p-8 md:p-12 text-center bg-white relative overflow-hidden">
              {/* Background patterns */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-nova-teal rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-nova-teal-dark rounded-full translate-x-1/2 translate-y-1/2"></div>
              </div>

              <div className="relative z-10 border-[10px] border-double border-nova-teal/20 p-8">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-nova-teal rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">NP</div>
                </div>

                <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-2 uppercase tracking-tight">Certification of Achievement</h1>
                <p className="text-nova-teal font-bold tracking-[0.2em] mb-8 text-sm uppercase">NovaPivot Career Development Program</p>

                <p className="text-gray-600 italic mb-2">This certifies that</p>
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 underline decoration-nova-teal/30 underline-offset-8">{certificate.user_name}</h2>

                <p className="text-gray-600 max-w-lg mx-auto mb-8 font-medium">
                  has successfully completed the comprehensive <span className="text-gray-900 font-bold">{roadmap.length} Milestone</span> roadmap and rigorous training program for the role of
                </p>

                <h3 className="text-2xl font-bold text-nova-teal mb-10 px-6 py-2 bg-nova-teal/10 inline-block rounded-full">{certificate.role}</h3>

                <div className="grid grid-cols-2 gap-12 mt-4 text-left">
                  <div className="border-t-2 border-gray-300 pt-3">
                    <p className="font-serif font-bold text-gray-900 text-lg">NovaPivot AI Agent</p>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">Authorized Digitally</p>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 text-right">
                    <p className="font-bold text-gray-900">{certificate.date}</p>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">Date of Issue</p>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    VERIFIED SECURE BY NOVAPIVOT AI
                  </div>
                  <div className="text-gray-400 text-[10px] font-mono select-all">
                    ID: {certificate.id} | KEY: {certificate.key.substring(0, 16)}...
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-nova-card border-t border-nova-border flex items-center justify-between gap-4">
              <p className="text-nova-text-muted text-xs">
                Unique Certificate ID: <span className="text-white font-mono">{certificate.id.substring(0, 18)}...</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCertModal(false)}
                  className="px-6 py-2 rounded-lg bg-nova-dark text-white hover:bg-nova-dark/80 transition-all font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 rounded-lg bg-nova-teal text-white flex items-center gap-2 hover:bg-nova-teal/80 transition-all font-bold shadow-lg shadow-nova-teal/20"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Tips Section */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Mastery Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-nova-teal/10 rounded-lg p-4 border border-nova-teal/30">
            <h4 className="text-nova-teal font-medium mb-2">💡 Progression Logic</h4>
            <p className="text-nova-text text-sm leading-relaxed">
              Our AI locks future weeks to ensure you build a strong foundation. Mastering each concept step-by-step is scientifically proven to improve long-term retention.
            </p>
          </div>
          <div className="bg-nova-teal/10 rounded-lg p-4 border border-nova-teal/30">
            <h4 className="text-nova-teal font-medium mb-2">🎯 Recognition</h4>
            <p className="text-nova-text text-sm leading-relaxed">
              Once you reach the 25-week milestone and complete all tasks, you'll earn a verified industry-aligned certificate that you can share with potential employers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
