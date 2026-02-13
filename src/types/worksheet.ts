import type { Fraction } from './fraction'

export type OperationType = 'addition' | 'subtraction' | 'mixed' | 'multiplication' | 'division' | 'fractions'

export type FractionVisualType = 'circle' | 'bar' | 'set'

export type ProblemLayout = 'horizontal' | 'vertical'

export interface WorksheetConfig {
  operationType: OperationType
  maxDigits: number
  difficulty: number
  problemCount: number
  layout?: ProblemLayout
}

export interface WholeNumberProblem {
  id: string
  type: 'whole'
  operand1: number
  operand2: number
  operator: string
  answer: number
  remainder?: number
  displayString: string
}

export interface FractionMathProblem {
  id: string
  type: 'fraction'
  operand1: Fraction
  operand2: Fraction
  operator: string
  answer: Fraction
  displayString: string
  answerDisplayString: string
}

export interface VisualFractionProblem {
  id: string
  type: 'visual-fraction'
  visualType: FractionVisualType
  totalParts: number
  shadedParts: number
  answer: Fraction
  answerDisplayString: string
  prompt: string
}

export type MathProblem = WholeNumberProblem | FractionMathProblem | VisualFractionProblem

export interface Worksheet {
  id: string
  profileId: string
  config: WorksheetConfig
  problems: MathProblem[]
  createdAt: string
  title: string
}
