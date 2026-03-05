import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { Send, Bot, User, Play, RotateCcw, MessageSquare, Mic, MicOff, Video } from 'lucide-react'

interface InterviewMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface InterviewQuestion {
  question: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tips: string[]
}

export default function InterviewPage() {
  const { userProfile } = useApp()
  const [messages, setMessages] = useState<InterviewMessage[]>([])
  const [input, setInput] = useState('')
  const [started, setStarted] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock interview questions based on target role
  const interviewQuestions: InterviewQuestion[] = [
    {
      question: `Tell me about your experience as a ${userProfile.targetRole || 'professional'}.`,
      category: 'Introduction',
      difficulty: 'Easy',
      tips: ['Be concise', 'Highlight relevant experience', 'Show enthusiasm']
    },
    {
      question: 'What makes you interested in this position and our company?',
      category: 'Motivation',
      difficulty: 'Easy',
      tips: ['Research the company', 'Align with company values', 'Show genuine interest']
    },
    {
      question: 'Describe a challenging project you worked on and how you handled it.',
      category: 'Behavioral',
      difficulty: 'Medium',
      tips: ['Use STAR method', 'Focus on problem-solving', 'Show results']
    },
    {
      question: 'How do you stay current with industry trends and technologies?',
      category: 'Professional Development',
      difficulty: 'Medium',
      tips: ['Mention specific resources', 'Show continuous learning', 'Give examples']
    },
    {
      question: 'Where do you see yourself in 5 years?',
      category: 'Career Goals',
      difficulty: 'Medium',
      tips: ['Be realistic but ambitious', 'Align with role', 'Show growth mindset']
    },
    {
      question: 'How would you handle a disagreement with a team member?',
      category: 'Teamwork',
      difficulty: 'Hard',
      tips: ['Focus on collaboration', 'Show emotional intelligence', 'Provide examples']
    }
  ]

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startInterview = () => {
    setStarted(true)
    setMessages([
      {
        role: 'assistant',
        content: `Welcome to your mock interview for the ${userProfile.targetRole || 'position'} role! I'll be asking you some questions to help you prepare. Take your time to answer each question thoughtfully. Let's begin with our first question:`,
        timestamp: new Date()
      }
    ])
    
    setTimeout(() => {
      addQuestion()
    }, 2000)
  }

  const addQuestion = () => {
    const question = interviewQuestions[currentQuestionIndex]
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `**${question.category} Question:** ${question.question}`,
      timestamp: new Date()
    }])
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setTimeout(() => addQuestion(), 1000)
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Great job! You\'ve completed all the interview questions. Review your answers and practice again to improve. Remember to speak clearly, maintain eye contact, and show confidence!',
        timestamp: new Date()
      }])
    }
  }

  const generateFeedback = (userAnswer: string) => {
    const question = interviewQuestions[currentQuestionIndex]
    const answerLength = userAnswer.length
    
    let feedback = `**Feedback on your answer:**\n\n`
    
    if (answerLength < 50) {
      feedback += '⚠️ Your answer seems a bit short. Consider providing more specific examples and details.\n\n'
    } else if (answerLength > 500) {
      feedback += '✅ Good detailed answer! Try to be a bit more concise in real interviews.\n\n'
    } else {
      feedback += '✅ Good length for your answer. Clear and concise.\n\n'
    }
    
    feedback += `**Tips for this question type:**\n`
    question.tips.forEach(tip => {
      feedback += `• ${tip}\n`
    })
    
    feedback += `\n**Suggestions for improvement:**\n`
    feedback += '• Try to use the STAR method (Situation, Task, Action, Result)\n'
    feedback += '• Include specific metrics and achievements when possible\n'
    feedback += '• Maintain confident body language and eye contact\n'
    
    return feedback
  }

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage: InterviewMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI processing and feedback
    setTimeout(() => {
      const feedback = generateFeedback(input)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: feedback,
        timestamp: new Date()
      }])
      setIsLoading(false)
    }, 2000)
  }

  const resetInterview = () => {
    setMessages([])
    setStarted(false)
    setCurrentQuestionIndex(0)
    setInput('')
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Start recording logic here
      setTimeout(() => {
        setIsRecording(false)
        setInput('This is a sample answer from voice recording. In a real implementation, this would be transcribed from your speech.')
      }, 3000)
    }
  }

  const currentQuestion = interviewQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / interviewQuestions.length) * 100

  if (!started) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-xl p-8 text-center">
          <MessageSquare className="w-16 h-16 text-nova-teal mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Mock Interview Practice</h2>
          <p className="text-nova-text-muted mb-6">
            Practice your interview skills with AI-powered feedback. Get ready for your {userProfile.targetRole || 'target role'} interviews.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
              <h4 className="text-nova-teal font-medium mb-2">🎯 Role-Specific Questions</h4>
              <p className="text-nova-text text-sm">
                Questions tailored for {userProfile.targetRole || 'your target role'}
              </p>
            </div>
            <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
              <h4 className="text-nova-teal font-medium mb-2">💬 Instant Feedback</h4>
              <p className="text-nova-text text-sm">
                Get AI-powered feedback on your answers
              </p>
            </div>
            <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
              <h4 className="text-nova-teal font-medium mb-2">📈 Progress Tracking</h4>
              <p className="text-nova-text text-sm">
                Track your improvement over time
              </p>
            </div>
          </div>
          
          <button
            onClick={startInterview}
            className="flex items-center gap-2 px-6 py-3 bg-nova-teal text-white rounded-lg hover:bg-nova-teal/80 transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Interview
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Mock Interview</h2>
            <p className="text-nova-text-muted">
              {userProfile.targetRole || 'Position'} Interview Practice
            </p>
          </div>
          <button
            onClick={resetInterview}
            className="flex items-center gap-2 px-4 py-2 bg-nova-card border border-nova-border rounded-lg text-nova-text hover:border-nova-teal/50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-nova-dark rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-nova-teal to-green-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-nova-text-muted text-sm">Question {currentQuestionIndex + 1} of {interviewQuestions.length}</span>
          <span className="text-nova-teal text-sm font-medium">{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Video Controls */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                videoEnabled ? 'bg-nova-teal text-white' : 'bg-nova-card border border-nova-border text-nova-text'
              }`}
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                audioEnabled ? 'bg-nova-teal text-white' : 'bg-nova-card border border-nova-border text-nova-text'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-nova-text-muted">Camera & Mic Simulation</span>
            <div className={`w-2 h-2 rounded-full ${videoEnabled && audioEnabled ? 'bg-green-400' : 'bg-red-400'}`} />
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="glass rounded-xl p-6">
        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' ? 'bg-nova-teal' : 'bg-nova-card border border-nova-border'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-nova-teal" />
                )}
              </div>
              <div className={`max-w-md p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-nova-teal text-white' 
                  : 'bg-nova-card/50 border border-nova-border text-nova-text'
              }`}>
                <div className="whitespace-pre-line">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-nova-card border border-nova-border flex items-center justify-center">
                <Bot className="w-4 h-4 text-nova-teal" />
              </div>
              <div className="bg-nova-card/50 border border-nova-border rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-nova-teal rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-nova-teal rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-nova-teal rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your answer here..."
            className="flex-1 px-4 py-2 bg-nova-card border border-nova-border rounded-lg text-nova-text focus:outline-none focus:border-nova-teal/50"
            disabled={loading}
          />
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-nova-card border border-nova-border text-nova-text hover:border-nova-teal/50'
            }`}
            disabled={loading}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-2 bg-nova-teal text-white rounded-lg hover:bg-nova-teal/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Current Question Info */}
      {currentQuestion && (
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Question Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
              <h4 className="text-nova-teal font-medium mb-2">Category</h4>
              <p className="text-nova-text">{currentQuestion.category}</p>
            </div>
            <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
              <h4 className="text-nova-teal font-medium mb-2">Difficulty</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                currentQuestion.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                currentQuestion.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            <div className="bg-nova-card/50 rounded-lg p-4 border border-nova-border">
              <h4 className="text-nova-teal font-medium mb-2">Tips</h4>
              <ul className="text-nova-text text-sm space-y-1">
                {currentQuestion.tips.map((tip, index) => (
                  <li key={index} className="text-xs">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <button
            onClick={nextQuestion}
            className="mt-4 px-6 py-2 bg-nova-teal text-white rounded-lg hover:bg-nova-teal/80 transition-colors"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  )
}
