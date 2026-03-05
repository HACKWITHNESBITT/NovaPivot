import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import {
  CheckCircle,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  Play,
  RotateCcw,
  FileQuestion,
  Target
} from 'lucide-react'
import { generateAssessment, submitAssessment, completeTopic, storeAttempt } from '../services/certificationApi'
import type { Topic, AssessmentQuestion, AssessmentEvaluation } from '../types/certification'

interface AssessmentModalProps {
  topic: Topic
  questions: AssessmentQuestion[]
  onSubmit: (answers: string[]) => void
  onClose: () => void
}

function AssessmentModal({ topic, questions, onSubmit, onClose }: AssessmentModalProps) {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''))
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleSubmit = () => {
    if (answers.some(a => a.trim() === '')) {
      alert('Please answer all questions before submitting')
      return
    }
    onSubmit(answers)
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-nova-teal/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-nova-teal/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-nova-white">Assessment</h2>
              <p className="text-nova-gray mt-1">{topic.title}</p>
            </div>
            <button onClick={onClose} className="text-nova-gray hover:text-nova-white transition-colors">
              ✕
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-full transition-all ${
                  idx < currentQuestion
                    ? 'bg-green-500'
                    : idx === currentQuestion
                    ? 'bg-nova-teal'
                    : 'bg-nova-dark'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 text-sm text-nova-teal">
            <span className="px-2 py-1 bg-nova-teal/10 rounded capitalize">{currentQ.type}</span>
            <span className="px-2 py-1 bg-nova-teal/10 rounded capitalize">{currentQ.difficulty}</span>
            <span className="text-nova-gray">Question {currentQuestion + 1} of {questions.length}</span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-nova-white mb-4">{currentQ.question}</h3>
            <textarea
              value={answers[currentQuestion]}
              onChange={(e) => {
                const newAnswers = [...answers]
                newAnswers[currentQuestion] = e.target.value
                setAnswers(newAnswers)
              }}
              className="w-full h-40 bg-nova-dark border border-nova-teal/20 rounded-xl p-4 text-nova-white placeholder-nova-gray focus:border-nova-teal focus:outline-none resize-none"
              placeholder="Enter your answer here..."
            />
          </div>

          <div className="bg-nova-dark/50 rounded-lg p-4 border border-nova-teal/10">
            <p className="text-sm text-nova-gray mb-2">Expected in answer:</p>
            <ul className="text-sm text-nova-gray space-y-1">
              {currentQ.expectedCriteria.map((criterion, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-nova-teal mt-1">•</span>
                  {criterion}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-nova-gray hover:text-nova-white disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-6 py-2 bg-nova-teal/20 text-nova-teal rounded-lg hover:bg-nova-teal/30 transition-colors"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-nova-teal text-nova-dark font-semibold rounded-lg hover:bg-nova-teal/90 transition-colors"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ResultsModalProps {
  evaluation: AssessmentEvaluation
  topic: Topic
  onRetry: () => void
  onContinue: () => void
  onClose: () => void
}

function ResultsModal({ evaluation, topic, onRetry, onContinue, onClose }: ResultsModalProps) {
  const passed = evaluation.status === 'passed'

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-nova-teal/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`p-6 border-b ${passed ? 'border-green-500/30' : 'border-red-500/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${passed ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {passed ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                  {passed ? '✅ PASSED' : '❌ FAILED'}
                </h2>
                <p className="text-nova-gray mt-1">
                  Score: {evaluation.totalScore}/30 ({evaluation.percentage}%)
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-nova-gray hover:text-nova-white transition-colors">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {!passed && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 font-medium">
                You need 70% to pass. You scored {evaluation.percentage}%.
              </p>
              <p className="text-nova-gray text-sm mt-1">
                Study the feedback below and retry with new questions focusing on your weak areas.
              </p>
            </div>
          )}

          <h3 className="text-lg font-semibold text-nova-white">Detailed Feedback</h3>
          
          {evaluation.evaluations.map((result, idx) => (
            <div
              key={idx}
              className={`border rounded-lg p-4 ${
                result.result === 'correct'
                  ? 'border-green-500/30 bg-green-500/5'
                  : result.result === 'partial'
                  ? 'border-yellow-500/30 bg-yellow-500/5'
                  : 'border-red-500/30 bg-red-500/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-nova-white">Question {result.questionId}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${
                    result.result === 'correct'
                      ? 'text-green-400'
                      : result.result === 'partial'
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}>
                    {result.result === 'correct' ? '✓ Correct' : result.result === 'partial' ? '◐ Partial' : '✗ Incorrect'}
                  </span>
                  <span className="text-nova-gray">{result.score}/10</span>
                </div>
              </div>
              <p className="text-nova-gray text-sm">{result.feedback}</p>
              {result.modelAnswer && (
                <div className="mt-3 p-3 bg-nova-dark rounded-lg">
                  <p className="text-sm text-green-400 font-medium mb-1">Model Answer:</p>
                  <p className="text-sm text-nova-gray">{result.modelAnswer}</p>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            {!passed && (
              <button
                onClick={onRetry}
                className="px-6 py-2 bg-nova-teal/20 text-nova-teal rounded-lg hover:bg-nova-teal/30 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Assessment
              </button>
            )}
            {passed && (
              <button
                onClick={onContinue}
                className="px-6 py-2 bg-green-500 text-nova-dark font-semibold rounded-lg hover:bg-green-400 transition-colors"
              >
                Continue to Next Topic →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CertificationRoadmapPage() {
  const { userProfile } = useApp()
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  
  // Assessment state
  const [activeAssessment, setActiveAssessment] = useState<{
    topic: Topic
    questions: AssessmentQuestion[]
  } | null>(null)
  const [assessmentResults, setAssessmentResults] = useState<AssessmentEvaluation | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Generate initial topics from roadmap data
  useEffect(() => {
    const generateTopics = async () => {
      setLoading(true)
      try {
        // In production, fetch from backend. For now, generate from localStorage or API
        const saved = localStorage.getItem('certification_topics')
        if (saved) {
          setTopics(JSON.parse(saved))
        } else {
          // Initialize with default structure - first topic unlocked
          const defaultTopics: Topic[] = [
            {
              id: 'topic-1',
              title: 'Git Fundamentals',
              skillArea: 'Version Control',
              phase: 'Foundation',
              weekRange: 'Week 1-2',
              order: 1,
              isLocked: false,
              isCompleted: false
            },
            {
              id: 'topic-2',
              title: 'Branching & Merging',
              skillArea: 'Version Control',
              phase: 'Foundation',
              weekRange: 'Week 3-4',
              order: 2,
              isLocked: true,
              isCompleted: false
            },
            {
              id: 'topic-3',
              title: 'Pull Request Workflows',
              skillArea: 'Version Control',
              phase: 'Foundation',
              weekRange: 'Week 5-6',
              order: 3,
              isLocked: true,
              isCompleted: false
            }
          ]
          setTopics(defaultTopics)
          localStorage.setItem('certification_topics', JSON.stringify(defaultTopics))
        }
      } catch (error) {
        console.error('Failed to load topics:', error)
      } finally {
        setLoading(false)
      }
    }

    generateTopics()
  }, [userProfile.targetRole])

  // Persist topics to localStorage
  useEffect(() => {
    if (topics.length > 0) {
      localStorage.setItem('certification_topics', JSON.stringify(topics))
    }
  }, [topics])

  const handleStartAssessment = async (topic: Topic) => {
    if (topic.isLocked || topic.isCompleted) return

    try {
      setLoading(true)
      const response = await generateAssessment({
        targetRole: userProfile.targetRole || 'Software Developer',
        roadmapPhase: topic.phase,
        weekRange: topic.weekRange,
        skillArea: topic.skillArea,
        topicName: topic.title
      })

      setActiveAssessment({
        topic,
        questions: response.questions
      })
    } catch (error) {
      console.error('Failed to generate assessment:', error)
      alert('Failed to generate assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAssessment = async (answers: string[]) => {
    if (!activeAssessment) return

    setSubmitting(true)
    try {
      const evaluation = await submitAssessment({
        topicId: activeAssessment.topic.id,
        targetRole: userProfile.targetRole || 'Software Developer',
        questions: activeAssessment.questions,
        answers
      })

      setAssessmentResults(evaluation)
      setActiveAssessment(null)

      // If failed, store attempt
      if (evaluation.status === 'failed') {
        await storeAttempt('user-123', activeAssessment.topic.id, evaluation)
      }
    } catch (error) {
      console.error('Failed to submit assessment:', error)
      alert('Failed to submit assessment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePassComplete = async () => {
    if (!assessmentResults) return

    const currentTopic = topics.find(t => t.id === activeAssessment?.topic.id || assessmentResults.evaluations[0]?.questionId.toString().split('-')[0])
    if (!currentTopic) return

    try {
      await completeTopic(
        'user-123',
        currentTopic.id,
        assessmentResults.totalScore,
        assessmentResults.percentage
      )

      // Update local state - mark current as completed and unlock next
      setTopics(prev => prev.map((t, idx) => {
        if (t.id === currentTopic.id) {
          return { ...t, isCompleted: true, score: assessmentResults.percentage }
        }
        // Unlock next topic
        if (t.order === currentTopic.order + 1) {
          return { ...t, isLocked: false }
        }
        return t
      }))

      setAssessmentResults(null)
    } catch (error) {
      console.error('Failed to complete topic:', error)
    }
  }

  const handleRetry = () => {
    setAssessmentResults(null)
    // Re-open assessment with new questions for weak areas
    if (activeAssessment?.topic) {
      handleStartAssessment(activeAssessment.topic)
    }
  }

  const getTopicStatus = (topic: Topic) => {
    if (topic.isCompleted) return 'completed'
    if (topic.isLocked) return 'locked'
    return 'unlocked'
  }

  const completedCount = topics.filter(t => t.isCompleted).length
  const progress = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0

  if (loading && topics.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nova-teal"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nova-white">Certification Roadmap</h1>
          <p className="text-nova-gray mt-1">
            Complete assessments to unlock topics. 70% required to pass.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-nova-teal">{progress}%</div>
            <div className="text-sm text-nova-gray">Complete</div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-nova-dark relative">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-nova-teal"
                strokeDasharray={`${progress * 1.76} 176`}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-nova-dark rounded-xl p-6 border border-nova-teal/20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-nova-white font-medium">Overall Progress</span>
          <span className="text-nova-teal">{completedCount} / {topics.length} Topics</span>
        </div>
        <div className="w-full bg-nova-dark rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-nova-teal to-green-400 h-3 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        {topics.map((topic) => {
          const status = getTopicStatus(topic)
          const isExpanded = expandedTopic === topic.id

          return (
            <div
              key={topic.id}
              className={`border rounded-xl overflow-hidden transition-all ${
                status === 'completed'
                  ? 'border-green-500/30 bg-green-500/5'
                  : status === 'locked'
                  ? 'border-nova-gray/20 bg-nova-dark/30 opacity-60'
                  : 'border-nova-teal/30 bg-nova-dark/50'
              }`}
            >
              <button
                onClick={() => status !== 'locked' && setExpandedTopic(isExpanded ? null : topic.id)}
                className="w-full p-6 flex items-center gap-4"
              >
                <div className={`p-3 rounded-full ${
                  status === 'completed'
                    ? 'bg-green-500/20'
                    : status === 'locked'
                    ? 'bg-nova-gray/20'
                    : 'bg-nova-teal/20'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : status === 'locked' ? (
                    <Lock className="w-6 h-6 text-nova-gray" />
                  ) : (
                    <Unlock className="w-6 h-6 text-nova-teal" />
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-semibold ${
                      status === 'locked' ? 'text-nova-gray' : 'text-nova-white'
                    }`}>
                      {topic.title}
                    </h3>
                    <span className="px-2 py-0.5 bg-nova-teal/10 text-nova-teal text-xs rounded">
                      {topic.phase}
                    </span>
                  </div>
                  <p className="text-sm text-nova-gray mt-1">{topic.weekRange} • {topic.skillArea}</p>
                </div>

                <div className="flex items-center gap-4">
                  {topic.score !== undefined && (
                    <span className={`font-bold ${
                      topic.score >= 70 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {topic.score}%
                    </span>
                  )}
                  {status === 'unlocked' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartAssessment(topic)
                      }}
                      className="px-4 py-2 bg-nova-teal text-nova-dark font-semibold rounded-lg hover:bg-nova-teal/90 transition-colors flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start Assessment
                    </button>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-nova-gray" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-nova-gray" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-nova-teal/10">
                  <div className="flex items-center gap-3 text-nova-gray">
                    <FileQuestion className="w-5 h-5" />
                    <span>3 assessment questions required to unlock next topic</span>
                  </div>
                  {topic.attempts && topic.attempts > 0 && (
                    <p className="text-sm text-yellow-400 mt-2">
                      Previous attempts: {topic.attempts}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Certificate Section */}
      {progress === 100 && (
        <div className="bg-gradient-to-r from-nova-teal/20 to-green-500/20 border border-nova-teal/30 rounded-xl p-8 text-center">
          <Award className="w-16 h-16 text-nova-teal mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-nova-white mb-2">Congratulations!</h2>
          <p className="text-nova-gray mb-6">You've completed all topics in this certification path.</p>
          <button className="px-8 py-3 bg-nova-teal text-nova-dark font-bold rounded-xl hover:bg-nova-teal/90 transition-colors">
            Generate Certificate
          </button>
        </div>
      )}

      {/* Modals */}
      {activeAssessment && (
        <AssessmentModal
          topic={activeAssessment.topic}
          questions={activeAssessment.questions}
          onSubmit={handleSubmitAssessment}
          onClose={() => setActiveAssessment(null)}
        />
      )}

      {assessmentResults && activeAssessment && (
        <ResultsModal
          evaluation={assessmentResults}
          topic={activeAssessment.topic}
          onRetry={handleRetry}
          onContinue={handlePassComplete}
          onClose={() => setAssessmentResults(null)}
        />
      )}
    </div>
  )
}
