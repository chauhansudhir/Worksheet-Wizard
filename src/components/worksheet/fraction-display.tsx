import type { Fraction } from '@/types'

interface FractionDisplayProps {
  fraction: Fraction
  className?: string
}

export function FractionDisplay({ fraction, className }: FractionDisplayProps) {
  if (fraction.denominator === 1) {
    return <span className={className}>{fraction.numerator}</span>
  }

  return (
    <span className={`inline-flex flex-col items-center leading-tight ${className ?? ''}`}>
      <span className="text-center">{fraction.numerator}</span>
      <span className="border-t border-current w-full min-w-[1.2em]" />
      <span className="text-center">{fraction.denominator}</span>
    </span>
  )
}
