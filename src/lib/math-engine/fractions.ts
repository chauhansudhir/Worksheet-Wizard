import type { VisualFractionProblem, FractionVisualType } from '@/types'
import { randomInt, gcd } from './utils'

const visualTypes: FractionVisualType[] = ['circle', 'bar', 'set']

const prompts = [
  'What fraction is shaded?',
  'Write the fraction shown.',
  'What part is colored?',
]

export function generateVisualFractionProblem(difficulty: number, id: string): VisualFractionProblem {
  const visualType = visualTypes[randomInt(0, visualTypes.length - 1)]!

  let maxDenom: number
  if (difficulty <= 2) {
    maxDenom = 6
  } else if (difficulty <= 5) {
    maxDenom = 10
  } else {
    maxDenom = 12
  }

  const totalParts = randomInt(2, maxDenom)
  const shadedParts = randomInt(1, totalParts - 1)
  const d = gcd(shadedParts, totalParts)

  const prompt = prompts[randomInt(0, prompts.length - 1)]!

  return {
    id,
    type: 'visual-fraction',
    visualType,
    totalParts,
    shadedParts,
    answer: { numerator: shadedParts / d, denominator: totalParts / d },
    answerDisplayString: `${shadedParts / d}/${totalParts / d}`,
    prompt,
  }
}
