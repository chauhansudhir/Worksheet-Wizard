import type { WholeNumberProblem } from '@/types'
import type { DifficultyParams } from './difficulty'
import { randomInt } from './utils'

export function generateMultiplication(params: DifficultyParams, id: string): WholeNumberProblem {
  const maxSecond = Math.pow(10, params.multSecondOperandDigits) - 1

  const operand1 = randomInt(params.rangeLow, params.rangeHigh)
  const operand2 = randomInt(Math.max(1, Math.min(params.rangeLow, 2)), Math.min(maxSecond, params.rangeHigh))

  const answer = operand1 * operand2
  return {
    id,
    type: 'whole',
    operand1,
    operand2,
    operator: '\u00d7',
    answer,
    displayString: `${operand1} \u00d7 ${operand2} = `,
  }
}
