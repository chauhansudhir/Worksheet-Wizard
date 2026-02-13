interface SetFractionProps {
  totalParts: number
  shadedParts: number
  size?: number
}

export function SetFraction({ totalParts, shadedParts, size = 28 }: SetFractionProps) {
  const cols = Math.min(totalParts, 6)
  const gap = 4

  return (
    <div
      className="inline-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gap: `${gap}px`,
      }}
    >
      {Array.from({ length: totalParts }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill={i < shadedParts ? '#3b82f6' : 'white'}
            stroke="#374151"
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  )
}
