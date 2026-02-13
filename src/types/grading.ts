export interface AnswerEntry {
  problemId: string
  userAnswer: string
  isCorrect: boolean
}

export interface GradingResult {
  id: string
  worksheetId: string
  profileId: string
  answers: AnswerEntry[]
  score: number
  totalProblems: number
  percentage: number
  gradedAt: string
}
