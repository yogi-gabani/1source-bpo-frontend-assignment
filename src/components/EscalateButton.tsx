import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type Call = {
  id: string
  escalated: boolean
  // ...other fields if needed
}

type EscalateButtonProps = {
  callId: string
}

async function escalateCallRequest(callId: string): Promise<void> {
  // For this local demo we call json-server directly.
  // json-server supports PATCH on resource items, so we PATCH /calls/:id
  // instead of POST /calls/:id.
  const res = await fetch(`http://localhost:3000/calls/${callId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ escalated: true }),
  })
  if (!res.ok) {
    throw new Error('Failed to escalate call')
  }
}

/**
 * Implements an optimistic UI update for marking a call as escalated.
 */
export const EscalateButton: React.FC<EscalateButtonProps> = ({ callId }) => {
  const queryClient = useQueryClient()

  // Subscribe to the call data so UI re-renders when cache changes.
  const { data: call } = useQuery<Call>({
    queryKey: ['call', callId],
    // For this demo we just seed local state; in a real app you'd fetch from API.
    queryFn: async () => {
      return (
        queryClient.getQueryData<Call>(['call', callId]) ?? {
          id: callId,
          escalated: false,
        }
      )
    },
  })

  const mutation = useMutation({
    mutationFn: escalateCallRequest,
    // 1. Optimistically update UI
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['call', id] })

      const previousCall =
        queryClient.getQueryData<Call>(['call', id]) ?? {
          id,
          escalated: false,
        }

      queryClient.setQueryData<Call | undefined>(['call', id], (old) =>
        old ? { ...old, escalated: true } : old,
      )

      return { previousCall }
    },
    // 3. Revert on error
    onError: (_error, id, context) => {
      if (context?.previousCall) {
        queryClient.setQueryData(['call', id], context.previousCall)
      }
    },
  })

  const isEscalated = call?.escalated ?? false

  return (
    <button
      type="button"
      onClick={() => mutation.mutate(callId)}
      disabled={mutation.isPending}
      className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium shadow-sm transition-colors ${
        isEscalated
          ? 'bg-emerald-500 text-white'
          : 'bg-[color:var(--app-accent)] text-white hover:bg-indigo-700'
      } disabled:opacity-60`}
    >
      {isEscalated ? 'Escalated' : 'Mark as Escalated'}
    </button>
  )
}

