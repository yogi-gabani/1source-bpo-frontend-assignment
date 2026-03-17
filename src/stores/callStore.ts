import { create } from 'zustand'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export type Transcript = {
  type: 'transcript'
  agentId: string
  text: string
  timestamp: number
}

export type CallState = {
  activeCall: string | null
  transcripts: Transcript[]
  connectionStatus: ConnectionStatus
}

type CallActions = {
  setActiveCall: (callId: string | null) => void
  addTranscript: (message: Transcript) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  clearCall: () => void
}

export type CallStore = CallState & CallActions

export const useCallStore = create<CallStore>((set) => ({
  activeCall: null,
  transcripts: [],
  connectionStatus: 'disconnected',

  setActiveCall: (callId) =>
    set(() => ({
      activeCall: callId,
      // Optionally clear previous transcripts when switching calls.
      transcripts: [],
    })),

  addTranscript: (message) =>
    set((state) => ({
      transcripts: [...state.transcripts, message],
    })),

  setConnectionStatus: (status) =>
    set(() => ({
      connectionStatus: status,
    })),

  clearCall: () =>
    set(() => ({
      activeCall: null,
      transcripts: [],
      connectionStatus: 'disconnected',
    })),
}))

