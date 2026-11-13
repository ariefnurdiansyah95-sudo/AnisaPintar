'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { defaultState, loadState, saveState, type ProgressState } from '@/lib/progress'

interface Ctx {
  state: ProgressState
  ready: boolean
  update: (fn: (s: ProgressState) => ProgressState) => void
  replace: (s: ProgressState) => void
  reset: () => void
}
const C = createContext<Ctx | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(defaultState)
  const [ready, setReady] = useState(false)
  const ref = useRef(state)
  ref.current = state

  useEffect(() => {
    const s = loadState()
    ref.current = s
    setState(s)
    setReady(true)
  }, [])

  const update = useCallback((fn: (s: ProgressState) => ProgressState) => {
    const next = fn(ref.current)
    ref.current = next
    setState(next)
    saveState(next)
  }, [])
  const replace = useCallback((s: ProgressState) => { ref.current = s; setState(s); saveState(s) }, [])
  const reset = useCallback(() => replace(defaultState()), [replace])

  return <C.Provider value={{ state, ready, update, replace, reset }}>{children}</C.Provider>
}

export function useProgress() {
  const c = useContext(C)
  if (!c) throw new Error('useProgress di luar ProgressProvider')
  return c
}
