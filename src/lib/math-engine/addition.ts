import type { WholeNumberProblem } from '@/types'
import type { DifficultyParams } from './difficulty'
import { randomInt, hasCarry } from './utils'

export function generateAddition(params: DifficultyParams, id: string): WholeNumberProblem {
  let operand1: number
  let operand2: number
  let attempts = 0

  do {
    operand1 = randomInt(params.rangeLow, params.rangeHigh)
    operand2 = randomInt(params.rangeLow, params.rangeHigh)
    attempts++
  } while (params.forceCarryBorrow && !hasCarry(operand1, operand2) && attempts < 50)

  const answer = operand1 + operand2
  return {
    id,
    type: 'whole',
    operand1,
    operand2,
    operator: '+',
    answer,
    displayString: `${operand1} + ${operand2} = `,
  }
}
