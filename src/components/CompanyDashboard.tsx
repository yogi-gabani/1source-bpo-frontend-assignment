import React, { useEffect, useRef, useState } from 'react'
import type { Account } from '../stores/accountStore'
import { Card } from './Card'

type CompanyMetrics = {
  totalCalls: number
  activeCalls: number
  escalatedCalls: number
  avgHandleTime: number
}

type Props = {
  account: Account
}

/**
 * Simple per-account dashboard that updates metrics in real time.
 * This is purely for demo; in a real app these values would come from an API.
 */
const CompanyDashboard: React.FC<Props> = ({ account }) => {
  const [metrics, setMetrics] = useState<CompanyMetrics>(() => ({
    totalCalls: 120 + Math.floor(Math.random() * 40),
    activeCalls: 3 + Math.floor(Math.random() * 4),
    escalatedCalls: 5 + Math.floor(Math.random() * 5),
    avgHandleTime: 6 + Math.random() * 2, // minutes
  }))

  const [changed, setChanged] = useState({
    totalCalls: false,
    activeCalls: false,
    escalatedCalls: false,
    avgHandleTime: false,
  })
  const previousRef = useRef<CompanyMetrics | null>(null)
  const highlightTimeoutRef = useRef<number | null>(null)

  // Whenever the account changes, reset metrics and clear highlights.
  useEffect(() => {
    setMetrics({
      totalCalls: 120 + Math.floor(Math.random() * 40),
      activeCalls: 3 + Math.floor(Math.random() * 4),
      escalatedCalls: 5 + Math.floor(Math.random() * 5),
      avgHandleTime: 6 + Math.random() * 2,
    })
    previousRef.current = null
    setChanged({
      totalCalls: false,
      activeCalls: false,
      escalatedCalls: false,
      avgHandleTime: false,
    })
  }, [account.id])

  useEffect(() => {
    const id = window.setInterval(() => {
      setMetrics((prev) => {
        const jitter = () => (Math.random() > 0.5 ? 1 : -1)
        const nextTotal = prev.totalCalls + (Math.random() > 0.7 ? 1 : 0)
        const nextActive = Math.max(0, prev.activeCalls + jitter())
        const nextEscalated = Math.max(
          0,
          Math.min(nextTotal, prev.escalatedCalls + (Math.random() > 0.8 ? 1 : 0)),
        )
        const nextAht = Math.max(
          2,
          Math.min(15, prev.avgHandleTime + (Math.random() - 0.5) * 0.2),
        )

        const next: CompanyMetrics = {
          totalCalls: nextTotal,
          activeCalls: nextActive,
          escalatedCalls: nextEscalated,
          avgHandleTime: nextAht,
        }

        const prevMetrics = previousRef.current ?? prev
        const nextChanged = {
          totalCalls: prevMetrics.totalCalls !== next.totalCalls,
          activeCalls: prevMetrics.activeCalls !== next.activeCalls,
          escalatedCalls: prevMetrics.escalatedCalls !== next.escalatedCalls,
          avgHandleTime:
            Math.abs(prevMetrics.avgHandleTime - next.avgHandleTime) > 0.01,
        }
        previousRef.current = next
        setChanged(nextChanged)

        if (highlightTimeoutRef.current !== null) {
          window.clearTimeout(highlightTimeoutRef.current)
        }
        highlightTimeoutRef.current = window.setTimeout(() => {
          setChanged({
            totalCalls: false,
            activeCalls: false,
            escalatedCalls: false,
            avgHandleTime: false,
          })
        }, 600)

        return next
      })
    }, 1500)

    return () => {
      window.clearInterval(id)
      if (highlightTimeoutRef.current !== null) {
        window.clearTimeout(highlightTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Card className="mt-4 bg-[color:var(--app-surface-subtle)]">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-[color:var(--app-text-muted)]">
        {account.name} – Live KPIs
      </div>
      <div className="overflow-hidden rounded-md border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface)]">
        <table className="min-w-full border-collapse text-xs text-[color:var(--app-text)]">
          <thead className="bg-[color:var(--app-surface-subtle)] text-left text-[11px] uppercase tracking-wide text-[color:var(--app-text-muted)]">
            <tr>
              <th className="px-3 py-2">Metric</th>
              <th className="px-3 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-[color:var(--app-surface)] even:bg-[color:var(--app-surface-subtle)]">
              <td className="px-3 py-2 text-[color:var(--app-text-muted)]">
                Total calls today
              </td>
              <td
                className={`px-3 py-2 font-mono transition-colors ${
                  changed.totalCalls
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[color:var(--app-text)]'
                }`}
              >
                {metrics.totalCalls.toLocaleString()}
              </td>
            </tr>
            <tr className="odd:bg-[color:var(--app-surface)] even:bg-[color:var(--app-surface-subtle)]">
              <td className="px-3 py-2 text-[color:var(--app-text-muted)]">
                Active calls
              </td>
              <td
                className={`px-3 py-2 font-mono transition-colors ${
                  changed.activeCalls
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[color:var(--app-text)]'
                }`}
              >
                {metrics.activeCalls}
              </td>
            </tr>
            <tr className="odd:bg-[color:var(--app-surface)] even:bg-[color:var(--app-surface-subtle)]">
              <td className="px-3 py-2 text-[color:var(--app-text-muted)]">
                Escalated calls
              </td>
              <td
                className={`px-3 py-2 font-mono transition-colors ${
                  changed.escalatedCalls
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[color:var(--app-text)]'
                }`}
              >
                {metrics.escalatedCalls}
              </td>
            </tr>
            <tr className="odd:bg-[color:var(--app-surface)] even:bg-[color:var(--app-surface-subtle)]">
              <td className="px-3 py-2 text-[color:var(--app-text-muted)]">
                Avg handle time (min)
              </td>
              <td
                className={`px-3 py-2 font-mono transition-colors ${
                  changed.avgHandleTime
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[color:var(--app-text)]'
                }`}
              >
                {metrics.avgHandleTime.toFixed(1)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default CompanyDashboard

