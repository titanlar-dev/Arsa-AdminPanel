import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { allMockListings } from '../mocks/listings'
import {
  LISTING_CATEGORY_LABEL,
  RESIDENTIAL_SUB_CATEGORY_LABEL,
  LAND_SUB_CATEGORY_LABEL,
  COMMERCIAL_SUB_CATEGORY_LABEL,
  BUILDING_SUB_CATEGORY_LABEL,
  TIMESHARE_SUB_CATEGORY_LABEL,
  TOURISM_FACILITY_SUB_CATEGORY_LABEL,
  ROOM_COUNT_LABEL,
  BUILDING_AGE_LABEL,
  FLOOR_LOCATION_LABEL,
  HEATING_TYPE_LABEL,
  PARKING_TYPE_LABEL,
  TITLE_DEED_STATUS_LABEL,
  LOAN_ELIGIBILITY_LABEL,
  ZONING_STATUS_LABEL,
  INFRASTRUCTURE_TYPE_LABEL,
  BUILDING_CONDITION_LABEL,
  SELLER_TYPE_LABEL,
  LISTING_STATUS_LABEL,
} from '../domain/labels'
import {
  Currency,
  ListingCategory,
  ResidentialTransactionType,
  LandTransactionType,
  CommercialTransactionType,
  BuildingTransactionType,
  TimeshareTransactionType,
  TourismFacilityTransactionType,
  SellerType,
} from '../types/domain'
import * as css from './ListingEditPage.css'

const TAB_LABELS = ['Temel Bilgiler', 'Fiyat & Konum', 'Ozellikler', 'Fotograflar', 'Satici & Yayinlama']

function getSubCategoryMap(cat: string): Record<string, string> {
  switch (cat) {
    case ListingCategory.Residential: return RESIDENTIAL_SUB_CATEGORY_LABEL
    case ListingCategory.Land: return LAND_SUB_CATEGORY_LABEL
    case ListingCategory.Commercial: return COMMERCIAL_SUB_CATEGORY_LABEL
    case ListingCategory.Building: return BUILDING_SUB_CATEGORY_LABEL
    case ListingCategory.Timeshare: return TIMESHARE_SUB_CATEGORY_LABEL
    case ListingCategory.TourismFacility: return TOURISM_FACILITY_SUB_CATEGORY_LABEL
    default: return {}
  }
}

function getTransactionOptions(cat: string): Record<string, string> {
  switch (cat) {
    case ListingCategory.Residential:
      return Object.fromEntries(Object.entries(ResidentialTransactionType).map(([, v]) => [v, txLabel(v)]))
    case ListingCategory.Land:
      return Object.fromEntries(Object.entries(LandTransactionType).map(([, v]) => [v, txLabel(v)]))
    case ListingCategory.Commercial:
      return Object.fromEntries(Object.entries(CommercialTransactionType).map(([, v]) => [v, txLabel(v)]))
    case ListingCategory.Building:
      return Object.fromEntries(Object.entries(BuildingTransactionType).map(([, v]) => [v, txLabel(v)]))
    case ListingCategory.Timeshare:
      return Object.fromEntries(Object.entries(TimeshareTransactionType).map(([, v]) => [v, txLabel(v)]))
    case ListingCategory.TourismFacility:
      return Object.fromEntries(Object.entries(TourismFacilityTransactionType).map(([, v]) => [v, txLabel(v)]))
    default: return {}
  }
}

function txLabel(v: string) {
  const map: Record<string, string> = { satilik: 'Satilik', kiralik: 'Kiralik', gunlukKiralik: 'Gunluk Kiralik', devren: 'Devren' }
  return map[v] ?? v
}

type PhotoState = { id: string; url: string; isCover: boolean }

export function ListingEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const isCreate = id === 'new'
  const existing = isCreate ? undefined : allMockListings.find((l) => l.id === id)

  if (!isCreate && !existing) {
    return (
      <div className={css.root}>
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '4rem 0' }}>
          Ilan bulunamadi
        </p>
      </div>
    )
  }

  const [activeTab, setActiveTab] = useState(0)

  // Tab 1 state
  const [title, setTitle] = useState(existing?.title ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [category, setCategory] = useState<string>(existing?.category ?? '')
  const [subCategory, setSubCategory] = useState<string>(existing?.subCategory ?? '')
  const [transactionType, setTransactionType] = useState<string>(existing?.transactionType ?? '')
  const [price, setPrice] = useState<string>(existing ? String(existing.price.amount) : '')
  const [currency, setCurrency] = useState<string>(existing?.price.currency ?? Currency.Try)
  const [negotiable, setNegotiable] = useState(existing?.price.negotiable ?? false)

  // Tab 2 state
  const [city, setCity] = useState(existing?.location.cityName ?? '')
  const [district, setDistrict] = useState(existing?.location.districtName ?? '')
  const [neighborhood, setNeighborhood] = useState(existing?.location.neighborhoodName ?? '')
  const [address, setAddress] = useState(existing?.location.addressLine ?? '')

  // Tab 3 — Konut
  const resAttr = existing && existing.category === ListingCategory.Residential ? existing.attributes : undefined
  const [grossSqm, setGrossSqm] = useState(resAttr ? String(resAttr.grossSquareMeters) : '')
  const [netSqm, setNetSqm] = useState(resAttr ? String(resAttr.netSquareMeters) : '')
  const [roomCount, setRoomCount] = useState(resAttr?.roomCount ?? '')
  const [buildingAge, setBuildingAge] = useState(resAttr?.buildingAge ?? '')
  const [floorLocation, setFloorLocation] = useState(resAttr?.floorLocation ?? '')
  const [floorCount, setFloorCount] = useState(resAttr ? String(resAttr.floorCount) : '')
  const [heatingType, setHeatingType] = useState(resAttr?.heatingType ?? '')
  const [bathroomCount, setBathroomCount] = useState(resAttr ? String(resAttr.bathroomCount) : '')
  const [hasBalcony, setHasBalcony] = useState(resAttr?.hasBalcony ?? false)
  const [hasElevator, setHasElevator] = useState(resAttr?.hasElevator ?? false)
  const [parkingType, setParkingType] = useState(resAttr?.parkingType ?? '')
  const [furnished, setFurnished] = useState(resAttr?.furnished ?? false)
  const [inComplex, setInComplex] = useState(resAttr?.inComplex ?? false)
  const [complexName, setComplexName] = useState(resAttr?.complexName ?? '')
  const [monthlyFee, setMonthlyFee] = useState(resAttr?.monthlyFee ? String(resAttr.monthlyFee.amount) : '')
  const [titleDeedStatus, setTitleDeedStatus] = useState(resAttr?.titleDeedStatus ?? '')
  const [loanEligibility, setLoanEligibility] = useState(resAttr?.loanEligibility ?? '')
  const [swapAccepted, setSwapAccepted] = useState(resAttr?.swapAccepted ?? false)

  // Tab 3 — Arsa
  const landAttr = existing && existing.category === ListingCategory.Land ? existing.attributes : undefined
  const [landSqm, setLandSqm] = useState(landAttr ? String(landAttr.squareMeters) : '')
  const [zoningStatus, setZoningStatus] = useState(landAttr?.zoningStatus ?? '')
  const [block, setBlock] = useState(landAttr?.block ?? '')
  const [parcel, setParcel] = useState(landAttr?.parcel ?? '')
  const [mapSheet, setMapSheet] = useState(landAttr?.mapSheet ?? '')
  const [floorAreaRatio, setFloorAreaRatio] = useState(landAttr?.floorAreaRatio != null ? String(landAttr.floorAreaRatio) : '')
  const [maxBuildingHeight, setMaxBuildingHeight] = useState(landAttr?.maxBuildingHeightMeters != null ? String(landAttr.maxBuildingHeightMeters) : '')
  const [roadFrontage, setRoadFrontage] = useState(landAttr?.roadFrontageMeters != null ? String(landAttr.roadFrontageMeters) : '')
  const [infrastructure, setInfrastructure] = useState<Set<string>>(new Set(landAttr?.infrastructure ?? []))

  // Tab 3 — Ticari
  const comAttr = existing && existing.category === ListingCategory.Commercial ? existing.attributes : undefined
  const [comSqm, setComSqm] = useState(comAttr ? String(comAttr.squareMeters) : '')
  const [comRooms, setComRooms] = useState(comAttr ? String(comAttr.roomCount) : '')
  const [comFloor, setComFloor] = useState(comAttr?.floorLocation ?? '')
  const [comFloorCount, setComFloorCount] = useState(comAttr ? String(comAttr.floorCount) : '')
  const [comHeating, setComHeating] = useState(comAttr?.heatingType ?? '')
  const [comDeposit, setComDeposit] = useState(comAttr?.deposit ? String(comAttr.deposit.amount) : '')
  const [comCondition, setComCondition] = useState(comAttr?.buildingCondition ?? '')
  const [comElevator, setComElevator] = useState(comAttr?.hasElevator ?? false)
  const [comParking, setComParking] = useState(comAttr?.parkingType ?? '')
  const [comFurnished, setComFurnished] = useState(comAttr?.furnished ?? false)
  const [comTransferFee, setComTransferFee] = useState(comAttr?.transferFee ? String(comAttr.transferFee.amount) : '')

  // Tab 4 — Photos
  const [photos, setPhotos] = useState<PhotoState[]>(
    () => existing?.photos.map((p) => ({ id: p.id, url: p.thumbnailUrl, isCover: p.isCover })) ?? [],
  )

  // Tab 5 — Seller
  const [sellerType, setSellerType] = useState<string>(existing?.seller.type ?? SellerType.Owner)
  const [sellerName, setSellerName] = useState(existing?.seller.displayName ?? '')
  const [sellerPhone, setSellerPhone] = useState(existing?.contact.phone ?? '')
  const [sellerEmail, setSellerEmail] = useState(existing?.contact.email ?? '')
  const [allowPhone, setAllowPhone] = useState(existing?.contact.allowPhone ?? true)
  const [allowMessage, setAllowMessage] = useState(existing?.contact.allowMessage ?? true)
  const [hideLocation, setHideLocation] = useState(existing ? !existing.location.showExactLocation : false)

  const tab3Disabled = !category
  const pricePerSqm = landSqm && price ? (Number(price) / Number(landSqm)).toFixed(2) : ''

  function handleCategoryChange(val: string) {
    setCategory(val)
    setSubCategory('')
    setTransactionType('')
  }

  function handleSave() { navigate(isCreate ? '/listings' : `/listings/${id}`) }
  function handleCancel() { navigate(isCreate ? '/listings' : `/listings/${id}`) }

  function handleDeletePhoto(photoId: string) { setPhotos((prev) => prev.filter((p) => p.id !== photoId)) }
  function handleMakeCover(photoId: string) {
    setPhotos((prev) => prev.map((p) => ({ ...p, isCover: p.id === photoId })))
  }

  function toggleInfra(val: string) {
    setInfrastructure((prev) => {
      const next = new Set(prev)
      if (next.has(val)) next.delete(val); else next.add(val)
      return next
    })
  }

  function renderField(lbl: string, children: React.ReactNode) {
    return <div className={css.fieldGroup}><label className={css.label}>{lbl}</label>{children}</div>
  }

  function renderSelect(value: string, onChange: (v: string) => void, options: Record<string, string>, placeholder?: string) {
    return (
      <select className={css.select} value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && <option value="">{placeholder}</option>}
        {Object.entries(options).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    )
  }

  /* ── Tab 1: Temel Bilgiler ──────────────────────────── */
  function renderTab1() {
    const subCatMap = getSubCategoryMap(category)
    const txOptions = getTransactionOptions(category)
    return (
      <div className={css.card}>
        {renderField('Baslik', <input className={css.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ilan basligi" />)}
        {renderField('Aciklama', <textarea className={css.textarea} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ilan aciklamasi" />)}
        <div className={css.row}>
          {renderField('Kategori', renderSelect(category, handleCategoryChange, LISTING_CATEGORY_LABEL, 'Secin'))}
          {renderField('Alt Kategori', renderSelect(subCategory, setSubCategory, subCatMap, 'Secin'))}
        </div>
        {renderField('Islem Turu', renderSelect(transactionType, setTransactionType, txOptions, 'Secin'))}
        <div className={css.row}>
          {renderField('Fiyat', <input className={css.input} type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />)}
          {renderField('Para Birimi', renderSelect(currency, setCurrency, { [Currency.Try]: 'TRY', [Currency.Usd]: 'USD', [Currency.Eur]: 'EUR', [Currency.Gbp]: 'GBP' }))}
        </div>
        <label className={css.checkRow}>
          <input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} /> Pazarlikli
        </label>
      </div>
    )
  }

  /* ── Tab 2: Fiyat & Konum ───────────────────────────── */
  function renderTab2() {
    return (
      <div className={css.card}>
        {renderField('Fiyat', <input className={css.input} value={price ? `${Number(price).toLocaleString('tr-TR')} ${currency}` : '-'} readOnly />)}
        <div className={css.row3}>
          {renderField('Il', <input className={css.input} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Istanbul" />)}
          {renderField('Ilce', <input className={css.input} value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Kadikoy" />)}
          {renderField('Mahalle', <input className={css.input} value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Caferaga" />)}
        </div>
        {renderField('Adres', <textarea className={css.textarea} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Acik adres" />)}
        <div className={css.mapPlaceholder}>Haritada konumu sec</div>
      </div>
    )
  }

  /* ── Tab 3: Ozellikler ──────────────────────────────── */
  function renderTab3Konut() {
    return (
      <div className={css.card}>
        <div className={css.row}>
          {renderField('Brut m2', <input className={css.input} type="number" value={grossSqm} onChange={(e) => setGrossSqm(e.target.value)} />)}
          {renderField('Net m2', <input className={css.input} type="number" value={netSqm} onChange={(e) => setNetSqm(e.target.value)} />)}
        </div>
        <div className={css.row}>
          {renderField('Oda Sayisi', renderSelect(roomCount, setRoomCount, ROOM_COUNT_LABEL, 'Secin'))}
          {renderField('Bina Yasi', renderSelect(buildingAge, setBuildingAge, BUILDING_AGE_LABEL, 'Secin'))}
        </div>
        <div className={css.row}>
          {renderField('Kat', renderSelect(floorLocation, setFloorLocation, FLOOR_LOCATION_LABEL, 'Secin'))}
          {renderField('Toplam Kat', <input className={css.input} type="number" value={floorCount} onChange={(e) => setFloorCount(e.target.value)} />)}
        </div>
        <div className={css.row}>
          {renderField('Isitma', renderSelect(heatingType, setHeatingType, HEATING_TYPE_LABEL, 'Secin'))}
          {renderField('Banyo', <input className={css.input} type="number" value={bathroomCount} onChange={(e) => setBathroomCount(e.target.value)} />)}
        </div>
        <div className={css.row}>
          <label className={css.checkRow}><input type="checkbox" checked={hasBalcony} onChange={(e) => setHasBalcony(e.target.checked)} /> Balkon</label>
          <label className={css.checkRow}><input type="checkbox" checked={hasElevator} onChange={(e) => setHasElevator(e.target.checked)} /> Asansor</label>
        </div>
        <div className={css.row}>
          {renderField('Otopark', renderSelect(parkingType, setParkingType, PARKING_TYPE_LABEL, 'Secin'))}
          <label className={css.checkRow}><input type="checkbox" checked={furnished} onChange={(e) => setFurnished(e.target.checked)} /> Esyali</label>
        </div>
        <label className={css.checkRow}><input type="checkbox" checked={inComplex} onChange={(e) => setInComplex(e.target.checked)} /> Site Icinde</label>
        {inComplex && (
          <div className={css.row}>
            {renderField('Site Adi', <input className={css.input} value={complexName} onChange={(e) => setComplexName(e.target.value)} />)}
            {renderField('Aidat', <input className={css.input} type="number" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} />)}
          </div>
        )}
        <div className={css.row}>
          {renderField('Tapu Durumu', renderSelect(titleDeedStatus, setTitleDeedStatus, TITLE_DEED_STATUS_LABEL, 'Secin'))}
          {renderField('Krediye Uygunluk', renderSelect(loanEligibility, setLoanEligibility, LOAN_ELIGIBILITY_LABEL, 'Secin'))}
        </div>
        <label className={css.checkRow}><input type="checkbox" checked={swapAccepted} onChange={(e) => setSwapAccepted(e.target.checked)} /> Takas</label>
      </div>
    )
  }

  function renderTab3Arsa() {
    return (
      <div className={css.card}>
        {renderField('m2', <input className={css.input} type="number" value={landSqm} onChange={(e) => setLandSqm(e.target.value)} />)}
        {renderField('Imar Durumu', renderSelect(zoningStatus, setZoningStatus, ZONING_STATUS_LABEL, 'Secin'))}
        <div className={css.row}>
          {renderField('Ada', <input className={css.input} value={block} onChange={(e) => setBlock(e.target.value)} />)}
          {renderField('Parsel', <input className={css.input} value={parcel} onChange={(e) => setParcel(e.target.value)} />)}
        </div>
        {renderField('Pafta', <input className={css.input} value={mapSheet} onChange={(e) => setMapSheet(e.target.value)} />)}
        <div className={css.row}>
          {renderField('Emsal / KAKS', <input className={css.input} type="number" step="0.01" value={floorAreaRatio} onChange={(e) => setFloorAreaRatio(e.target.value)} />)}
          {renderField('Max Bina Yuksekligi (m)', <input className={css.input} type="number" value={maxBuildingHeight} onChange={(e) => setMaxBuildingHeight(e.target.value)} />)}
        </div>
        {renderField('m2 Fiyati', <input className={css.input} value={pricePerSqm ? `${pricePerSqm} ${currency}` : '-'} readOnly />)}
        {renderField('Yol Cephesi (m)', <input className={css.input} type="number" value={roadFrontage} onChange={(e) => setRoadFrontage(e.target.value)} />)}
        <div className={css.fieldGroup}>
          <label className={css.label}>Altyapi</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {Object.entries(INFRASTRUCTURE_TYPE_LABEL).map(([v, l]) => (
              <label key={v} className={css.checkRow}>
                <input type="checkbox" checked={infrastructure.has(v)} onChange={() => toggleInfra(v)} /> {l}
              </label>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function renderTab3Ticari() {
    const isDevren = transactionType === CommercialTransactionType.Transfer
    return (
      <div className={css.card}>
        {renderField('m2', <input className={css.input} type="number" value={comSqm} onChange={(e) => setComSqm(e.target.value)} />)}
        <div className={css.row}>
          {renderField('Oda Sayisi', <input className={css.input} value={comRooms} onChange={(e) => setComRooms(e.target.value)} />)}
          {renderField('Kat', renderSelect(comFloor, setComFloor, FLOOR_LOCATION_LABEL, 'Secin'))}
        </div>
        <div className={css.row}>
          {renderField('Toplam Kat', <input className={css.input} type="number" value={comFloorCount} onChange={(e) => setComFloorCount(e.target.value)} />)}
          {renderField('Isitma', renderSelect(comHeating, setComHeating, HEATING_TYPE_LABEL, 'Secin'))}
        </div>
        {renderField('Depozito', <input className={css.input} type="number" value={comDeposit} onChange={(e) => setComDeposit(e.target.value)} />)}
        {renderField('Bina Durumu', renderSelect(comCondition, setComCondition, BUILDING_CONDITION_LABEL, 'Secin'))}
        <div className={css.row}>
          <label className={css.checkRow}><input type="checkbox" checked={comElevator} onChange={(e) => setComElevator(e.target.checked)} /> Asansor</label>
          {renderField('Otopark', renderSelect(comParking, setComParking, PARKING_TYPE_LABEL, 'Secin'))}
        </div>
        <label className={css.checkRow}><input type="checkbox" checked={comFurnished} onChange={(e) => setComFurnished(e.target.checked)} /> Esyali</label>
        {isDevren && renderField('Devir Ucreti', <input className={css.input} type="number" value={comTransferFee} onChange={(e) => setComTransferFee(e.target.value)} />)}
      </div>
    )
  }

  function renderTab3() {
    if (!category) return <div className={css.card}><p style={{ color: 'rgba(255,255,255,0.4)' }}>Lutfen once bir kategori secin.</p></div>
    switch (category) {
      case ListingCategory.Residential: return renderTab3Konut()
      case ListingCategory.Land: return renderTab3Arsa()
      case ListingCategory.Commercial: return renderTab3Ticari()
      default: return <div className={css.card}><p style={{ color: 'rgba(255,255,255,0.4)' }}>Bu kategori icin ozellik formu henuz tanimlanmadi.</p></div>
    }
  }

  /* ── Tab 4: Fotograflar ─────────────────────────────── */
  function renderTab4() {
    return (
      <div className={css.card}>
        <div className={css.dropZone}>Fotograflari buraya surukleyin</div>
        <div className={css.photoGrid}>
          {photos.map((p) => (
            <div key={p.id} className={css.photoCard}>
              <img className={css.photoImg} src={p.url} alt="" />
              {p.isCover && <span className={css.coverBadge}>Kapak</span>}
              <div className={css.photoOverlay}>
                {!p.isCover && <button type="button" className={css.overlayBtn} onClick={() => handleMakeCover(p.id)}>Kapak Yap</button>}
                <button type="button" className={css.overlayBtn} onClick={() => handleDeletePhoto(p.id)}>Sil</button>
              </div>
            </div>
          ))}
        </div>
        <span className={css.photoCounter}>{photos.length} / 20 fotograf</span>
      </div>
    )
  }

  /* ── Tab 5: Satici & Yayinlama ──────────────────────── */
  function renderTab5() {
    return (
      <div className={css.card}>
        <div className={css.fieldGroup}>
          <label className={css.label}>Satici Tipi</label>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            {Object.entries(SELLER_TYPE_LABEL).map(([v, l]) => (
              <label key={v} className={css.checkRow}>
                <input type="radio" name="sellerType" value={v} checked={sellerType === v} onChange={() => setSellerType(v)} /> {l}
              </label>
            ))}
          </div>
        </div>
        <div className={css.row}>
          {renderField('Satici Adi', <input className={css.input} value={sellerName} onChange={(e) => setSellerName(e.target.value)} />)}
          {renderField('Telefon', <input className={css.input} value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)} />)}
        </div>
        {renderField('Email', <input className={css.input} type="email" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} />)}
        <div className={css.fieldGroup}>
          <label className={css.label}>Iletisim Tercihi</label>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <label className={css.checkRow}><input type="checkbox" checked={allowPhone} onChange={(e) => setAllowPhone(e.target.checked)} /> Telefon</label>
            <label className={css.checkRow}><input type="checkbox" checked={allowMessage} onChange={(e) => setAllowMessage(e.target.checked)} /> Mesaj</label>
          </div>
        </div>
        <label className={css.checkRow}><input type="checkbox" checked={hideLocation} onChange={(e) => setHideLocation(e.target.checked)} /> Konum Gizliligi</label>
        {existing && (
          <div className={css.infoBox}>
            Durum: {LISTING_STATUS_LABEL[existing.status]}
          </div>
        )}
      </div>
    )
  }

  const tabContent = [renderTab1, renderTab2, renderTab3, renderTab4, renderTab5]

  return (
    <div className={css.root}>
      {/* Header */}
      <div className={css.headerRow}>
        <button type="button" className={css.backBtn} onClick={handleCancel}>
          &larr; {isCreate ? 'Ilanlar' : 'Detay'}
        </button>
        <h1 className={css.titleText}>{isCreate ? 'Yeni Ilan Olustur' : 'Ilani Duzenle'}</h1>
      </div>

      {/* Tab bar */}
      <div className={css.tabBar}>
        {TAB_LABELS.map((lbl, i) => {
          const disabled = i === 2 && tab3Disabled
          return (
            <button
              key={lbl}
              type="button"
              className={`${css.tab} ${activeTab === i ? css.tabActive : ''} ${disabled ? css.tabDisabled : ''}`}
              onClick={() => { if (!disabled) setActiveTab(i) }}
            >
              {lbl}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {tabContent[activeTab]!()}

      {/* Sticky action bar */}
      <div className={css.stickyBar}>
        <button type="button" className={css.primaryBtn} onClick={handleSave}>Kaydet</button>
        <button type="button" className={css.ghostBtn} onClick={handleSave}>Taslak Kaydet</button>
        <button type="button" className={css.ghostBtn} onClick={handleCancel}>Iptal</button>
      </div>
    </div>
  )
}
