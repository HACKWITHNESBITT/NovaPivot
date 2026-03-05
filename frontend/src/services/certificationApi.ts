const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || `http://${window.location.hostname}:8000`

import type {
  GenerateAssessmentRequest,
  SubmitAssessmentRequest,
  AssessmentQuestion,
  AssessmentEvaluation,
  Topic,
  UserRoadmapProgress
} from '../types/certification'

/**
 * Generate assessment questions for a topic via Nova API
 */
export async function generateAssessment(
  request: GenerateAssessmentRequest
): Promise<{ questions: AssessmentQuestion[] }> {
  const response = await fetch(`${API_BASE_URL}/assessment/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error(`Failed to generate assessment: ${response.status}`)
  }

  const data = await response.json()
  
  // Validate response format - must have exactly 3 questions
  if (!data.questions || !Array.isArray(data.questions) || data.questions.length !== 3) {
    throw new Error('Invalid assessment format: expected exactly 3 questions')
  }

  return data
}

/**
 * Submit answers for evaluation
 */
export async function submitAssessment(
  request: SubmitAssessmentRequest
): Promise<AssessmentEvaluation> {
  const response = await fetch(`${API_BASE_URL}/assessment/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error(`Failed to submit assessment: ${response.status}`)
  }

  const data = await response.json()
  
  // Validate evaluation format
  if (!data.totalScore || !data.percentage || !data.status || !data.evaluations) {
    throw new Error('Invalid evaluation format from server')
  }

  return data
}

/**
 * Get user's roadmap progress
 */
export async function getRoadmapProgress(
  userId: string,
  targetRole: string
): Promise<UserRoadmapProgress> {
  const response = await fetch(
    `${API_BASE_URL}/roadmap/progress?userId=${userId}&targetRole=${encodeURIComponent(targetRole)}`
  )

  if (!response.ok) {
    throw new Error(`Failed to get progress: ${response.status}`)
  }

  return response.json()
}

/**
 * Update topic completion and unlock next topic
 */
export async function completeTopic(
  userId: string,
  topicId: string,
  score: number,
  percentage: number
): Promise<{ success: boolean; nextTopicUnlocked?: Topic }> {
  const response = await fetch(`${API_BASE_URL}/roadmap/complete-topic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      topicId,
      score,
      percentage,
      passed: percentage >= 70
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to complete topic: ${response.status}`)
  }

  return response.json()
}

/**
 * Initialize roadmap with all topics locked except first
 */
export async function initializeRoadmap(
  userId: string,
  targetRole: string,
  roadmapData: any
): Promise<UserRoadmapProgress> {
  const response = await fetch(`${API_BASE_URL}/roadmap/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      targetRole,
      roadmapData
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to initialize roadmap: ${response.status}`)
  }

  return response.json()
}

/**
 * Store failed attempt for retry tracking
 */
export async function storeAttempt(
  userId: string,
  topicId: string,
  evaluation: AssessmentEvaluation
): Promise<void> {
  await fetch(`${API_BASE_URL}/roadmap/store-attempt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      topicId,
      score: evaluation.totalScore,
      percentage: evaluation.percentage,
      passed: evaluation.status === 'passed',
      timestamp: new Date().toISOString()
    })
  })
}
