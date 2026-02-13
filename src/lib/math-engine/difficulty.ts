export interface DifficultyParams {
  rangeLow: number
  rangeHigh: number
  forceCarryBorrow: boolean
  allowRemainder: boolean
  sameDenominator: boolean
  maxDenominator: number
  multSecondOperandDigits: number
}

export function getDifficultyParams(difficulty: number, maxDigits: number): DifficultyParams {
  const maxVal = Math.pow(10, maxDigits) - 1

  if (difficulty <= 2) {
    const low = Math.max(1, Math.floor(maxVal * 0.05))
    const high = Math.floor(maxVal * (0.3 + difficulty * 0.1))
    return {
      rangeLow: low,
      rangeHigh: Math.max(low + 1, high),
      forceCarryBorrow: false,
      allowRemainder: false,
      sameDenominator: true,
      maxDenominator: 10,
      multSecondOperandDigits: 1,
    }
  }

  if (difficulty <= 5) {
    const low = Math.max(1, Math.floor(maxVal * (0.05 + (difficulty - 3) * 0.05)))
    const high = Math.floor(maxVal * (0.5 + (difficulty - 3) * 0.12))
    return {
      rangeLow: low,
      rangeHigh: Math.max(low + 1, high),
      forceCarryBorrow: difficulty >= 4,
      allowRemainder: difficulty >= 5,
      sameDenominator: false,
      maxDenominator: 12,
      multSecondOperandDigits: Math.min(maxDigits, difficulty <= 3 ? 2 : 3),
    }
  }

  if (difficulty <= 7) {
    const low = Math.max(1, Math.floor(maxVal * (0.2 + (difficulty - 6) * 0.1)))
    const high = Math.floor(maxVal * (0.85 + (difficulty - 6) * 0.075))
    return {
      rangeLow: low,
      rangeHigh: Math.max(low + 1, high),
      forceCarryBorrow: true,
      allowRemainder: true,
      sameDenominator: false,
      maxDenominator: 20,
      multSecondOperandDigits: Math.min(maxDigits, difficulty === 6 ? 3 : 4),
    }
  }

  // difficulty 8-9
  const low = Math.max(1, Math.floor(maxVal * (0.4 + (difficulty - 8) * 0.15)))
  const high = maxVal
  return {
    rangeLow: low,
    rangeHigh: Math.max(low + 1, high),
    forceCarryBorrow: true,
    allowRemainder: true,
    sameDenominator: false,
    maxDenominator: 25,
    multSecondOperandDigits: maxDigits,
  }
}
