import { useCallback, useEffect, useRef, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import {
  Building2,
  Clock,
  Lightbulb,
  Search,
  SearchX,
  Sparkles,
  Terminal,
  Users,
  Activity,
  X,
} from 'lucide-react'
import * as css from './AISmartSearch.css'

/* ------------------------------------------------------------------ */
/*  Tipler                                                             */
/* ------------------------------------------------------------------ */

export interface SearchResult {
  id: string
  title: string
  description?: string
  /** Listing thumbnail URL */
  thumbnail?: string
  /** User avatar URL */
  avatar?: string
  /** Price label (e.g. "4.200.000 TL") */
  price?: string
  /** Status badge */
  status?: { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }
}

export interface ParsedChip {
  label: string
  value: string
  /** Category determines chip color: location, type, price, status, user, date */
  category: string
}

export interface AISmartSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSearch?: (query: string) => void
  results?: {
    listings: SearchResult[]
    users: SearchResult[]
    actions: SearchResult[]
    commands: SearchResult[]
  }
  parsedQuery?: { chips: ParsedChip[] }
  suggestions?: string[]
  recentSearches?: string[]
  onClearHistory?: () => void
  onResultClick?: (type: string, id: string) => void
  isSearching?: boolean
}

/* ------------------------------------------------------------------ */
/*  Chip kategori esleme                                               */
/* ------------------------------------------------------------------ */

type ChipCategory = 'location' | 'type' | 'price' | 'status' | 'user' | 'date' | 'default'

const CATEGORY_MAP: Record<string, ChipCategory> = {
  location: 'location',
  konum: 'location',
  type: 'type',
  tip: 'type',
  price: 'price',
  fiyat: 'price',
  status: 'status',
  durum: 'status',
  user: 'user',
  kullanici: 'user',
  date: 'date',
  tarih: 'date',
}

function chipCategory(raw: string): ChipCategory {
  return CATEGORY_MAP[raw.toLowerCase()] ?? 'default'
}

/* ------------------------------------------------------------------ */
/*  Kategori tab tanimlari                                             */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { key: 'listings', label: 'Ilanlar', icon: Building2 },
  { key: 'users', label: 'Kullanicilar', icon: Users },
  { key: 'actions', label: 'Islemler', icon: Activity },
  { key: 'commands', label: 'Komutlar', icon: Terminal },
] as const

type CategoryKey = (typeof CATEGORIES)[number]['key']

/* ------------------------------------------------------------------ */
/*  Bilesen                                                            */
/* ------------------------------------------------------------------ */

/**
 * AI destekli akilli arama overlay'i.
 *
 * Dogal dil sorgularini anlayan (gorselde chip'lerle gosterilen) ve sonuclari
 * kategorize eden bir arama bileseni. Tum sonuclar ve ayristirma props uzerinden
 * gelir — bilesen arama mantigi iceremez. Glass estetigi DynamicIsland ile
 * ayni koyu cam-morfizm dilindedir.
 *
 * @example
 * <AISmartSearch
 *   open={open}
 *   onOpenChange={setOpen}
 *   onSearch={handleSearch}
 *   results={results}
 *   parsedQuery={{ chips: [{ label: 'Konum', value: 'Kadikoy', category: 'location' }] }}
 * />
 */
export function AISmartSearch({
  open,
  onOpenChange,
  onSearch,
  results,
  parsedQuery,
  suggestions,
  recentSearches,
  onClearHistory,
  onResultClick,
  isSearching,
}: AISmartSearchProps) {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<CategoryKey>('listings')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Acildiginda input'a odaklan.
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelectedIndex(-1)
    } else {
      setQuery('')
    }
  }, [open])

  // Aktif tab'daki sonuclar.
  const activeResults: SearchResult[] = results?.[activeTab] ?? []

  // Toplam sonuc sayilari.
  const counts: Record<CategoryKey, number> = {
    listings: results?.listings?.length ?? 0,
    users: results?.users?.length ?? 0,
    actions: results?.actions?.length ?? 0,
    commands: results?.commands?.length ?? 0,
  }

  const hasResults = Object.values(counts).some((c) => c > 0)
  const hasQuery = query.trim().length > 0
  const hasChips = (parsedQuery?.chips?.length ?? 0) > 0

  // Arama gonder.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    setSelectedIndex(-1)
    onSearch?.(val)
  }

  // Son arama tikla.
  const handleRecentClick = (text: string) => {
    setQuery(text)
    onSearch?.(text)
  }

  // Oneri tikla.
  const handleSuggestionClick = (text: string) => {
    setQuery(text)
    onSearch?.(text)
  }

  // Klavye navigasyonu.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, activeResults.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, -1))
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        const item = activeResults[selectedIndex]
        if (item) onResultClick?.(activeTab, item.id)
      }
    },
    [activeResults, activeTab, selectedIndex, onResultClick],
  )

  // Sonucu renderla.
  const renderResult = (item: SearchResult, index: number, type: CategoryKey) => {
    const isSelected = index === selectedIndex

    return (
      <button
        key={item.id}
        type="button"
        className={css.resultItem({ selected: isSelected })}
        onClick={() => onResultClick?.(type, item.id)}
        data-selected={isSelected || undefined}
      >
        {/* Gorsel: thumbnail, avatar veya ikon */}
        {item.thumbnail ? (
          <img src={item.thumbnail} alt="" className={css.resultThumbnail} />
        ) : item.avatar ? (
          <img src={item.avatar} alt="" className={css.resultAvatar} />
        ) : (
          <span className={css.resultIconWrap}>
            {type === 'listings' ? <Building2 size={14} /> : null}
            {type === 'users' ? <Users size={14} /> : null}
            {type === 'actions' ? <Activity size={14} /> : null}
            {type === 'commands' ? <Terminal size={14} /> : null}
          </span>
        )}

        <span className={css.resultContent}>
          <span className={css.resultTitle}>{item.title}</span>
          {item.description ? <span className={css.resultMeta}>{item.description}</span> : null}
        </span>

        <span className={css.resultTrailing}>
          {item.price ? <span className={css.resultPrice}>{item.price}</span> : null}
          {item.status ? (
            <span className={css.resultStatusBadge({ variant: item.status.variant })}>
              {item.status.label}
            </span>
          ) : null}
        </span>
      </button>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next: boolean) => onOpenChange(next)}>
      <Dialog.Portal>
        <Dialog.Backdrop className={css.backdrop} />
        <Dialog.Popup
          className={`${css.popup} ${css.noBlurFallback}`}
          onKeyDown={handleKeyDown}
        >
          <Dialog.Title className={css.visuallyHidden}>AI Akilli Arama</Dialog.Title>

          {/* -- Arama girdisi -- */}
          <div className={css.searchHeader}>
            <span className={css.sparkleIcon}>
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={handleInputChange}
              placeholder="Ilan, kullanici veya islem arayin... (AI destekli)"
              className={css.searchInput}
              aria-label="AI Akilli Arama"
            />
            <span className={css.kbdHint}>
              <kbd>esc</kbd>
            </span>
            <Dialog.Close
              render={
                <button type="button" className={css.closeButton} aria-label="Kapat">
                  <X size={14} aria-hidden="true" />
                </button>
              }
            />
          </div>

          {/* -- Ayristirilan sorgu chip'leri -- */}
          {hasChips ? (
            <div className={css.parsedQueryRow}>
              <span className={css.parsedLabel}>
                <Sparkles size={10} aria-hidden="true" />
                AI tarafindan yorumlandi
              </span>
              {parsedQuery!.chips.map((chip, i) => (
                <span key={`${chip.category}-${i}`} className={css.queryChip({ category: chipCategory(chip.category) })}>
                  <span className={css.chipLabel}>{chip.label}:</span>
                  {chip.value}
                </span>
              ))}
            </div>
          ) : null}

          {/* -- Scrollable icerik -- */}
          <div className={css.scrollArea}>
            {/* Yukleniyor */}
            {isSearching ? (
              <div className={css.resultSection}>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className={css.skeletonItem}>
                    <div className={css.skeletonBlock({ size: i % 2 === 0 ? 'thumb' : 'avatar' })} />
                    <div className={css.resultContent}>
                      <div className={css.skeletonBlock({ size: 'md' })} />
                      <div className={css.skeletonBlock({ size: 'sm' })} />
                    </div>
                  </div>
                ))}
              </div>
            ) : hasQuery || hasResults ? (
              <>
                {/* Kategori tab'lari */}
                {hasResults ? (
                  <div className={css.tabRow} role="tablist" aria-label="Sonuc kategorileri">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.key}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === cat.key}
                        className={css.tab({ active: activeTab === cat.key })}
                        onClick={() => {
                          setActiveTab(cat.key)
                          setSelectedIndex(-1)
                        }}
                      >
                        <cat.icon size={14} aria-hidden="true" />
                        {cat.label}
                        {counts[cat.key] > 0 ? (
                          <span className={css.tabBadge}>{counts[cat.key]}</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}

                {/* Sonuclar */}
                {activeResults.length > 0 ? (
                  <div className={css.resultSection} role="listbox" aria-label={`${activeTab} sonuclari`}>
                    {activeResults.map((item, i) => renderResult(item, i, activeTab))}
                  </div>
                ) : hasQuery && !isSearching ? (
                  <div className={css.emptyState}>
                    <SearchX size={32} className={css.emptyIcon} />
                    <p className={css.emptyTitle}>Sonuc bulunamadi</p>
                    <p className={css.emptyDescription}>
                      Farkli anahtar kelimeler deneyin veya AI onerilerine bakin.
                    </p>
                  </div>
                ) : null}

                {/* AI onerileri */}
                {(suggestions?.length ?? 0) > 0 ? (
                  <div className={css.suggestionsSection}>
                    <div className={css.suggestionsTitle}>
                      <Lightbulb size={12} aria-hidden="true" />
                      Bunu mu demek istediniz?
                    </div>
                    {suggestions!.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        className={css.suggestionItem}
                        onClick={() => handleSuggestionClick(s)}
                      >
                        <Search size={12} aria-hidden="true" />
                        {s}
                      </button>
                    ))}
                    <button type="button" className={css.aiAnalyzeButton}>
                      <Sparkles size={12} aria-hidden="true" />
                      AI ile daha detayli analiz
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              /* Son aramalar (sorgu bos) */
              (recentSearches?.length ?? 0) > 0 ? (
                <div className={css.recentSection}>
                  <div className={css.recentHeader}>
                    <span className={css.recentTitle}>
                      <Clock size={12} aria-hidden="true" />
                      Son Aramalar
                    </span>
                    {onClearHistory ? (
                      <button type="button" className={css.clearButton} onClick={onClearHistory}>
                        Gecmisi temizle
                      </button>
                    ) : null}
                  </div>
                  {recentSearches!.map((text, i) => (
                    <button
                      key={i}
                      type="button"
                      className={css.recentItem}
                      onClick={() => handleRecentClick(text)}
                    >
                      <Clock size={14} className={css.recentItemIcon} aria-hidden="true" />
                      <span className={css.recentItemText}>{text}</span>
                    </button>
                  ))}
                </div>
              ) : null
            )}
          </div>

          {/* -- Footer -- */}
          <div className={css.footer}>
            <div className={css.footerHints}>
              <span className={css.footerHint}>
                <kbd className={css.kbd}>&#x2191;&#x2193;</kbd> gezin
              </span>
              <span className={css.footerHint}>
                <kbd className={css.kbd}>&#x23CE;</kbd> sec
              </span>
              <span className={css.footerHint}>
                <kbd className={css.kbd}>esc</kbd> kapat
              </span>
            </div>
            <div className={css.status}>
              <span className={css.statusDot} />
              <span>AI Ready</span>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
