import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { IconButton } from '../../primitives/IconButton'
import * as css from './KeyboardShortcuts.css'

/* ────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────── */

export type ShortcutSection = 'Gezinme' | 'Islemler' | 'Moderasyon' | 'Genel'

export interface ShortcutDefinition {
  /** Unique identifier (used for register/unregister). */
  id: string
  /**
   * Key combo description.
   * - Single key: `"?"`, `"Escape"`
   * - With modifier: `"Cmd+S"`, `"Cmd+K"`
   *   (`Cmd` is automatically mapped to `Meta` on Mac and `Ctrl` on Windows/Linux.)
   * - Sequence: `"G then L"` — user presses G, then L within 800ms.
   */
  keys: string
  /** Human-readable description shown in the help overlay. */
  description: string
  /** Section for grouping in the help overlay. */
  section: ShortcutSection
  /** Callback invoked when the shortcut fires. May be `undefined` for display-only entries. */
  callback?: () => void
}

interface KeyboardShortcutsContextValue {
  registerShortcut: (id: string, def: Omit<ShortcutDefinition, 'id'>) => void
  unregisterShortcut: (id: string) => void
  shortcuts: Map<string, ShortcutDefinition>
  openHelp: () => void
  closeHelp: () => void
  helpOpen: boolean
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextValue | null>(null)

/* ────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────── */

const isMac =
  typeof navigator !== 'undefined' ? /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) : true

/** Resolve `Cmd` to the correct modifier for the current OS. */
function resolveModifier(key: string): string {
  if (key === 'Cmd') return isMac ? 'Meta' : 'Control'
  return key
}

/** Parse a key string like `"Cmd+S"` or `"G then L"` into structured form. */
function parseKeys(keys: string): { sequence: { modifiers: string[]; key: string }[] } {
  const parts = keys.split(' then ').map((part) => part.trim())
  return {
    sequence: parts.map((part) => {
      const segments = part.split('+')
      const key = segments[segments.length - 1] ?? ''
      const modifiers = segments.slice(0, -1).map(resolveModifier)
      return { modifiers, key }
    }),
  }
}

function isInputFocused(): boolean {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if ((el as HTMLElement).isContentEditable) return true
  return false
}

function matchesKeyCombo(
  e: KeyboardEvent,
  combo: { modifiers: string[]; key: string },
): boolean {
  const modMap: Record<string, boolean> = {
    Meta: e.metaKey,
    Control: e.ctrlKey,
    Shift: e.shiftKey,
    Alt: e.altKey,
  }

  // Check all required modifiers are pressed
  for (const mod of combo.modifiers) {
    if (!modMap[mod]) return false
  }

  // Check no extra modifiers are pressed (except for the required ones)
  const allMods = ['Meta', 'Control', 'Shift', 'Alt']
  for (const mod of allMods) {
    if (!combo.modifiers.includes(mod) && modMap[mod]) return false
  }

  // Match key (case-insensitive for letters)
  const pressed = e.key.length === 1 ? e.key.toUpperCase() : e.key
  const expected = combo.key.length === 1 ? combo.key.toUpperCase() : combo.key

  return pressed === expected
}

/** Render a key combo for display (replaces `Cmd` with platform symbol). */
function formatKeyForDisplay(key: string): string {
  if (key === 'Cmd') return isMac ? '\u2318' : 'Ctrl'
  if (key === 'Shift') return isMac ? '\u21E7' : 'Shift'
  if (key === 'Alt') return isMac ? '\u2325' : 'Alt'
  if (key === 'Escape') return 'Esc'
  if (key === 'Meta') return isMac ? '\u2318' : 'Ctrl'
  if (key === 'Control') return 'Ctrl'
  return key
}

const SECTION_ORDER: ShortcutSection[] = ['Genel', 'Gezinme', 'Islemler', 'Moderasyon']

const SEQUENCE_TIMEOUT = 800

/* ────────────────────────────────────────────────────────────
   Provider
   ──────────────────────────────────────────────────────────── */

export interface KeyboardShortcutsProviderProps {
  children: ReactNode
  /** If true, the help overlay starts open (useful for stories). */
  defaultHelpOpen?: boolean
}

export function KeyboardShortcutsProvider({
  children,
  defaultHelpOpen = false,
}: KeyboardShortcutsProviderProps) {
  const shortcutsRef = useRef<Map<string, ShortcutDefinition>>(new Map())
  const [, forceRender] = useState(0)
  const [helpOpen, setHelpOpen] = useState(defaultHelpOpen)

  // Sequence tracking
  const pendingSequenceRef = useRef<{ key: string; time: number } | null>(null)

  const registerShortcut = useCallback(
    (id: string, def: Omit<ShortcutDefinition, 'id'>) => {
      shortcutsRef.current.set(id, { ...def, id })
      forceRender((n) => n + 1)
    },
    [],
  )

  const unregisterShortcut = useCallback((id: string) => {
    shortcutsRef.current.delete(id)
    forceRender((n) => n + 1)
  }, [])

  const openHelp = useCallback(() => setHelpOpen(true), [])
  const closeHelp = useCallback(() => setHelpOpen(false), [])

  // Register built-in shortcuts
  useEffect(() => {
    registerShortcut('help', {
      keys: '?',
      description: 'Klavye kisayollarini goster',
      section: 'Genel',
      callback: () => setHelpOpen(true),
    })
    registerShortcut('cmd-k', {
      keys: 'Cmd+K',
      description: 'Komut paletini ac',
      section: 'Genel',
      // No callback — DynamicIsland handles this.
    })
    registerShortcut('cmd-s', {
      keys: 'Cmd+S',
      description: 'Kaydet',
      section: 'Islemler',
      callback: () => {
        document.dispatchEvent(new CustomEvent('keyboard-shortcut:save'))
      },
    })
    registerShortcut('escape', {
      keys: 'Escape',
      description: 'Aktif modal/drawer kapat',
      section: 'Genel',
      // No callback — browser/Base UI dialogs handle Escape natively.
    })
    registerShortcut('g-l', {
      keys: 'G then L',
      description: 'Ilanlara git',
      section: 'Gezinme',
      callback: () => {
        document.dispatchEvent(new CustomEvent('keyboard-shortcut:navigate', { detail: '/listings' }))
      },
    })
    registerShortcut('g-d', {
      keys: 'G then D',
      description: 'Panoya git',
      section: 'Gezinme',
      callback: () => {
        document.dispatchEvent(new CustomEvent('keyboard-shortcut:navigate', { detail: '/dashboard' }))
      },
    })
    registerShortcut('g-u', {
      keys: 'G then U',
      description: 'Kullanicilara git',
      section: 'Gezinme',
      callback: () => {
        document.dispatchEvent(new CustomEvent('keyboard-shortcut:navigate', { detail: '/users' }))
      },
    })
    registerShortcut('g-m', {
      keys: 'G then M',
      description: 'Moderasyona git',
      section: 'Moderasyon',
      callback: () => {
        document.dispatchEvent(
          new CustomEvent('keyboard-shortcut:navigate', { detail: '/moderation' }),
        )
      },
    })

    return () => {
      ;['help', 'cmd-k', 'cmd-s', 'escape', 'g-l', 'g-d', 'g-u', 'g-m'].forEach(
        unregisterShortcut,
      )
    }
  }, [registerShortcut, unregisterShortcut])

  // Global keydown listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Skip modifier-only key presses
      if (['Meta', 'Control', 'Shift', 'Alt'].includes(e.key)) return

      const now = Date.now()

      for (const def of shortcutsRef.current.values()) {
        if (!def.callback) continue

        const parsed = parseKeys(def.keys)
        const isSequence = parsed.sequence.length > 1

        if (isSequence) {
          const [first, second] = parsed.sequence
          const pending = pendingSequenceRef.current

          // Check if we're completing a sequence
          if (first !== undefined && second !== undefined && pending && now - pending.time < SEQUENCE_TIMEOUT) {
            const firstKey = first.key.toUpperCase()
            if (pending.key === firstKey && matchesKeyCombo(e, second)) {
              e.preventDefault()
              pendingSequenceRef.current = null
              def.callback()
              return
            }
          }

          // Check if this starts a sequence (only if no modifiers for the first key)
          if (first !== undefined && first.modifiers.length === 0 && matchesKeyCombo(e, first) && !isInputFocused()) {
            pendingSequenceRef.current = { key: first.key.toUpperCase(), time: now }
            // Don't return — let other single-key shortcuts also check.
          }
        } else {
          const combo = parsed.sequence[0]
          if (combo === undefined) continue
          const hasModifier = combo.modifiers.length > 0

          // Skip non-modifier shortcuts when input is focused
          if (!hasModifier && isInputFocused()) continue

          // Don't handle Cmd+K — DynamicIsland owns it
          if (def.id === 'cmd-k') continue

          if (matchesKeyCombo(e, combo)) {
            // For '?' key — it's Shift+/ on most keyboards, but we check the literal char
            if (def.keys === '?') {
              if (e.key !== '?') continue
              if (isInputFocused()) continue
            }

            e.preventDefault()
            pendingSequenceRef.current = null
            def.callback()
            return
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const contextValue = useMemo<KeyboardShortcutsContextValue>(
    () => ({
      registerShortcut,
      unregisterShortcut,
      shortcuts: shortcutsRef.current,
      openHelp,
      closeHelp,
      helpOpen,
    }),
    [registerShortcut, unregisterShortcut, openHelp, closeHelp, helpOpen],
  )

  return (
    <KeyboardShortcutsContext.Provider value={contextValue}>
      {children}
      <HelpOverlay open={helpOpen} onOpenChange={setHelpOpen} shortcuts={shortcutsRef.current} />
    </KeyboardShortcutsContext.Provider>
  )
}

/* ────────────────────────────────────────────────────────────
   Hook: useKeyboardShortcut
   ──────────────────────────────────────────────────────────── */

export interface UseKeyboardShortcutOptions {
  /** Section to display in help overlay. @default "Genel" */
  section?: ShortcutSection
  /** Whether the shortcut is currently enabled. @default true */
  enabled?: boolean
}

/**
 * Register a keyboard shortcut. Automatically unregisters on unmount.
 *
 * @example
 * useKeyboardShortcut('Cmd+Shift+P', () => togglePreview(), {
 *   section: 'Islemler',
 * })
 */
export function useKeyboardShortcut(
  keys: string,
  description: string,
  callback: () => void,
  options: UseKeyboardShortcutOptions = {},
): void {
  const ctx = useContext(KeyboardShortcutsContext)
  const { section = 'Genel', enabled = true } = options
  const idRef = useRef(`shortcut-${keys}-${Math.random().toString(36).slice(2, 8)}`)

  useEffect(() => {
    if (!ctx || !enabled) return
    const id = idRef.current
    ctx.registerShortcut(id, { keys, description, section, callback })
    return () => ctx.unregisterShortcut(id)
  }, [ctx, keys, description, section, callback, enabled])
}

/* ────────────────────────────────────────────────────────────
   KeyComboDisplay — renders a key combo as styled <kbd> elements
   ──────────────────────────────────────────────────────────── */

export function KeyComboDisplay({ keys }: { keys: string }) {
  const parts = keys.split(' then ')
  return (
    <span className={css.keys}>
      {parts.map((part, i) => (
        <span key={i} className={css.keys}>
          {i > 0 && <span className={css.thenLabel}>then</span>}
          {part.split('+').map((seg, j) => (
            <kbd key={j} className={css.kbd}>
              {formatKeyForDisplay(seg.trim())}
            </kbd>
          ))}
        </span>
      ))}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────
   HelpOverlay — modal showing all registered shortcuts
   ──────────────────────────────────────────────────────────── */

interface HelpOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shortcuts: Map<string, ShortcutDefinition>
}

function HelpOverlay({ open, onOpenChange, shortcuts }: HelpOverlayProps) {
  const grouped = useMemo(() => {
    const map = new Map<ShortcutSection, ShortcutDefinition[]>()
    for (const s of SECTION_ORDER) map.set(s, [])
    for (const def of shortcuts.values()) {
      const list = map.get(def.section)
      if (list) list.push(def)
      else map.set(def.section, [def])
    }
    // Remove empty sections
    for (const [key, value] of map) {
      if (value.length === 0) map.delete(key)
    }
    return map
  }, [shortcuts, open]) // re-derive when overlay opens

  return (
    <Dialog.Root open={open} onOpenChange={(next: boolean) => onOpenChange(next)}>
      <Dialog.Portal>
        <Dialog.Backdrop className={css.backdrop} />
        <Dialog.Popup className={css.popup}>
          <div className={css.header}>
            <Dialog.Title className={css.title}>Klavye Kisayollari</Dialog.Title>
            <Dialog.Close
              render={<IconButton icon={<X size={18} />} label="Kapat" size="sm" variant="ghost" />}
            />
          </div>

          <div className={css.body}>
            {[...grouped.entries()].map(([sectionName, defs]) => (
              <div key={sectionName} className={css.section}>
                <h3 className={css.sectionTitle}>{sectionName}</h3>
                {defs.map((def) => (
                  <div key={def.id} className={css.row}>
                    <span className={css.description}>{def.description}</span>
                    <KeyComboDisplay keys={def.keys} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={css.footer}>
            <span>
              <kbd className={css.kbd}>Esc</kbd> ile kapat
            </span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
