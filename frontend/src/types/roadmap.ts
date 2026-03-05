export interface RoleOverview {
  title: string
  description: string
  responsibilities: string[]
  industry_demand: 'high' | 'medium' | 'low'
  average_salary_range: string
}

export interface RoadmapStep {
  id: string
  title: string
  description: string
  deliverable: string
  resources: string[]
  time_estimate: string
}

export interface RoadmapPhase {
  id: string
  name: string
  order: number
  duration: string
  objective: string
  skills: string[]
  steps: RoadmapStep[]
  checkpoint: string
  deliverables: string[]
}

export interface SkillItem {
  skill: string
  level: 'beginner' | 'intermediate' | 'advanced'
  phase: number
  resources: string[]
  projects?: string[]
}

export interface ProjectItem {
  name: string
  description: string
  skills_practiced: string[]
  time_estimate: string
}

export interface Milestone {
  name: string
  description: string
  phase: number
  criteria?: string[]
}

export interface RoadmapResources {
  documentation: string[]
  courses: string[]
  books: string[]
  communities: string[]
  practice_platforms: string[]
}

export interface DetailedRoadmap {
  role_overview: RoleOverview
  phases: RoadmapPhase[]
  skill_progression: {
    technical: SkillItem[]
    soft_skills: string[]
    tools: string[]
    certifications: string[]
  }
  projects: {
    beginner: ProjectItem[]
    intermediate: ProjectItem[]
    advanced: ProjectItem[]
  }
  milestones: Milestone[]
  resources: RoadmapResources
  timeline: {
    total_duration: string
    weekly_commitment: string
    milestones_count: number
  }
}
