import React, { useEffect, useRef, useState } from 'react'
import { Card } from './Card'

type MetricPoint = {
  id: number
  value: number
}

/**
 * High-frequency updates demo.
 * Uses refs as a write-only buffer and commits to React state on animation
 * frames so the UI doesn't re-render 100+ times/sec.
 */
const HighFrequencyDashboard: React.FC = () => {
  const [points, setPoints] = useState<MetricPoint[]>([])
  const bufferRef = useRef<MetricPoint[]>([])
  const nextIdRef = useRef(1)
  const rafIdRef = useRef<number | null>(null)

  // Simulate a high-frequency data source (e.g. WebSocket 100+ events/sec)
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const batch: MetricPoint[] = []

      for (let i = 0; i < 10; i += 1) {
        batch.push({
          id: nextIdRef.current++,
          value: Math.random(),
        })
      }

      // Push into an off-React buffer (no re-render here).
      bufferRef.current = bufferRef.current.concat(batch)
    }, 100) // 10 * 10 events/sec = 100 events/sec total

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  // Use requestAnimationFrame to commit buffered updates at most ~60fps.
  useEffect(() => {
    const loop = () => {
      if (bufferRef.current.length > 0) {
        const slice = bufferRef.current
        bufferRef.current = []

        // Single state update per frame, instead of one per event.
        setPoints((prev) => {
          const merged = [...prev, ...slice]
          // Keep only the latest 50 points to keep UI light.
          if (merged.length > 50) {
            return merged.slice(merged.length - 50)
          }
          return merged
        })
      }
      rafIdRef.current = window.requestAnimationFrame(loop)
    }

    rafIdRef.current = window.requestAnimationFrame(loop)

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return (
    <Card>
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[color:var(--app-accent-strong)]">
            High-Frequency Updates
          </h2>
          <p className="text-xs text-[color:var(--app-text-muted)]">
            Events are buffered in refs and committed once per animation frame
            to avoid 100+ React renders per second.
          </p>
        </div>
      </header>
      <div className="text-xs text-[color:var(--app-text-muted)]">
        <p className="mb-2">
          Showing last {points.length} events (simulated 100 events/sec).
        </p>
        <div className="flex h-24 items-end gap-[2px] rounded-md border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface-subtle)] p-2">
          {points.map((p) => (
            <div
              key={p.id}
              className="w-[4px] rounded-t-sm bg-sky-500"
              style={{ height: `${20 + p.value * 80}%` }}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}

export default HighFrequencyDashboard

