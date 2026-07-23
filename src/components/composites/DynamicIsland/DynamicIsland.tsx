import { useEffect, useRef, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { ChevronDown, ChevronRight, Clock, History, Search, Star, X } from 'lucide-react'
import type { DynamicIslandProps } from '../../../types/component-props'
import * as css from './DynamicIsland.css'

/**
 * Apple Dynamic Island'ına benzeyen, cam-morfizmli gezinme + komut paleti hap'ı.
 *
 * Üç durum: daraltılmış hap (marka + aktif sayfa + ⌘K), genişletilmiş cam kart
 * (navigasyon grid'i + hızlı komutlar) ve arama modu. Overlay olarak Base UI
 * `Dialog` kullanır: odak-kilidi, Escape ile kapanma, dış-tık ve odağın hap'a
 * dönmesi oradan gelir (Modal ile aynı desen). Hap Portal dışında sabit durur;
 * açıkken görsel olarak geri çekilir, cam kart öne çıkar.
 *
 * Gezinmeyi kendisi yapmaz — `onNavigate`/`onCommand` ile niyeti bildirir,
 * aktiflik `activeItemId`'den okunur. Görünüm koyu Apple glass estetiğidir ve
 * bilinçli olarak açık tema token'larından ayrıdır; koyu zeminde kullanılır.
 *
 * @example
 * <DynamicIsland items={navItems} commands={cmds} activeItemId="schema"
 *   brandName="MetaPanel" brandBadge="dev" onNavigate={(i) => router.push(i.href)} />
 */
export function DynamicIsland({
  items,
  commands = [],
  recentItems = [],
  recentCommands = [],
  activeItemId,
  brandName = 'MetaPanel',
  brandBadge,
  open: openProp,
  onOpenChange,
  onNavigate,
  onCommand,
}: DynamicIslandProps) {
  const kontrollu = openProp !== undefined
  const [dahiliAcik, setDahiliAcik] = useState(false)
  const acik = kontrollu ? openProp : dahiliAcik
  const [aramaModu, setAramaModu] = useState(false)
  const [sorgu, setSorgu] = useState('')
  const [recentItemsOpen, setRecentItemsOpen] = useState(true)
  const [recentCommandsOpen, setRecentCommandsOpen] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sik kullanilan kimlikler (hem recent hem normal listede olanlar)
  const recentItemIds = new Set(recentItems.map((i) => i.id))
  const recentCommandIds = new Set(recentCommands.map((c) => c.id))

  const aktif = items.find((i) => i.id === activeItemId) ?? items[0]

  const acikDegistir = (next: boolean) => {
    if (kontrollu) onOpenChange?.(next)
    else setDahiliAcik(next)
    if (!next) {
      setAramaModu(false)
      setSorgu('')
    }
  }

  // ⌘K / Ctrl+K: paleti açıp aramaya odaklanır.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (onOpenChange) onOpenChange(true)
        else setDahiliAcik(true)
        setAramaModu(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onOpenChange])

  const kucukSorgu = sorgu.toLocaleLowerCase('tr')
  const filtreliNav = sorgu
    ? items.filter((i) => i.label.toLocaleLowerCase('tr').includes(kucukSorgu))
    : items
  const filtreliKomut = sorgu
    ? commands.filter((c) => c.label.toLocaleLowerCase('tr').includes(kucukSorgu))
    : commands
  const filtreliRecentItems = sorgu
    ? recentItems.filter((i) => i.label.toLocaleLowerCase('tr').includes(kucukSorgu))
    : recentItems
  const filtreliRecentCommands = sorgu
    ? recentCommands.filter((c) => c.label.toLocaleLowerCase('tr').includes(kucukSorgu))
    : recentCommands

  const gezin = (item: (typeof items)[number]) => {
    onNavigate?.(item)
    acikDegistir(false)
  }
  const komut = (c: (typeof commands)[number]) => {
    onCommand?.(c)
    acikDegistir(false)
  }

  const aramayaGec = () => {
    setAramaModu(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <>
      {/* Daraltılmış hap — Dialog dışında, her zaman DOM'da; açıkken görsel olarak çekilir. */}
      <div className={css.pillWrapper}>
        <button
          type="button"
          className={css.trigger({ open: acik })}
          onClick={() => acikDegistir(true)}
          aria-label="Komut paletini aç"
          aria-keyshortcuts="Meta+K Control+K"
        >
          <span className={css.logo}>{brandName.slice(0, 1)}</span>
          <span className={css.current}>
            {aktif !== undefined ? (
              <aktif.icon
                size={14}
                aria-hidden="true"
                {...(aktif.color !== undefined && { style: { color: aktif.color } })}
              />
            ) : null}
            <span className={css.currentLabel}>{aktif?.label}</span>
          </span>
          {/* Hover'da genişleyen inline nav ikonları */}
          <span className={css.inlineNav} aria-hidden="true">
            <span className={css.miniDivider} />
            {items.slice(0, 7).map((item) => (
              <span
                key={item.id}
                className={css.miniDot({ active: item.id === aktif?.id })}
                title={item.label}
              >
                <item.icon
                  size={12}
                  {...(item.color !== undefined && { style: { color: item.color } })}
                />
              </span>
            ))}
            {items.length > 7 ? (
              <span className={css.miniMore}>+{items.length - 7}</span>
            ) : null}
          </span>
          <span className={css.kbdHint}>
            <kbd className={css.kbd}>⌘K</kbd>
          </span>
        </button>
      </div>

      <Dialog.Root open={acik} onOpenChange={(next: boolean) => acikDegistir(next)}>
        <Dialog.Portal>
          <Dialog.Backdrop className={css.backdrop} />
          <Dialog.Popup className={`${css.popup} ${css.noBlurFallback}`}>
            <Dialog.Title className={css.visuallyHidden}>Komut paleti</Dialog.Title>

            {/* Header — marka veya arama */}
            <div className={css.header}>
              <span className={css.logo}>{brandName.slice(0, 1)}</span>

              {aramaModu ? (
                <div className={css.searchRow}>
                  <Search size={16} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <input
                    ref={inputRef}
                    value={sorgu}
                    onChange={(e) => setSorgu(e.target.value)}
                    placeholder="Sayfa, komut veya işlem ara..."
                    className={css.searchInput}
                    aria-label="Ara"
                  />
                </div>
              ) : (
                <div className={css.brandRow}>
                  <span className={css.brandName}>{brandName}</span>
                  {brandBadge !== undefined ? (
                    <span className={css.brandBadge}>{brandBadge}</span>
                  ) : null}
                </div>
              )}

              <div className={css.headerActions}>
                {!aramaModu ? (
                  <button type="button" className={css.iconButton} onClick={aramayaGec}>
                    <Search size={12} aria-hidden="true" />
                    <span>Ara</span>
                  </button>
                ) : null}
                <Dialog.Close
                  render={
                    <button type="button" className={css.iconButton} aria-label="Kapat">
                      <X size={14} aria-hidden="true" />
                    </button>
                  }
                />
              </div>
            </div>

            {/* Son Ziyaret Edilenler */}
            {filtreliRecentItems.length > 0 ? (
              <div className={css.recentSection}>
                <button
                  type="button"
                  className={css.recentSectionHeader}
                  onClick={() => setRecentItemsOpen((v) => !v)}
                  aria-expanded={recentItemsOpen}
                >
                  <Clock size={12} aria-hidden="true" className={css.recentSectionIcon} />
                  <span className={css.recentSectionTitle}>Son Ziyaret Edilenler</span>
                  <ChevronDown
                    size={10}
                    aria-hidden="true"
                    className={`${css.recentSectionChevron}${recentItemsOpen ? '' : ` ${css.recentSectionChevronCollapsed}`}`}
                  />
                </button>
                {recentItemsOpen
                  ? filtreliRecentItems.map((item) => {
                      const isFrequent = items.some((n) => n.id === item.id)
                      return (
                        <a
                          key={`recent-${item.id}`}
                          href={item.href ?? '#'}
                          onClick={(e) => {
                            e.preventDefault()
                            gezin(item)
                          }}
                          className={css.recentItem}
                        >
                          <span className={css.recentItemIcon}>
                            <item.icon
                              size={14}
                              aria-hidden="true"
                              {...(item.color !== undefined && { style: { color: item.color } })}
                            />
                          </span>
                          <span className={css.recentItemContent}>
                            <span className={css.recentItemLabel}>{item.label}</span>
                            {isFrequent ? (
                              <span className={css.frequentBadge} title="Sik kullanilan">
                                <Star size={10} aria-hidden="true" />
                              </span>
                            ) : null}
                          </span>
                          <span className={css.recentTimestamp}>(az once)</span>
                        </a>
                      )
                    })
                  : null}
              </div>
            ) : null}

            {/* Navigasyon grid'i */}
            <div className={css.section}>
              <p className={css.sectionLabel}>Navigasyon</p>
              {filtreliNav.length > 0 ? (
                <div className={css.navGrid}>
                  {filtreliNav.map((item) => {
                    const isActive = item.id === aktif?.id
                    const isFrequent = recentItemIds.has(item.id)
                    return (
                      <a
                        key={item.id}
                        href={item.href ?? '#'}
                        onClick={(e) => {
                          e.preventDefault()
                          gezin(item)
                        }}
                        className={css.navItem({ active: isActive })}
                      >
                        <span className={css.navIconWrap({ active: isActive })}>
                          <item.icon
                            size={16}
                            aria-hidden="true"
                            {...(item.color !== undefined && { style: { color: item.color } })}
                          />
                        </span>
                        <span className={css.navLabel({ active: isActive })}>
                          {item.label}
                          {isFrequent ? (
                            <span className={css.frequentBadge} title="Sik kullanilan" style={{ marginInlineStart: '0.25rem' }}>
                              <Star size={8} aria-hidden="true" />
                            </span>
                          ) : null}
                        </span>
                      </a>
                    )
                  })}
                </div>
              ) : (
                <p className={css.empty}>Sonuç bulunamadı</p>
              )}
            </div>

            {/* Son Kullanilanlar (komut gecmisi) */}
            {filtreliRecentCommands.length > 0 ? (
              <div className={css.recentSection} style={{ borderBlockEnd: 'none', borderBlockStart: `1px solid rgba(255, 255, 255, 0.08)` }}>
                <button
                  type="button"
                  className={css.recentSectionHeader}
                  onClick={() => setRecentCommandsOpen((v) => !v)}
                  aria-expanded={recentCommandsOpen}
                >
                  <History size={12} aria-hidden="true" className={css.recentSectionIcon} />
                  <span className={css.recentSectionTitle}>Son Kullanilanlar</span>
                  <ChevronDown
                    size={10}
                    aria-hidden="true"
                    className={`${css.recentSectionChevron}${recentCommandsOpen ? '' : ` ${css.recentSectionChevronCollapsed}`}`}
                  />
                </button>
                {recentCommandsOpen
                  ? filtreliRecentCommands.map((c) => {
                      const isFrequent = commands.some((cmd) => cmd.id === c.id)
                      return (
                        <a
                          key={`recent-cmd-${c.id}`}
                          href={c.href ?? '#'}
                          onClick={(e) => {
                            e.preventDefault()
                            komut(c)
                          }}
                          className={css.recentItem}
                        >
                          <span className={css.historyPrefix}>
                            <History size={10} aria-hidden="true" />
                          </span>
                          <span className={css.recentItemIcon}>
                            <c.icon size={14} aria-hidden="true" />
                          </span>
                          <span className={css.recentItemContent}>
                            <span className={css.recentItemLabel}>{c.label}</span>
                            {isFrequent ? (
                              <span className={css.frequentBadge} title="Sik kullanilan">
                                <Star size={10} aria-hidden="true" />
                              </span>
                            ) : null}
                          </span>
                          {c.hint !== undefined ? (
                            <span className={css.recentTimestamp}>{c.hint}</span>
                          ) : null}
                        </a>
                      )
                    })
                  : null}
              </div>
            ) : null}

            {/* Hızlı komutlar */}
            {filtreliKomut.length > 0 ? (
              <div className={css.commandSection}>
                <p className={css.sectionLabel}>Hızlı Komutlar</p>
                {filtreliKomut.map((c) => {
                  const isFrequent = recentCommandIds.has(c.id)
                  return (
                    <a
                      key={c.id}
                      href={c.href ?? '#'}
                      onClick={(e) => {
                        e.preventDefault()
                        komut(c)
                      }}
                      className={css.commandItem}
                    >
                      <span className={css.commandIcon}>
                        <c.icon size={14} aria-hidden="true" />
                      </span>
                      <span className={css.commandText}>
                        <span className={css.commandLabel}>
                          {c.label}
                          {isFrequent ? (
                            <span className={css.frequentBadge} title="Sik kullanilan" style={{ marginInlineStart: '0.375rem' }}>
                              <Star size={8} aria-hidden="true" />
                            </span>
                          ) : null}
                        </span>
                        {c.hint !== undefined ? (
                          <span className={css.commandHint}>{c.hint}</span>
                        ) : null}
                      </span>
                      <ChevronRight size={12} className={css.commandChevron} aria-hidden="true" />
                    </a>
                  )
                })}
              </div>
            ) : null}

            {/* Footer — klavye ipuçları + durum */}
            <div className={css.footer}>
              <div className={css.footerHints}>
                <span className={css.footerHint}>
                  <kbd className={css.kbd}>↑↓</kbd> gezin
                </span>
                <span className={css.footerHint}>
                  <kbd className={css.kbd}>↵</kbd> seç
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
    </>
  )
}
