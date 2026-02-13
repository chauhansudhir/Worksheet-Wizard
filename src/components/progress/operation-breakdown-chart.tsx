import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { OperationBreakdown } from '@/stores/progress-atoms'
import { getOperationLabel } from '@/lib/utils'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899']

interface OperationBreakdownChartProps {
  data: OperationBreakdown[]
}

export function OperationBreakdownChart({ data }: OperationBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Create worksheets to see your practice breakdown!
      </div>
    )
  }

  const chartData = data.map((d) => ({
    ...d,
    name: getOperationLabel(d.operation),
  }))

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="60%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {chartData.map((d, i) => (
          <div key={d.operation} className="flex items-center gap-2 text-sm">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span>{d.name}: {d.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
