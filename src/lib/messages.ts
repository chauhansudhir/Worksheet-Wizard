interface MessageConfig {
  messages: string[]
  color: string
}

const messagesByRange: Record<string, MessageConfig> = {
  perfect: {
    messages: [
      "You're a math superstar!",
      'Perfect score! Amazing work!',
      "Incredible! You didn't miss a single one!",
      "Flawless! You're a math genius!",
    ],
    color: 'text-yellow-500',
  },
  excellent: {
    messages: [
      "You're so close to perfect!",
      'Excellent work! Almost there!',
      "Wow, that's impressive!",
      'Outstanding effort!',
    ],
    color: 'text-green-500',
  },
  great: {
    messages: [
      "You're getting really good at this!",
      'Great job! Keep it up!',
      "Nice work! You're improving!",
      'Well done! Practice is paying off!',
    ],
    color: 'text-blue-500',
  },
  good: {
    messages: [
      'Practice makes perfect!',
      "You're on the right track!",
      'Good effort! Keep practicing!',
      "You're learning and growing!",
    ],
    color: 'text-indigo-500',
  },
  encourage: {
    messages: [
      'Every math genius started just like you!',
      "Don't give up! You're getting better!",
      'Keep trying - you can do it!',
      "Math is a journey, and you're on your way!",
    ],
    color: 'text-purple-500',
  },
}

function getRange(percentage: number): string {
  if (percentage === 100) return 'perfect'
  if (percentage >= 90) return 'excellent'
  if (percentage >= 70) return 'great'
  if (percentage >= 50) return 'good'
  return 'encourage'
}

export function getEncouragingMessage(percentage: number): { message: string; color: string } {
  const range = getRange(percentage)
  const config = messagesByRange[range]!
  const message = config.messages[Math.floor(Math.random() * config.messages.length)]!
  return { message, color: config.color }
}

export function getScoreColor(percentage: number): string {
  if (percentage === 100) return 'text-yellow-500'
  if (percentage >= 90) return 'text-green-500'
  if (percentage >= 70) return 'text-blue-500'
  if (percentage >= 50) return 'text-indigo-500'
  return 'text-purple-500'
}

export function getScoreBgColor(percentage: number): string {
  if (percentage === 100) return 'bg-yellow-100'
  if (percentage >= 90) return 'bg-green-100'
  if (percentage >= 70) return 'bg-blue-100'
  if (percentage >= 50) return 'bg-indigo-100'
  return 'bg-purple-100'
}
