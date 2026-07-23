import { useRef, useEffect, useCallback, useState } from 'react'
import type { KeyboardEvent, ChangeEvent } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  BarChart3,
  ChevronRight,
  FileText,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import { IconButton } from '../../primitives/IconButton'
import { Avatar } from '../../primitives/Avatar'
import {
  actionArrow,
  actionCard,
  actionText,
  aiAvatar,
  backdrop,
  contextBar,
  contextPill,
  emptyIcon,
  emptyState,
  emptySubtitle,
  emptyTitle,
  fab,
  header,
  headerBadge,
  headerInfo,
  headerTitle,
  inputArea,
  insightBody,
  insightCard,
  insightIcon,
  insightLabel,
  insightTrend,
  insightValue,
  listingCard,
  listingInfo,
  listingMeta,
  listingThumb,
  listingTitle,
  markdownContent,
  messageBubble,
  messageList,
  messageRow,
  messageAvatarSlot,
  messageTimestamp,
  panel,
  quickActionChip,
  quickActionsBar,
  sendButton,
  table,
  tableWrapper,
  textarea,
  typingDot,
  typingDots,
  typingIndicator,
  typingLabel,
  visuallyHidden,
} from './AIChatPanel.css'

/* ── Types ── */

export interface ChatMessageMetadata {
  icon?: string
  value?: string
  trend?: string
  actionId?: string
  listingId?: string
  listingTitle?: string
  listingPrice?: string
  listingImage?: string
  tableData?: { headers: string[]; rows: string[][] }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  type: 'text' | 'insight' | 'action' | 'chart' | 'listing' | 'table'
  timestamp: string
  metadata?: ChatMessageMetadata
}

export interface AIChatPanelProps {
  /** Panelin gorunurlugu. */
  open: boolean
  /** Aciklik degistiginde calisir. */
  onOpenChange: (open: boolean) => void
  /** Panel modu: drawer (overlay) veya docked (kalici yan panel). */
  mode?: 'drawer' | 'docked'
  /** Mesaj listesi. */
  messages: ChatMessage[]
  /** Yeni mesaj gonderildiginde calisir. */
  onSendMessage: (text: string) => void
  /** AI "dusunuyor" gostergesi. */
  isTyping?: boolean
  /** Adminin o an bakigi sayfa. */
  currentPage?: string
  /** Secili varlik bilgisi. */
  selectedEntity?: { type: string; id: string; title: string }
  /** Hizli eylem cip'leri. */
  quickActions?: { label: string; prompt: string }[]
  /** Hizli eylem tiklandiginda calisir. */
  onQuickAction?: (prompt: string) => void
  /** FAB'da okunmamis gostergesi icin pulse. */
  hasUnread?: boolean
}

/* ── Helpers ── */

/**
 * Basit goreceli zaman: "az once", "2dk once", "1sa once", "dun" vs.
 * Gercek i18n icin `Intl.RelativeTimeFormat` kullanilabilir; burada
 * bilesenin Storybook'ta calisabilmesi icin minimal tutuldu.
 */
function relativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffSec = Math.floor((now - then) / 1000)

  if (diffSec < 60) return 'az once'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}dk once`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}sa once`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay === 1) return 'dun'
  return `${diffDay}g once`
}

/**
 * Cok basit markdown render: **bold**, `code`, satirbasinda - ile liste.
 * Tam bir markdown parser yerine sadece chat mesajlarinda yaygin kaliplari isle.
 */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const result: React.ReactNode[] = []
  let listItems: string[] = []
  let key = 0

  const flushList = () => {
    if (listItems.length > 0) {
      result.push(
        <ul key={key++}>
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>,
      )
      listItems = []
    }
  }

  const renderInline = (line: string): React.ReactNode => {
    // Match **bold** and `code`
    const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i}>{part.slice(1, -1)}</code>
      }
      return part
    })
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2))
    } else {
      flushList()
      if (trimmed === '') {
        result.push(<br key={key++} />)
      } else {
        result.push(<p key={key++} style={{ margin: 0 }}>{renderInline(trimmed)}</p>)
      }
    }
  }
  flushList()

  return result
}

function getInsightIconElement(iconName?: string) {
  switch (iconName) {
    case 'TrendingUp':
      return <TrendingUp size={18} />
    case 'TrendingDown':
      return <TrendingDown size={18} />
    case 'AlertTriangle':
      return <AlertTriangle size={18} />
    case 'BarChart3':
      return <BarChart3 size={18} />
    default:
      return <TrendingUp size={18} />
  }
}

function getTrendDirection(trend?: string): 'up' | 'down' | 'neutral' {
  if (!trend) return 'neutral'
  if (trend.startsWith('+') || trend.startsWith('↑')) return 'up'
  if (trend.startsWith('-') || trend.startsWith('↓')) return 'down'
  return 'neutral'
}

const ENTITY_TYPE_LABELS: Record<string, string> = {
  listing: 'Ilan',
  user: 'Kullanici',
  report: 'Rapor',
}

/* ── Sub-components ── */

function MessageContent({ message }: { message: ChatMessage }) {
  switch (message.type) {
    case 'insight':
      return (
        <div className={insightCard}>
          <div className={insightIcon}>
            {getInsightIconElement(message.metadata?.icon)}
          </div>
          <div className={insightBody}>
            <div>
              <span className={insightValue}>{message.metadata?.value}</span>
              {message.metadata?.trend ? (
                <span className={insightTrend({ direction: getTrendDirection(message.metadata.trend) })}>
                  {message.metadata.trend}
                </span>
              ) : null}
            </div>
            <div className={insightLabel}>{message.content}</div>
          </div>
        </div>
      )

    case 'action':
      return (
        <div className={actionCard} role="button" tabIndex={0}>
          <span className={actionText}>{message.content}</span>
          <ChevronRight size={16} className={actionArrow} />
        </div>
      )

    case 'table':
      if (!message.metadata?.tableData) {
        return <div className={markdownContent}>{renderMarkdown(message.content)}</div>
      }
      return (
        <div>
          {message.content ? (
            <div className={markdownContent} style={{ marginBlockEnd: '0.5rem' }}>
              {renderMarkdown(message.content)}
            </div>
          ) : null}
          <div className={tableWrapper}>
            <table className={table}>
              <thead>
                <tr>
                  {message.metadata.tableData.headers.map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {message.metadata.tableData.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'listing':
      return (
        <div className={listingCard}>
          <div
            className={listingThumb}
            style={{
              backgroundImage: message.metadata?.listingImage
                ? `url(${message.metadata.listingImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className={listingInfo}>
            <div className={listingTitle}>
              {message.metadata?.listingTitle ?? message.content}
            </div>
            <div className={listingMeta}>
              {message.metadata?.listingId ? `#${message.metadata.listingId}` : ''}
              {message.metadata?.listingPrice ? ` - ${message.metadata.listingPrice}` : ''}
            </div>
            {message.content && message.metadata?.listingTitle ? (
              <div className={listingMeta}>{message.content}</div>
            ) : null}
          </div>
        </div>
      )

    case 'chart':
      return (
        <div className={insightCard}>
          <div className={insightIcon}>
            <BarChart3 size={18} />
          </div>
          <div className={insightBody}>
            <div className={insightValue}>{message.metadata?.value}</div>
            <div className={insightLabel}>{message.content}</div>
          </div>
        </div>
      )

    case 'text':
    default:
      return <div className={markdownContent}>{renderMarkdown(message.content)}</div>
  }
}

function TypingIndicatorRow() {
  return (
    <div className={messageRow({ role: 'assistant' })}>
      <div className={messageAvatarSlot}>
        <span className={aiAvatar} aria-hidden="true">
          <Sparkles size={14} />
        </span>
      </div>
      <div className={typingIndicator}>
        <div className={typingDots}>
          <span className={typingDot} />
          <span className={typingDot} />
          <span className={typingDot} />
        </div>
        <span className={typingLabel}>Arsam AI yaziyor...</span>
      </div>
    </div>
  )
}

function EmptyChat() {
  return (
    <div className={emptyState}>
      <Sparkles size={40} className={emptyIcon} />
      <div className={emptyTitle}>Arsam AI Asistani</div>
      <div className={emptySubtitle}>
        Moderasyon, analitik, ilan yonetimi ve sistem islemleri icin
        dogal dilde sorular sorun.
      </div>
    </div>
  )
}

/* ── Main component ── */

/**
 * AI Sohbet Paneli.
 *
 * Iki modda calisir:
 * - `drawer`: overlay olarak sag taraftan acilir/kapanir
 * - `docked`: kalici yan panel olarak gorunur
 *
 * Mesajlar, yazma gostergesi ve hizli eylem cip'leri tamamen prop ile
 * kontrol edilir — bilesenin kendi AI backend'i yoktur.
 *
 * @example
 * <AIChatPanel
 *   open={open}
 *   onOpenChange={setOpen}
 *   messages={messages}
 *   onSendMessage={handleSend}
 *   isTyping={isTyping}
 *   quickActions={[{ label: 'Ozet', prompt: 'Bekleyen ilanlari ozetle' }]}
 * />
 */
export function AIChatPanel({
  open,
  onOpenChange,
  mode = 'drawer',
  messages,
  onSendMessage,
  isTyping = false,
  currentPage,
  selectedEntity,
  quickActions,
  onQuickAction,
  hasUnread = false,
}: AIChatPanelProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [draft, setDraft] = useState('')

  // Auto-scroll to bottom when new messages arrive or typing starts
  useEffect(() => {
    const el = listRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages.length, isTyping])

  // Focus textarea when panel opens
  useEffect(() => {
    if (open) {
      // Small delay to let animation start
      const t = setTimeout(() => textareaRef.current?.focus(), 100)
      return () => clearTimeout(t)
    }
  }, [open])

  // Auto-grow textarea
  const handleInput = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 96)}px` // max ~4 lines
  }, [])

  const handleSend = useCallback(() => {
    const text = draft.trim()
    if (text === '') return
    onSendMessage(text)
    setDraft('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [draft, onSendMessage])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleQuickAction = useCallback(
    (prompt: string) => {
      if (onQuickAction) {
        onQuickAction(prompt)
      } else {
        onSendMessage(prompt)
      }
    },
    [onQuickAction, onSendMessage],
  )

  const hasContext = currentPage !== undefined || selectedEntity !== undefined
  const hasQuickActions = quickActions !== undefined && quickActions.length > 0
  const isEmpty = messages.length === 0

  // FAB when closed
  if (!open) {
    return (
      <button
        className={fab({ pulse: hasUnread })}
        onClick={() => onOpenChange(true)}
        aria-label="Arsam AI asistanini ac"
        type="button"
      >
        <Sparkles size={24} />
      </button>
    )
  }

  const panelContent = (
    <div
      className={panel({ mode })}
      role="complementary"
      aria-label="Arsam AI Asistani"
    >
      {/* Header */}
      <div className={header}>
        <div className={headerInfo}>
          <span className={aiAvatar} aria-hidden="true">
            <Sparkles size={16} />
          </span>
          <span className={headerTitle}>Arsam AI</span>
          <span className={headerBadge}>Beta</span>
        </div>
        <IconButton
          icon={<X size={18} />}
          label="Paneli kapat"
          size="sm"
          variant="ghost"
          onClick={() => onOpenChange(false)}
        />
      </div>

      {/* Context bar */}
      {hasContext ? (
        <div className={contextBar}>
          {currentPage !== undefined ? (
            <span className={contextPill}>
              <FileText size={12} />
              Sayfa: {currentPage}
            </span>
          ) : null}
          {selectedEntity !== undefined ? (
            <span className={contextPill}>
              <ArrowRight size={12} />
              {ENTITY_TYPE_LABELS[selectedEntity.type] ?? selectedEntity.type}: #{selectedEntity.id} {selectedEntity.title}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Message list */}
      <div className={messageList} ref={listRef} tabIndex={0}>
        {isEmpty && !isTyping ? <EmptyChat /> : null}

        {messages.map((msg) => (
          <div key={msg.id} className={messageRow({ role: msg.role })}>
            {msg.role === 'assistant' ? (
              <div className={messageAvatarSlot}>
                <span className={aiAvatar} aria-hidden="true">
                  <Sparkles size={14} />
                </span>
              </div>
            ) : null}

            <div>
              <div className={messageBubble({ role: msg.role })}>
                <MessageContent message={msg} />
              </div>
              <div className={messageTimestamp}>{relativeTime(msg.timestamp)}</div>
            </div>

            {msg.role === 'user' ? (
              <div className={messageAvatarSlot}>
                <Avatar name="Admin" size="sm" />
              </div>
            ) : null}
          </div>
        ))}

        {isTyping ? <TypingIndicatorRow /> : null}
      </div>

      {/* Quick action chips */}
      {hasQuickActions ? (
        <div className={quickActionsBar}>
          {quickActions!.map((action) => (
            <button
              key={action.prompt}
              className={quickActionChip}
              onClick={() => handleQuickAction(action.prompt)}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Input area */}
      <div className={inputArea}>
        <textarea
          ref={textareaRef}
          className={textarea}
          value={draft}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Arsam AI'ya sorun..."
          rows={1}
          aria-label="Mesaj yazin"
        />
        <button
          className={sendButton({ disabled: draft.trim() === '' })}
          onClick={handleSend}
          disabled={draft.trim() === ''}
          type="button"
          aria-label="Mesaji gonder"
        >
          <ArrowUp size={18} />
        </button>
      </div>

      <span className={visuallyHidden} aria-live="polite">
        {isTyping ? 'Arsam AI yaziyor' : ''}
      </span>
    </div>
  )

  // Drawer mode: overlay with backdrop
  if (mode === 'drawer') {
    return (
      <>
        <div
          className={backdrop}
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
        {panelContent}
      </>
    )
  }

  // Docked mode: no backdrop
  return panelContent
}
