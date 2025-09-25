export type Project = {
  id: string
  worktree: string
  vcs?: "git"
  time: {
    created: number
    initialized?: number
  }
}

export interface Session {
  id: string
  projectId: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ChatState {
  currentProject: Project | null
  currentSession: Session | null
  projects: Project[]
  sessions: Session[]
  messages: Message[]
  isLoading: boolean
}
