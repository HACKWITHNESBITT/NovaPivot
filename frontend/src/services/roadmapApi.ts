const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || `http://${window.location.hostname}:8000`

import type { DetailedRoadmap, RoadmapPhase } from '../types/roadmap'

/**
 * Generate a detailed, role-specific roadmap with phases and documentation
 */
export async function generateDetailedRoadmap(
  targetRole: string,
  skills: string[],
  experienceLevel: string = 'entry',
  timeframeMonths: number = 6
): Promise<DetailedRoadmap> {
  const response = await fetch(`${API_BASE_URL}/roadmap/detailed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      target_role: targetRole,
      skills,
      experience_level: experienceLevel,
      timeframe_months: timeframeMonths
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to generate roadmap: ${response.status}`)
  }

  const data = await response.json()
  return data.roadmap
}

/**
 * Get phase-specific assessment
 */
export async function getPhaseAssessment(
  phaseName: string,
  targetRole: string,
  phaseSkills: string[]
): Promise<{ questions: any[] }> {
  const response = await fetch(`${API_BASE_URL}/assessment/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      targetRole,
      roadmapPhase: phaseName,
      weekRange: 'Phase Assessment',
      skillArea: phaseSkills.join(', '),
      topicName: `${phaseName} - ${targetRole}`
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to generate assessment: ${response.status}`)
  }

  return response.json()
}
