import type { WholeNumberProblem } from '@/types'
import type { DifficultyParams } from './difficulty'
import { randomInt, hasBorrow } from './utils'

export function generateSubtraction(params: DifficultyParams, id: string): WholeNumberProblem {
  let operand1: number
  let operand2: number
  let attempts = 0

  do {
    const a = randomInt(params.rangeLow, params.rangeHigh)
    const b = randomInt(params.rangeLow, params.rangeHigh)
    operand1 = Math.max(a, b)
    operand2 = Math.min(a, b)
    attempts++
  } while (params.forceCarryBorrow && !hasBorrow(operand1, operand2) && attempts < 50)

  const answer = operand1 - operand2
  return {
    id,
    type: 'whole',
    operand1,
    operand2,
    operator: '-',
    answer,
    displayString: `${operand1} - ${operand2} = `,
  }
}
