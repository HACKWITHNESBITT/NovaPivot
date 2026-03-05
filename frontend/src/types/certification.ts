/**
 * Gated Certification Roadmap Types
 * 
 * Each topic requires passing an AI assessment (70%+) before unlocking the next.
 * This enforces strict progression like a certification ladder.
 */

export type QuestionType = 'explanation' | 'code' | 'scenario' | 'architecture' | 'multiple_choice'
export type DifficultyLevel = 'easy' | 'medium' | 'hard'
export type TopicStatus = 'locked' | 'unlocked' | 'completed'

export interface AssessmentQuestion {
  id: number
  type: QuestionType
  difficulty: DifficultyLevel
  question: string
  expectedCriteria: string[]
}

export interface AssessmentResult {
  questionId: number
  score: number
  result: 'correct' | 'incorrect' | 'partial'
  feedback: string
  modelAnswer?: string
}

export interface AssessmentEvaluation {
  totalScore: number
  percentage: number
  status: 'passed' | 'failed'
  evaluations: AssessmentResult[]
}

export interface Topic {
  id: string
  title: string
  skillArea: string
  phase: string
  weekRange: string
  order: number
  isLocked: boolean
  isCompleted: boolean
  score?: number
  attempts?: number
  lastAttemptAt?: string
}

export interface UserRoadmapProgress {
  userId: string
  targetRole: string
  topics: Topic[]
  overallProgress: number
  createdAt: string
  updatedAt: string
}

export interface GenerateAssessmentRequest {
  targetRole: string
  roadmapPhase: string
  weekRange: string
  skillArea: string
  topicName: string
}

export interface SubmitAssessmentRequest {
  topicId: string
  targetRole: string
  questions: AssessmentQuestion[]
  answers: string[]
}

export interface UnlockNextTopicRequest {
  currentTopicId: string
  userId: string
}
