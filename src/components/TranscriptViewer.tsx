import React, { useEffect, useMemo, useRef } from 'react'
import { useCallStore, type Transcript as TranscriptMessage } from '../stores/callStore'
import { Card } from './Card'

type TranscriptViewerProps = {
  /** WebSocket endpoint for live transcripts */
  wsUrl: string
}

/**
 * Renders a live call transcript from a WebSocket stream while avoiding unnecessary re-renders.
 */
const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ wsUrl }) => {
  const messages = useCallStore((s) => s.transcripts)
  const addTranscript = useCallStore((s) => s.addTranscript)
  const setConnectionStatus = useCallStore((s) => s.setConnectionStatus)
  const connectionStatus = useCallStore((s) => s.connectionStatus)
  const wsRef = useRef<WebSocket | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isAtBottomRef = useRef(true)

  useEffect(() => {
    // Simple local mock mode for demos: pass "mock" or "ws://mock" etc.
    if (wsUrl.startsWith('mock')) {
      setConnectionStatus('connected')
      const samplePhrases = [
        "Hi, you've reached the help desk. How can I assist you today?",
        "I'll need to pull up your profile—can you share your reference number?",
        "I've located the ticket. One moment while I review the details.",
        "I've updated the record on our side. You should see the change within a few minutes.",
        "Anything else you'd like me to look into before we wrap up?",
      ]
      let idx = 0
      const intervalId = window.setInterval(() => {
        const now = Math.floor(Date.now() / 1000)
        const message: TranscriptMessage = {
          type: 'transcript',
          agentId: 'rep_jordan',
          text: samplePhrases[idx % samplePhrases.length],
          timestamp: now,
        }
        idx += 1
        addTranscript(message)
      }, 1200)

      return () => {
        window.clearInterval(intervalId)
        setConnectionStatus('disconnected')
      }
    }

    setConnectionStatus('connecting')
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onmessage = (event) => {
      try {
        const data: TranscriptMessage = JSON.parse(event.data)
        if (data.type !== 'transcript') return

        // Batch updates using functional setState to avoid dependency changes.
        addTranscript(data)
      } catch {
        // ignore invalid messages
      }
    }

    ws.onerror = () => {
      // Basic error handling; in a real app you might surface this to the UI
      setConnectionStatus('error')
    }

    ws.onclose = () => {
      wsRef.current = null
      setConnectionStatus('disconnected')
    }

    ws.onopen = () => {
      setConnectionStatus('connected')
    }

    return () => {
      ws.close()
    }
  }, [wsUrl])

  // Track whether the user has scrolled up so we don't force-scroll.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      const threshold = 16
      const atBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < threshold
      isAtBottomRef.current = atBottom
    }

    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-scroll only when the user is already near the bottom.
  useEffect(() => {
    const el = containerRef.current
    if (!el || !isAtBottomRef.current) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  // Memoize the rendered list items to avoid recalculating JSX when messages are unchanged.
  const renderedMessages = useMemo(
    () =>
      messages.map((m) => (
        <div
          key={m.timestamp + m.agentId + m.text}
          className="rounded-lg bg-[color:var(--app-surface-subtle)] px-3 py-2 text-sm text-[color:var(--app-text)] shadow-sm"
        >
          <div className="mb-1 flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-slate-400">
            <span>{m.agentId}</span>
            <span>
              {new Date(m.timestamp * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
          <p className="leading-snug">{m.text}</p>
        </div>
      )),
    [messages],
  )

  return (
    <Card className="flex h-140 flex-col">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-[color:var(--app-accent-strong)]">
            Live Call Transcript
          </h2>
          <p className="text-xs text-[color:var(--app-text-muted)]">
            Streaming in real time from WebSocket
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
            connectionStatus === 'connected'
              ? 'bg-emerald-50 text-emerald-700'
              : connectionStatus === 'connecting'
              ? 'bg-amber-50 text-amber-700'
              : connectionStatus === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              connectionStatus === 'connected'
                ? 'bg-emerald-500'
                : connectionStatus === 'connecting'
                ? 'bg-amber-500'
                : connectionStatus === 'error'
                ? 'bg-red-500'
                : 'bg-slate-400'
            }`}
          />
          {connectionStatus}
        </span>
      </header>
      <div
        ref={containerRef}
        className="mt-1 flex-1 space-y-2 overflow-y-auto rounded-lg border border-[color:var(--app-border-subtle)] bg-[color:var(--app-surface-subtle)] p-3"
      >
        {renderedMessages.length === 0 ? (
          <p className="text-xs text-[color:var(--app-text-muted)]">
            Waiting for transcript messages…
          </p>
        ) : (
          renderedMessages
        )}
      </div>
    </Card>
  )
}

export default React.memo(TranscriptViewer)

