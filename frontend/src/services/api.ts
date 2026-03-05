const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || `http://${window.location.hostname}:8000`

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface UserProfile {
  skills: string[]
  resumeUploaded: boolean
  targetRole: string
  resumeText: string
}

export interface ChatRequest {
  message: string
  target_role?: string
  skills: string[]
}

export interface ResumeResponse {
  skills: string[]
  resume_text: string
  message: string
}

export async function sendChatMessage(request: ChatRequest): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error('Failed to send message')
  }

  const data = await response.json()
  return data.response
}

export async function uploadResume(file: File, targetRole?: string): Promise<ResumeResponse> {
  console.log('Starting upload for:', file.name, 'Size:', file.size, 'Type:', file.type)

  const formData = new FormData()
  formData.append('file', file)
  if (targetRole) {
    formData.append('target_role', targetRole)
  }

  const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || `http://${window.location.hostname}:8000`
  console.log('Uploading to:', `${API_BASE_URL}/upload-resume`)

  try {
    const response = await fetch(`${API_BASE_URL}/upload-resume`, {
      method: 'POST',
      body: formData
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`Failed to upload resume: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log('Upload successful:', result)
    return result
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

export async function searchJobs(role: string, location: string = 'Remote') {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, location })
  })

  if (!response.ok) {
    throw new Error('Failed to search jobs')
  }

  return await response.json()
}

export async function getRoadmap(skills: string[], targetRole: string) {
  const response = await fetch(`${API_BASE_URL}/roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills, target_role: targetRole })
  })

  if (!response.ok) {
    throw new Error('Failed to get roadmap')
  }

  return await response.json()
}

export async function getInterviewQuestion(targetRole: string, questionType: string = 'behavioral', conversationHistory?: string, userSkills?: string[]) {
  const formData = new FormData()
  formData.append('target_role', targetRole)
  formData.append('question_type', questionType)
  if (conversationHistory) {
    formData.append('conversation_history', conversationHistory)
  }
  if (userSkills && userSkills.length > 0) {
    formData.append('user_skills', userSkills.join(', '))
  }

  const response = await fetch(`${API_BASE_URL}/interview-question`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to get interview question')
  }

  return await response.json()
}

export async function evaluateAnswer(question: string, answer: string, targetRole: string) {
  const formData = new FormData()
  formData.append('question', question)
  formData.append('answer', answer)
  formData.append('target_role', targetRole)

  const response = await fetch(`${API_BASE_URL}/evaluate-answer`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to evaluate answer')
  }

  return await response.json()
}

export async function generateCertificate(userName: string, targetRole: string) {
  const formData = new FormData()
  formData.append('user_name', userName)
  formData.append('target_role', targetRole)

  const response = await fetch(`${API_BASE_URL}/generate-certificate`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to generate certificate')
  }

  return await response.json()
}
