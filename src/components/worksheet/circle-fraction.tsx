interface CircleFractionProps {
  totalParts: number
  shadedParts: number
  size?: number
}

export function CircleFraction({ totalParts, shadedParts, size = 120 }: CircleFractionProps) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 4

  const slices: { path: string; shaded: boolean }[] = []

  for (let i = 0; i < totalParts; i++) {
    const startAngle = (i / totalParts) * 2 * Math.PI - Math.PI / 2
    const endAngle = ((i + 1) / totalParts) * 2 * Math.PI - Math.PI / 2

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)

    const largeArc = totalParts === 1 ? 1 : 0

    let path: string
    if (totalParts === 1) {
      // Full circle
      path = `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
    } else {
      path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    }

    slices.push({ path, shaded: i < shadedParts })
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="inline-block">
      {slices.map((slice, i) => (
        <path
          key={i}
          d={slice.path}
          fill={slice.shaded ? '#3b82f6' : 'white'}
          stroke="#374151"
          strokeWidth="1.5"
        />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#374151" strokeWidth="2" />
    </svg>
  )
}
