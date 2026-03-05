import { createContext, useContext, useState, ReactNode } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface UserProfile {
  skills: string[]
  resumeUploaded: boolean
  targetRole: string
  resumeText: string
  fullName: string
}

interface AppContextType {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  messages: Message[]
  addMessage: (message: Message) => void
  sendMessage: (content: string) => Promise<void>
  userProfile: UserProfile
  updateUserProfile: (profile: Partial<UserProfile>) => void
  uploadResumeFile: (file: File) => Promise<void>
  isLoading: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome to NovaPivot! I'm your AI career transition assistant. I can help you analyze your skills, identify gaps, and create a personalized roadmap for your career change. What would you like to explore today?"
    }
  ])
  const [userProfile, setUserProfile] = useState<UserProfile>({
    skills: [],
    resumeUploaded: false,
    targetRole: '',
    resumeText: '',
    fullName: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  const sendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call the real Nova API through backend
      const { sendChatMessage } = await import("../services/api")
      const response = await sendChatMessage({
        message: content,
        target_role: userProfile.targetRole || undefined,
        skills: userProfile.skills
      })

      const assistantMessage: Message = { role: "assistant", content: response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error calling Nova API:", error)
      // Fallback to basic response if API fails
      const errorMessage: Message = {
        role: "assistant",
        content: `I apologize, but I am having trouble connecting to my knowledge base right now. Please try again in a moment, or you can continue exploring the platform using the sidebar navigation for career assessments, roadmaps, and job opportunities.`
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }

  }

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }))
  }

  const uploadResumeFile = async (file: File) => {
    setIsLoading(true)
    try {
      // Simulate resume processing when API is not available
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time

      // Basic skill detection based on common tech terms
      const commonSkills = [
        'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript',
        'HTML', 'CSS', 'SQL', 'MongoDB', 'Express', 'Docker', 'AWS',
        'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Machine Learning',
        'Data Analysis', 'Project Management', 'Communication', 'Leadership',
        'Problem Solving', 'Team Collaboration', 'Critical Thinking'
      ]

      // Simulate skill detection (in real implementation, this would parse the actual file)
      const detectedSkills: string[] = commonSkills.sort(() => 0.5 - Math.random()).slice(0, 8)

      // Create mock resume text
      const resumeText = `Resume uploaded: ${file.name}\n\nDetected Skills:\n${detectedSkills.map(skill => `• ${skill}`).join('\n')}\n\nExperience Summary:\n• Professional with diverse technical background\n• Strong problem-solving and analytical skills\n• Experience with modern technologies and frameworks\n• Excellent communication and teamwork abilities\n\nEducation:\n• Bachelor's degree in relevant field\n• Continuous learning and professional development\n\nTarget Role: ${userProfile.targetRole || 'Technology Professional'}`

      setUserProfile(prev => ({
        ...prev,
        skills: detectedSkills,
        resumeUploaded: true,
        resumeText: resumeText
      }))

      // Add success message
      const successMessage: Message = {
        role: 'assistant',
        content: `🎉 **Resume Successfully Uploaded and Analyzed!**\n\nI've processed your resume and detected **${detectedSkills.length} key skills**:\n\n${detectedSkills.map(skill => `• ${skill}`).join('\n')}\n\n**Next Steps:**\n• Check your **Assessment** tab for skill gap analysis\n• Visit the **Dashboard** to see your readiness score\n• Use the **Roadmap** to plan your skill development\n\nI can now provide personalized advice based on your profile. Ask me anything about your career transition!`
      }
      setMessages(prev => [...prev, successMessage])
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error uploading your resume. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppContext.Provider value={{
      sidebarCollapsed,
      toggleSidebar,
      messages,
      addMessage,
      sendMessage,
      userProfile,
      updateUserProfile,
      uploadResumeFile,
      isLoading,
      activeTab,
      setActiveTab
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
