import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { allMockListings } from '../mocks/listings'
import { LISTING_CATEGORY_LABEL, TRANSACTION_TYPE_LABEL } from '../domain/labels'
import {
  Currency,
  ListingCategory,
  type ListingTransactionType,
} from '../types/domain'
import * as css from './ListingEditPage.css'

export function ListingEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const isCreate = id === 'new'
  const existing = isCreate ? undefined : allMockListings.find((l) => l.id === id)

  // If editing and listing not found
  if (!isCreate && !existing) {
    return (
      <div className={css.root}>
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '4rem 0' }}>
          Ilan bulunamadi
        </p>
      </div>
    )
  }

  const [title, setTitle] = useState(existing?.title ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [category, setCategory] = useState<string>(existing?.category ?? ListingCategory.Residential)
  const [transactionType, setTransactionType] = useState<string>(existing?.transactionType ?? 'satilik')
  const [price, setPrice] = useState<string>(existing ? String(existing.price.amount) : '')
  const [currency, setCurrency] = useState<string>(existing?.price.currency ?? Currency.Try)
  const [city, setCity] = useState(existing?.location.cityName ?? '')
  const [district, setDistrict] = useState(existing?.location.districtName ?? '')
  const [sqm, setSqm] = useState<string>(() => {
    if (!existing) return ''
    if ('grossSquareMeters' in existing.attributes) return String(existing.attributes.grossSquareMeters)
    if ('squareMeters' in existing.attributes) return String(existing.attributes.squareMeters)
    if ('totalSquareMeters' in existing.attributes) return String(existing.attributes.totalSquareMeters)
    return ''
  })
  const [rooms, setRooms] = useState<string>(() => {
    if (!existing) return ''
    if ('roomCount' in existing.attributes) {
      const r = existing.attributes.roomCount
      return typeof r === 'number' ? String(r) : r
    }
    return ''
  })

  const isResidential = category === ListingCategory.Residential

  const transactionOptions = Object.entries(TRANSACTION_TYPE_LABEL) as [ListingTransactionType, string][]

  function handleSave() {
    // Mock save - just navigate back
    if (isCreate) {
      navigate('/listings')
    } else {
      navigate(`/listings/${id}`)
    }
  }

  function handleCancel() {
    if (isCreate) {
      navigate('/listings')
    } else {
      navigate(`/listings/${id}`)
    }
  }

  return (
    <div className={css.root}>
      {/* Header */}
      <div className={css.headerRow}>
        <button
          type="button"
          className={css.backBtn}
          onClick={handleCancel}
        >
          &larr; {isCreate ? 'Ilanlar' : 'Detay'}
        </button>
        <h1 className={css.titleText}>
          {isCreate ? 'Yeni Ilan Olustur' : 'Ilani Duzenle'}
        </h1>
      </div>

      {/* Form card */}
      <div className={css.card}>
        <div className={css.fieldGroup}>
          <label className={css.label}>Baslik</label>
          <input
            className={css.input}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ilan basligi"
          />
        </div>

        <div className={css.fieldGroup}>
          <label className={css.label}>Aciklama</label>
          <textarea
            className={css.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ilan aciklamasi"
          />
        </div>

        <div className={css.row}>
          <div className={css.fieldGroup}>
            <label className={css.label}>Kategori</label>
            <select
              className={css.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {Object.entries(LISTING_CATEGORY_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className={css.fieldGroup}>
            <label className={css.label}>Islem Turu</label>
            <select
              className={css.select}
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              {transactionOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={css.row}>
          <div className={css.fieldGroup}>
            <label className={css.label}>Fiyat</label>
            <input
              className={css.input}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className={css.fieldGroup}>
            <label className={css.label}>Para Birimi</label>
            <select
              className={css.select}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="TRY">TRY</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div className={css.row}>
          <div className={css.fieldGroup}>
            <label className={css.label}>Il</label>
            <input
              className={css.input}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Istanbul"
            />
          </div>

          <div className={css.fieldGroup}>
            <label className={css.label}>Ilce</label>
            <input
              className={css.input}
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Kadikoy"
            />
          </div>
        </div>

        <div className={css.row}>
          <div className={css.fieldGroup}>
            <label className={css.label}>Metre Kare</label>
            <input
              className={css.input}
              type="number"
              value={sqm}
              onChange={(e) => setSqm(e.target.value)}
              placeholder="0"
            />
          </div>

          {isResidential && (
            <div className={css.fieldGroup}>
              <label className={css.label}>Oda Sayisi</label>
              <input
                className={css.input}
                type="text"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                placeholder="3+1"
              />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={css.actions}>
        <button type="button" className={css.primaryBtn} onClick={handleSave}>
          Kaydet
        </button>
        <button type="button" className={css.ghostBtn} onClick={handleCancel}>
          Iptal
        </button>
      </div>
    </div>
  )
}
