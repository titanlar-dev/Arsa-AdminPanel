import { useState } from 'react'
import type { DockItem, DockProps } from '../../../types/component-props'
import * as css from './Dock.css'

/**
 * macOS Dock'a benzeyen, cam-morfizmli hızlı-eylem çubuğu.
 *
 * Alt-ortada sabit durur; üzerine gelinen ikon büyür, komşuları hafif büyür
 * (macOS "magnification"), ikon üstünde etiket balonu belirir ve altında bağlam
 * etiketi (`title`) durur. Router-agnostik: gezinmeyi kendisi yapmaz, `onSelect`
 * ile bildirir; öğe `href` taşıyorsa `<a>`, yoksa `<button>` olur. Görünüm koyu
 * Apple glass estetiğidir (`DynamicIsland` ile aynı dil) ve koyu zeminde kullanılır.
 *
 * @example
 * <Dock title="Dashboard" items={dockItems} onSelect={(i) => router.push(i.href!)} />
 */
export function Dock({ items, title, onSelect }: DockProps) {
  const [uzerinde, setUzerinde] = useState<number | null>(null)
  const [dockVisible, setDockVisible] = useState(false)

  const zoom = (i: number): 'normal' | 'neighbor' | 'hovered' => {
    if (uzerinde === i) return 'hovered'
    if (uzerinde !== null && Math.abs(uzerinde - i) === 1) return 'neighbor'
    return 'normal'
  }

  return (
    <>
      {/* Handle bar — wrapper DIŞINDA, ekranın sağ kenarına yapışık */}
      <span
        className={css.handle}
        aria-hidden="true"
        style={{
          opacity: dockVisible ? 0 : undefined,
          animationPlayState: dockVisible ? 'paused' : undefined,
          height: dockVisible ? '1rem' : undefined,
        }}
        onMouseEnter={() => setDockVisible(true)}
      />

      {/* Dock wrapper — alt-ortada */}
      <div
        className={css.wrapper}
        onMouseEnter={() => setDockVisible(true)}
        onMouseLeave={() => {
          setDockVisible(false)
          setUzerinde(null)
        }}
      >
        <div className={css.pill} style={{
          opacity: dockVisible ? 1 : 0,
          transform: dockVisible ? 'translateX(0)' : 'translateX(1rem)',
          pointerEvents: dockVisible ? 'auto' : 'none',
        }}>
          {items.map((item, i) => {
            const buyuk = uzerinde === i
            const ortak = {
              className: `${css.item} ${css.focusRing}`,
              onMouseEnter: () => setUzerinde(i),
              onMouseLeave: () => setUzerinde(null),
              onFocus: () => setUzerinde(i),
              onBlur: () => setUzerinde(null),
            }

            const icerik = (
              <>
                <span className={css.tooltip({ visible: buyuk })}>{item.label}</span>
                <span className={css.iconBox({ zoom: zoom(i) })}>
                  <item.icon
                    className={css.icon({ big: buyuk })}
                    aria-hidden="true"
                    {...(item.color !== undefined && { style: { color: item.color } })}
                  />
                </span>
              </>
            )

            return item.href !== undefined ? (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                onClick={(e) => {
                  e.preventDefault()
                  onSelect?.(item, i)
                }}
                {...ortak}
              >
                {icerik}
              </a>
            ) : (
              <button
                key={item.label}
                type="button"
                aria-label={item.label}
                onClick={() => onSelect?.(item, i)}
                {...ortak}
              >
                {icerik}
              </button>
            )
          })}
        </div>

        {title !== undefined && dockVisible ? <span className={css.title}>{title}</span> : null}
      </div>
    </>
  )
}

export type { DockItem }
