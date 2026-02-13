import type { WholeNumberProblem } from '@/types'
import type { DifficultyParams } from './difficulty'
import { randomInt } from './utils'

export function generateDivision(params: DifficultyParams, id: string): WholeNumberProblem {
  if (!params.allowRemainder) {
    // Clean division: generate answer & divisor, then dividend = answer * divisor
    const answer = randomInt(Math.max(2, Math.floor(params.rangeLow / 10)), Math.floor(params.rangeHigh / 2))
    const divisor = randomInt(2, Math.min(12, Math.floor(params.rangeHigh / answer)))
    const dividend = answer * divisor

    return {
      id,
      type: 'whole',
      operand1: dividend,
      operand2: divisor,
      operator: '\u00f7',
      answer,
      displayString: `${dividend} \u00f7 ${divisor} = `,
    }
  }

  // Division with possible remainder
  const dividend = randomInt(params.rangeLow, params.rangeHigh)
  const divisor = randomInt(2, Math.min(Math.floor(Math.sqrt(params.rangeHigh)), Math.max(12, Math.floor(params.rangeHigh / 10))))
  const answer = Math.floor(dividend / divisor)
  const remainder = dividend % divisor

  return {
    id,
    type: 'whole',
    operand1: dividend,
    operand2: divisor,
    operator: '\u00f7',
    answer,
    remainder: remainder > 0 ? remainder : undefined,
    displayString: `${dividend} \u00f7 ${divisor} = `,
  }
}
