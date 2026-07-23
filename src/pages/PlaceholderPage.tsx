import { PageHeader } from '../components/composites/PageHeader/PageHeader'
import * as css from '../layouts/AdminLayout.css'

interface PlaceholderPageProps {
  title: string
}

/**
 * Henuz gercek icerik baglanmamis sayfalarin yer tutucusu.
 *
 * `PageHeader` + "Bu sayfa yapim asamasinda" mesaji gosterir.
 * Gercek ekran component'leri baglandikca bu sarmalayici kaldirilir.
 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} />
      <div className={css.placeholderPage}>
        <p className={css.placeholderTitle}>Bu sayfa yapim asamasinda</p>
        <p className={css.placeholderSubtitle}>
          {title} ekrani henuz gelistirme asamasindadir.
        </p>
      </div>
    </div>
  )
}
