import React, { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from './Card'

type SentimentPoint = {
  time: string
  sentiment: number
  positiveCount: number
  negativeCount: number
}

/**
 * Real-time sentiment chart.
 * Displays call sentiment over time, updates as new data arrives, and is responsive.
 */
const SentimentChart: React.FC = () => {
  const [data, setData] = useState<SentimentPoint[]>([
    { time: '09:15', sentiment: 0.4, positiveCount: 5, negativeCount: 2 },
    { time: '09:16', sentiment: 0.5, positiveCount: 8, negativeCount: 3 },
    { time: '09:17', sentiment: -0.1, positiveCount: 3, negativeCount: 4 },
  ])

  // Simulate new sentiment data arriving every 2 seconds.
  useEffect(() => {
    const id = window.setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1]
        const [hStr, mStr] = last.time.split(':')
        const minutes = parseInt(mStr, 10) + 1
        const nextTime = `${hStr}:${minutes.toString().padStart(2, '0')}`
        const nextSentiment = Math.max(
          -1,
          Math.min(1, last.sentiment + (Math.random() - 0.5) * 0.4),
        )
        const nextPositive = Math.max(
          0,
          last.positiveCount + (Math.random() > 0.5 ? 1 : -1),
        )
        const nextNegative = Math.max(
          0,
          last.negativeCount + (Math.random() > 0.6 ? 1 : -1),
        )

        const next = [
          ...prev,
          {
            time: nextTime,
            sentiment: nextSentiment,
            positiveCount: nextPositive,
            negativeCount: nextNegative,
          },
        ]
        // Keep last 20 points to keep chart readable.
        if (next.length > 20) {
          return next.slice(next.length - 20)
        }
        return next
      })
    }, 2000)

    return () => {
      window.clearInterval(id)
    }
  }, [])

  return (
    <Card className="space-y-4">
      <header className="mb-2">
        <h2 className="text-sm font-semibold text-[color:var(--app-accent-strong)]">
          Sentiment Over Time
        </h2>
        <p className="text-xs text-[color:var(--app-text-muted)]">
          Real-time charts: sentiment line, stacked area for positive/negative,
          and per-minute bar totals.
        </p>
      </header>
      {/* Line chart: sentiment over time */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 24, bottom: 12, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#4b5563' }}
            />
            <YAxis
              domain={[-1, 1]}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#4b5563' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#1f2937',
                borderRadius: 8,
                fontSize: 11,
              }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Area chart: positive vs negative counts */}
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 24, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#4b5563' }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#4b5563' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#1f2937',
                borderRadius: 8,
                fontSize: 11,
              }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Area
              type="monotone"
              dataKey="positiveCount"
              stackId="1"
              stroke="#22c55e"
              fill="#22c55e33"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="negativeCount"
              stackId="1"
              stroke="#f97316"
              fill="#f9731633"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Bar chart: total interactions per minute */}
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 6, right: 24, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#4b5563' }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={{ stroke: '#4b5563' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#1f2937',
                borderRadius: 8,
                fontSize: 11,
              }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Bar
              dataKey={(d: SentimentPoint) => d.positiveCount + d.negativeCount}
              name="Total interactions"
              fill="#6366f1"
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default SentimentChart

