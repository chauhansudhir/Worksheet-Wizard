import type { MathProblem, WorksheetConfig } from '@/types'
import { getDifficultyParams } from './difficulty'
import { generateAddition } from './addition'
import { generateSubtraction } from './subtraction'
import { generateMultiplication } from './multiplication'
import { generateDivision } from './division'
import { generateVisualFractionProblem } from './fractions'

function generateId(): string {
  return crypto.randomUUID()
}

function generateWholeProblem(config: WorksheetConfig, id: string): MathProblem {
  const params = getDifficultyParams(config.difficulty, config.maxDigits)

  switch (config.operationType) {
    case 'addition':
      return generateAddition(params, id)
    case 'subtraction':
      return generateSubtraction(params, id)
    case 'multiplication':
      return generateMultiplication(params, id)
    case 'division':
      return generateDivision(params, id)
    case 'mixed': {
      const ops = ['addition', 'subtraction'] as const
      const op = ops[Math.floor(Math.random() * ops.length)]!
      if (op === 'addition') return generateAddition(params, id)
      return generateSubtraction(params, id)
    }
    default:
      return generateAddition(params, id)
  }
}

function problemKey(p: MathProblem): string {
  if (p.type === 'whole') {
    return `${p.operand1}${p.operator}${p.operand2}`
  }
  if (p.type === 'visual-fraction') {
    return `vf-${p.visualType}-${p.shadedParts}/${p.totalParts}`
  }
  return `${p.operand1.numerator}/${p.operand1.denominator}${p.operator}${p.operand2.numerator}/${p.operand2.denominator}`
}

export function generateProblems(config: WorksheetConfig): MathProblem[] {
  const problems: MathProblem[] = []
  const seen = new Set<string>()

  for (let i = 0; i < config.problemCount; i++) {
    let retries = 0
    let problem: MathProblem
    do {
      if (config.operationType === 'fractions') {
        problem = generateVisualFractionProblem(config.difficulty, generateId())
      } else {
        problem = generateWholeProblem(config, generateId())
      }
      retries++
    } while (seen.has(problemKey(problem)) && retries < 10)
    seen.add(problemKey(problem))
    problems.push(problem)
  }

  return problems
}
