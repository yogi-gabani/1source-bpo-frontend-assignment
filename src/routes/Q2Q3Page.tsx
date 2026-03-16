import React from 'react'
import { EscalateButton } from '../components/EscalateButton'
import { Card } from '../components/Card'

const Q2Q3Page: React.FC = () => {
  const demoCallId = 'escalate-demo-1'

  return (
    <section className="space-y-4">
      <Card>
        <h2 className="mb-1 text-sm font-semibold text-[color:var(--app-accent-strong)]">
          State Store
        </h2>
        <p className="text-xs text-[color:var(--app-text-muted)]">
          Zustand store in <code>callStore.ts</code> drives the transcript
          component and connection status badge.
        </p>
      </Card>
      <Card>
        <h2 className="mb-2 text-sm font-semibold text-[color:var(--app-accent-strong)]">
          Optimistic Escalation
        </h2>
        <p className="mb-3 text-xs text-[color:var(--app-text-muted)]">
          Button uses TanStack Query optimistic updates with rollback on error.
        </p>
        <EscalateButton callId={demoCallId} />
      </Card>
    </section>
  )
}

export default Q2Q3Page

