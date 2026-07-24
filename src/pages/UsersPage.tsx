import { useState } from 'react'
import * as css from './UsersPage.css'

const USERS = [
  { id: 1, name: 'Ahmet Yilmaz', email: 'ahmet@example.com', type: 'Bireysel', listings: 3, active: true },
  { id: 2, name: 'Marmara Emlak', email: 'info@marmaraemlak.com', type: 'Kurumsal', listings: 24, active: true },
  { id: 3, name: 'Fatih Demir', email: 'fatih.d@example.com', type: 'Bireysel', listings: 1, active: true },
  { id: 4, name: 'Ege Gayrimenkul', email: 'iletisim@ege-g.com', type: 'Kurumsal', listings: 18, active: false },
  { id: 5, name: 'Zeynep Kara', email: 'zeynep.k@example.com', type: 'Bireysel', listings: 0, active: true },
  { id: 6, name: 'Anadolu Insaat', email: 'bilgi@anadolu.com', type: 'Kurumsal', listings: 42, active: true },
]

export function UsersPage() {
  const [query, setQuery] = useState('')
  const filtered = USERS.filter(
    (u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className={css.root}>
      <h1 className={css.title}>Kullanicilar</h1>

      <input
        className={css.searchInput}
        placeholder="Kullanici ara..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className={css.list}>
        {filtered.map((u) => (
          <div key={u.id} className={css.row}>
            <div className={css.avatar}>{u.name.charAt(0)}</div>
            <div className={css.info}>
              <span className={css.name}>{u.name}</span>
              <span className={css.email}>{u.email}</span>
            </div>
            <span className={css.badge}>{u.type}</span>
            <span className={css.count}>{u.listings} ilan</span>
            <span
              className={css.statusDot}
              style={{ background: u.active ? '#4ade80' : '#ef4444' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
