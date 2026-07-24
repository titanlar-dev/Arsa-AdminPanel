import { useNavigate } from 'react-router'
import * as css from './PlaceholderPage.css'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const navigate = useNavigate()

  return (
    <div className={css.root}>
      <h1 className={css.title}>{title}</h1>
      <p className={css.message}>Bu sayfa yapim asamasinda</p>
      <button type="button" className={css.backBtn} onClick={() => navigate(-1)}>
        Geri Don
      </button>
    </div>
  )
}
