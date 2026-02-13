import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { ScoreTrendPoint } from '@/stores/progress-atoms'

interface ScoreTrendChartProps {
  data: ScoreTrendPoint[]
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Grade some worksheets to see your score trend!
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis domain={[0, 100]} fontSize={12} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.[0]) {
              const d = payload[0].payload as ScoreTrendPoint
              return (
                <div className="rounded-lg bg-card border p-2 shadow text-sm">
                  <p className="font-medium">{d.worksheetTitle}</p>
                  <p className="text-muted-foreground">{d.date}</p>
                  <p className="font-bold text-green-600">{d.score}%</p>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 4, fill: '#22c55e' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
