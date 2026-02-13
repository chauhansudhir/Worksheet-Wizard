import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { WeeklyActivity } from '@/stores/progress-atoms'

interface WeeklyActivityChartProps {
  data: WeeklyActivity[]
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  if (data.every((d) => d.count === 0)) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Complete worksheets to track your weekly activity!
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" fontSize={12} />
        <YAxis fontSize={12} allowDecimals={false} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload?.[0]) {
              const d = payload[0].payload as WeeklyActivity
              return (
                <div className="rounded-lg bg-card border p-2 shadow text-sm">
                  <p className="font-medium">Week of {d.week}</p>
                  <p>{d.count} worksheet{d.count !== 1 ? 's' : ''}</p>
                  {d.avgScore > 0 && <p className="text-muted-foreground">Avg: {d.avgScore}%</p>}
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
