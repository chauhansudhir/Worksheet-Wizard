import { cn } from '@/lib/utils'

interface TugOfWarRopeProps {
  position: number
  team1Name: string
  team2Name: string
  maxPosition?: number
}

export function TugOfWarRope({ position, team1Name, team2Name, maxPosition = 500 }: TugOfWarRopeProps) {
  const clampedPos = Math.max(-maxPosition, Math.min(maxPosition, position))
  const offset = (clampedPos / maxPosition) * 300
  const progressPct = Math.abs(clampedPos / maxPosition) * 100

  // Rope sag curve — a slight wave that the pulling animation shakes
  const ropeY = 95
  const ropePathD = [
    `M 130 ${ropeY}`,
    `C 200 ${ropeY - 4}, 260 ${ropeY + 5}, 330 ${ropeY - 2}`,
    `S 460 ${ropeY + 4}, 530 ${ropeY - 3}`,
    `S 610 ${ropeY + 3}, 670 ${ropeY}`,
  ].join(' ')

  return (
    <div className="w-full select-none">
      {/* Keyframe styles for pulling struggle animations */}
      <style>{`
        @keyframes pullLeft {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(-3px) rotate(-2deg); }
          50% { transform: translateX(1px) rotate(1deg); }
          75% { transform: translateX(-2px) rotate(-1deg); }
        }
        @keyframes pullRight {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(3px) rotate(2deg); }
          50% { transform: translateX(-1px) rotate(-1deg); }
          75% { transform: translateX(2px) rotate(1deg); }
        }
        @keyframes ropeStruggle {
          0%, 100% { transform: translateY(0px); }
          20% { transform: translateY(-2px); }
          40% { transform: translateY(1.5px); }
          60% { transform: translateY(-1px); }
          80% { transform: translateY(2px); }
        }
        @keyframes flagWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-4deg); }
          75% { transform: rotate(4deg); }
        }
        @keyframes dustLeft {
          0% { opacity: 0.6; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(-12px, -8px) scale(1.8); }
        }
        @keyframes dustRight {
          0% { opacity: 0.6; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(12px, -8px) scale(1.8); }
        }
        .pull-left { animation: pullLeft 0.6s ease-in-out infinite; transform-origin: 155px 95px; }
        .pull-right { animation: pullRight 0.6s ease-in-out infinite; transform-origin: 645px 95px; }
        .rope-struggle { animation: ropeStruggle 0.4s ease-in-out infinite; }
        .flag-wiggle { animation: flagWiggle 0.5s ease-in-out infinite; transform-origin: 400px 80px; }
        .dust-l { animation: dustLeft 0.8s ease-out infinite; }
        .dust-r { animation: dustRight 0.8s ease-out infinite; }
      `}</style>

      <svg viewBox="0 0 800 200" className="w-full h-auto">
        <defs>
          {/* Rope gradient for a 3D braided look */}
          <linearGradient id="ropeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a24e" />
            <stop offset="35%" stopColor="#b8860b" />
            <stop offset="65%" stopColor="#8b6914" />
            <stop offset="100%" stopColor="#6b4f10" />
          </linearGradient>
          <linearGradient id="ropeHighlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0d68a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b8860b" stopOpacity="0" />
          </linearGradient>
          {/* Zone gradients */}
          <linearGradient id="blueZone" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="redZone" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.15" />
          </linearGradient>
          {/* Ground gradient */}
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a3a3a3" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#a3a3a3" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background zones */}
        <rect x="0" y="30" width="400" height="145" fill="url(#blueZone)" rx="8" />
        <rect x="400" y="30" width="400" height="145" fill="url(#redZone)" rx="8" />

        {/* Ground line */}
        <rect x="30" y="155" width="740" height="18" fill="url(#groundGrad)" rx="4" />
        <line x1="30" y1="155" x2="770" y2="155" stroke="#d4d4d8" strokeWidth="1" />

        {/* Center line */}
        <line x1="400" y1="30" x2="400" y2="155" stroke="#d4d4d8" strokeWidth="2" strokeDasharray="6 4" />

        {/* Win threshold markers */}
        <line x1="100" y1="40" x2="100" y2="150" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35" />
        <text x="100" y="170" textAnchor="middle" fontSize="9" className="fill-blue-400" opacity="0.6">WIN</text>
        <line x1="700" y1="40" x2="700" y2="150" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.35" />
        <text x="700" y="170" textAnchor="middle" fontSize="9" className="fill-red-400" opacity="0.6">WIN</text>

        {/* Team labels */}
        <text x="50" y="22" textAnchor="middle" className="fill-blue-600" fontSize="14" fontWeight="700">{team1Name}</text>
        <text x="750" y="22" textAnchor="middle" className="fill-red-600" fontSize="14" fontWeight="700">{team2Name}</text>

        {/* === Sliding rope group === */}
        <g style={{ transform: `translateX(${offset}px)`, transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>

          {/* Rope with struggle animation */}
          <g className="rope-struggle">
            {/* Rope shadow */}
            <path d={ropePathD.replace(/\d+(?=\s*$)/g, (m) => String(Number(m) + 6))}
              stroke="#00000020" strokeWidth="10" fill="none" strokeLinecap="round"
              style={{ transform: 'translateY(4px)' }} />
            {/* Main rope body */}
            <path d={ropePathD} stroke="url(#ropeGrad)" strokeWidth="10" fill="none" strokeLinecap="round" />
            {/* Rope highlight */}
            <path d={ropePathD} stroke="url(#ropeHighlight)" strokeWidth="4" fill="none" strokeLinecap="round"
              style={{ transform: 'translateY(-2px)' }} />
            {/* Braid texture marks */}
            {Array.from({ length: 25 }, (_, i) => {
              const x = 145 + i * 22
              const even = i % 2 === 0
              return (
                <line key={i}
                  x1={x} y1={ropeY - 4} x2={x + (even ? 4 : -4)} y2={ropeY + 4}
                  stroke="#6b4f10" strokeWidth="1.2" opacity="0.4" />
              )
            })}
          </g>

          {/* Center flag / knot */}
          <g className="flag-wiggle">
            {/* Flag pole */}
            <line x1="400" y1="55" x2="400" y2={ropeY} stroke="#78716c" strokeWidth="2.5" />
            {/* Flag */}
            <polygon points="400,55 425,62 400,70" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
            {/* Knot on rope */}
            <ellipse cx="400" cy={ropeY} rx="10" ry="8" fill="#d97706" stroke="#92400e" strokeWidth="2" />
            <ellipse cx="400" cy={ropeY - 2} rx="6" ry="4" fill="#fbbf24" opacity="0.5" />
          </g>

          {/* Team 1 figure (left) — pulling struggle */}
          <g className="pull-left">
            {/* Dust particles at feet */}
            <circle cx="108" cy="150" r="3" fill="#a3a3a3" className="dust-l" />
            <circle cx="115" cy="148" r="2" fill="#a3a3a3" className="dust-l" style={{ animationDelay: '0.3s' }} />

            {/* Body leaning backward (pulling pose) */}
            {/* Head */}
            <circle cx="110" cy="78" r="13" fill="#3b82f6" />
            <circle cx="106" cy="76" r="2" fill="white" />
            <circle cx="114" cy="76" r="2" fill="white" />
            <path d="M104 83 Q110 87 116 83" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Body — leaning back */}
            <line x1="110" y1="91" x2="120" y2="125" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
            {/* Arms reaching for rope */}
            <line x1="113" y1="98" x2="135" y2="90" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="135" y1="90" x2="145" y2={ropeY} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            {/* Hand grip on rope */}
            <circle cx="145" cy={ropeY} r="4" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.5" />
            {/* Legs braced wide */}
            <line x1="120" y1="125" x2="105" y2="155" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="120" y1="125" x2="132" y2="155" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" />
            {/* Feet */}
            <ellipse cx="102" cy="155" rx="7" ry="3" fill="#2563eb" />
            <ellipse cx="135" cy="155" rx="7" ry="3" fill="#2563eb" />
          </g>

          {/* Team 2 figure (right) — pulling struggle */}
          <g className="pull-right">
            {/* Dust particles */}
            <circle cx="692" cy="150" r="3" fill="#a3a3a3" className="dust-r" />
            <circle cx="685" cy="148" r="2" fill="#a3a3a3" className="dust-r" style={{ animationDelay: '0.3s' }} />

            {/* Body leaning backward (pulling pose, mirrored) */}
            {/* Head */}
            <circle cx="690" cy="78" r="13" fill="#ef4444" />
            <circle cx="686" cy="76" r="2" fill="white" />
            <circle cx="694" cy="76" r="2" fill="white" />
            <path d="M684 83 Q690 87 696 83" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Body — leaning back */}
            <line x1="690" y1="91" x2="680" y2="125" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            {/* Arms reaching for rope */}
            <line x1="687" y1="98" x2="665" y2="90" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="665" y1="90" x2="655" y2={ropeY} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            {/* Hand grip on rope */}
            <circle cx="655" cy={ropeY} r="4" fill="#dc2626" stroke="#b91c1c" strokeWidth="1.5" />
            {/* Legs braced wide */}
            <line x1="680" y1="125" x2="695" y2="155" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="680" y1="125" x2="668" y2="155" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
            {/* Feet */}
            <ellipse cx="698" cy="155" rx="7" ry="3" fill="#dc2626" />
            <ellipse cx="665" cy="155" rx="7" ry="3" fill="#dc2626" />
          </g>
        </g>
      </svg>

      {/* Progress bar underneath */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden mt-1">
        <div
          className={cn(
            'absolute top-0 h-full rounded-full transition-all duration-600',
            position < 0 ? 'bg-blue-500 right-1/2' : 'bg-red-500 left-1/2'
          )}
          style={{ width: `${progressPct / 2}%` }}
        />
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-border -translate-x-1/2" />
      </div>
    </div>
  )
}
