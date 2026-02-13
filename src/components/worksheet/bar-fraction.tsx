interface BarFractionProps {
  totalParts: number
  shadedParts: number
  width?: number
  height?: number
}

export function BarFraction({ totalParts, shadedParts, width = 160, height = 40 }: BarFractionProps) {
  const partWidth = width / totalParts

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block">
      {Array.from({ length: totalParts }, (_, i) => (
        <rect
          key={i}
          x={i * partWidth}
          y={0}
          width={partWidth}
          height={height}
          fill={i < shadedParts ? '#3b82f6' : 'white'}
          stroke="#374151"
          strokeWidth="1.5"
        />
      ))}
      <rect x={0} y={0} width={width} height={height} fill="none" stroke="#374151" strokeWidth="2" />
    </svg>
  )
}
