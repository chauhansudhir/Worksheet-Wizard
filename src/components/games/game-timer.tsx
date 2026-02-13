import { useEffect, useRef, useState } from 'react'

interface GameTimerProps {
  duration: number // seconds
  running: boolean
  onTimeout: () => void
}

export function GameTimer({ duration, running, onTimeout }: GameTimerProps) {
  const [remaining, setRemaining] = useState(duration)
  const onTimeoutRef = useRef(onTimeout)
  onTimeoutRef.current = onTimeout

  useEffect(() => {
    setRemaining(duration)
  }, [duration])

  useEffect(() => {
    if (!running) return

    const start = Date.now()
    const end = start + remaining * 1000

    const interval = setInterval(() => {
      const now = Date.now()
      const left = Math.max(0, (end - now) / 1000)
      setRemaining(left)

      if (left <= 0) {
        clearInterval(interval)
        onTimeoutRef.current()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const progress = remaining / duration
  const dashOffset = circumference * (1 - progress)

  const seconds = Math.ceil(remaining)
  const color = remaining > 5 ? '#22c55e' : remaining > 3 ? '#eab308' : '#ef4444'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="6"
        />
        {/* Progress arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke 0.3s' }}
        />
      </svg>
      <span
        className="absolute text-2xl font-bold tabular-nums"
        style={{ color }}
      >
        {seconds}
      </span>
    </div>
  )
}

export function useTimeRemaining(duration: number, running: boolean) {
  const [remaining, setRemaining] = useState(duration)

  useEffect(() => {
    setRemaining(duration)
  }, [duration])

  useEffect(() => {
    if (!running) return

    const start = Date.now()
    const end = start + remaining * 1000

    const interval = setInterval(() => {
      const now = Date.now()
      const left = Math.max(0, (end - now) / 1000)
      setRemaining(left)

      if (left <= 0) {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  return remaining
}
