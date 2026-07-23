import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import {
  action as actionClass,
  close,
  content,
  description as descriptionClass,
  icon,
  title as titleClass,
  toast as toastRecipe,
} from '../../primitives/Toast/Toast.css'
import * as css from './ToastProvider.css'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Tone = 'success' | 'warning' | 'danger' | 'info'

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastData {
  id: string
  title: string
  description?: string
  tone: Tone
  action?: ToastAction
  duration: number
  createdAt: number
}

interface ToastInput {
  title: string
  description?: string
  tone?: Tone
  action?: ToastAction
  duration?: number
}

interface ToastContextValue {
  toast: ToastFn
  dismiss: (id: string) => void
  dismissAll: () => void
}

interface ToastFn {
  (input: ToastInput): string
  success: (title: string, opts?: Omit<ToastInput, 'title' | 'tone'>) => string
  warning: (title: string, opts?: Omit<ToastInput, 'title' | 'tone'>) => string
  danger: (title: string, opts?: Omit<ToastInput, 'title' | 'tone'>) => string
  info: (title: string, opts?: Omit<ToastInput, 'title' | 'tone'>) => string
}

/* ------------------------------------------------------------------ */
/*  Reducer                                                            */
/* ------------------------------------------------------------------ */

type Action =
  | { type: 'ADD'; toast: ToastData }
  | { type: 'DISMISS'; id: string }
  | { type: 'DISMISS_ALL' }
  | { type: 'PAUSE_TIMERS' }
  | { type: 'RESUME_TIMERS' }

interface State {
  toasts: ToastData[]
  paused: boolean
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return { ...state, toasts: [...state.toasts, action.toast] }
    case 'DISMISS':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) }
    case 'DISMISS_ALL':
      return { ...state, toasts: [] }
    case 'PAUSE_TIMERS':
      return { ...state, paused: true }
    case 'RESUME_TIMERS':
      return { ...state, paused: false }
    default:
      return state
  }
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TONE_ICON = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
} as const

const DEFAULT_DURATION = 5000

let toastCounter = 0
function genId(): string {
  toastCounter += 1
  return `toast-${toastCounter}-${Date.now()}`
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const ToastContext = createContext<ToastContextValue | null>(null)

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (ctx === null) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return ctx
}

/* ------------------------------------------------------------------ */
/*  Individual toast item (reuses Toast primitive CSS)                  */
/* ------------------------------------------------------------------ */

function ToastItem({
  data,
  onDismiss,
}: {
  data: ToastData
  onDismiss: (id: string) => void
}) {
  const ToneIcon = TONE_ICON[data.tone]
  const isError = data.tone === 'danger'

  return (
    <div className={css.item}>
      <div
        className={toastRecipe({ tone: data.tone })}
        role={isError ? 'alert' : 'status'}
        aria-live={isError ? 'assertive' : 'polite'}
      >
        <span className={icon} aria-hidden="true">
          <ToneIcon size={20} />
        </span>

        <div className={content}>
          <span className={titleClass}>{data.title}</span>
          {data.description !== undefined ? (
            <span className={descriptionClass}>{data.description}</span>
          ) : null}
          {data.action !== undefined ? (
            <button type="button" className={actionClass} onClick={data.action.onClick}>
              {data.action.label}
            </button>
          ) : null}
        </div>

        <button
          type="button"
          className={close}
          onClick={() => onDismiss(data.id)}
          aria-label="Bildirimi kapat"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export interface ToastProviderProps {
  children: ReactNode
  /** Maximum number of visible toasts at once. @default 5 */
  maxVisible?: number
}

/**
 * Birden fazla toast'u kuyrukla yoneten saglayici.
 *
 * Uygulama kokune `<ToastProvider>` sarin, alt bilesenlerden `useToast()`
 * ile toast tetikleyin. Kuyruk, en fazla `maxVisible` toast gosterir;
 * tasan bildirimlerde oncelikle eski, tehlike-disi toast'lar cikarilir.
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 *
 * // Alt bileşende:
 * const { toast } = useToast()
 * toast.success('İlan onaylandı')
 * ```
 */
export function ToastProvider({ children, maxVisible = 5 }: ToastProviderProps) {
  const [state, dispatch] = useReducer(reducer, { toasts: [], paused: false })
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const pausedRef = useRef(false)

  // Keep ref in sync with state for timer callbacks
  pausedRef.current = state.paused

  /* ---------- Auto-dismiss timer management ---------- */

  const dismissById = useCallback((id: string) => {
    dispatch({ type: 'DISMISS', id })
    const existing = timersRef.current.get(id)
    if (existing !== undefined) {
      clearTimeout(existing)
      timersRef.current.delete(id)
    }
  }, [])

  // Start/restart timers for non-danger toasts
  useEffect(() => {
    for (const t of state.toasts) {
      if (t.tone === 'danger' || t.duration <= 0) continue
      if (state.paused) {
        // Clear timer while paused
        const existing = timersRef.current.get(t.id)
        if (existing !== undefined) {
          clearTimeout(existing)
          timersRef.current.delete(t.id)
        }
        continue
      }
      // Only set timer if not already running
      if (!timersRef.current.has(t.id)) {
        const timer = setTimeout(() => {
          timersRef.current.delete(t.id)
          dispatch({ type: 'DISMISS', id: t.id })
        }, t.duration)
        timersRef.current.set(t.id, timer)
      }
    }
  }, [state.toasts, state.paused])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer)
      }
    }
  }, [])

  /* ---------- Queue overflow management ---------- */

  useEffect(() => {
    if (state.toasts.length <= maxVisible) return

    // Find oldest non-danger toast to dismiss
    const toDismiss = state.toasts.find((t) => t.tone !== 'danger')
    if (toDismiss !== undefined) {
      dismissById(toDismiss.id)
    } else {
      // All are danger toasts -- dismiss oldest
      const oldest = state.toasts[0]
      if (oldest !== undefined) dismissById(oldest.id)
    }
  }, [state.toasts, maxVisible, dismissById])

  /* ---------- Build context value ---------- */

  const addToast = useCallback(
    (input: ToastInput): string => {
      const id = genId()
      const data: ToastData = {
        id,
        title: input.title,
        tone: input.tone ?? 'info',
        duration: input.duration ?? DEFAULT_DURATION,
        createdAt: Date.now(),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.action !== undefined && { action: input.action }),
      }
      dispatch({ type: 'ADD', toast: data })
      return id
    },
    [],
  )

  const contextValue = useMemo<ToastContextValue>(() => {
    const toastFn: ToastFn = Object.assign(
      (input: ToastInput) => addToast(input),
      {
        success: (title: string, opts?: Omit<ToastInput, 'title' | 'tone'>) =>
          addToast({ ...opts, title, tone: 'success' }),
        warning: (title: string, opts?: Omit<ToastInput, 'title' | 'tone'>) =>
          addToast({ ...opts, title, tone: 'warning' }),
        danger: (title: string, opts?: Omit<ToastInput, 'title' | 'tone'>) =>
          addToast({ ...opts, title, tone: 'danger' }),
        info: (title: string, opts?: Omit<ToastInput, 'title' | 'tone'>) =>
          addToast({ ...opts, title, tone: 'info' }),
      },
    )

    return {
      toast: toastFn,
      dismiss: dismissById,
      dismissAll: () => {
        for (const timer of timersRef.current.values()) {
          clearTimeout(timer)
        }
        timersRef.current.clear()
        dispatch({ type: 'DISMISS_ALL' })
      },
    }
  }, [addToast, dismissById])

  /* ---------- Render ---------- */

  const visibleToasts = state.toasts.slice(-maxVisible)

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {visibleToasts.length > 0 && typeof document !== 'undefined'
        ? createPortal(
            <div
              className={css.stack}
              onMouseEnter={() => dispatch({ type: 'PAUSE_TIMERS' })}
              onMouseLeave={() => dispatch({ type: 'RESUME_TIMERS' })}
            >
              {visibleToasts.map((t) => (
                <ToastItem key={t.id} data={t} onDismiss={dismissById} />
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  )
}
