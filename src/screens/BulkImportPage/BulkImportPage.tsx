import { useState, useRef, useCallback } from 'react'
import { ArrowRight, Check, CheckCircle, Download, FileSpreadsheet, X } from 'lucide-react'
import { Alert } from '../../components/primitives/Alert'
import { Badge } from '../../components/primitives/Badge'
import { Button } from '../../components/primitives/Button'
import { Select } from '../../components/primitives/Select'
import { Spinner } from '../../components/primitives/Spinner'
import type { SelectOption } from '../../types/component-props'
import * as css from './BulkImportPage.css'

/* -- Tipler ----------------------------------------------------------------- */

/** Tek bir CSV/Excel satirinin eslenmis alanlari. */
export interface ImportRow {
  /** Satir numarasi (1-indexed, baslik satiri haric). */
  rowIndex: number
  values: Record<string, string>
}

/** Tek bir satirin icerik aktarimi sonucu. */
export interface ImportRowResult {
  rowIndex: number
  status: 'success' | 'error'
  errorMessage?: string
}

/** Toplu icerik aktarimi sonucu. */
export interface ImportResult {
  totalRows: number
  successCount: number
  errorCount: number
  results: ImportRowResult[]
}

/** Bir CSV/Excel sutununun bilgisi. */
export interface SourceColumn {
  name: string
  sampleValues: string[]
}

/** Satirlarin dogrulama sonucu. */
export interface ValidationRow {
  rowIndex: number
  values: Record<string, string>
  errors: Record<string, string>
  warnings: Record<string, string>
}

/** Dosya ayristirma (parsing) sonucu. */
export interface ParsedFile {
  fileName: string
  fileSize: number
  rowCount: number
  columns: SourceColumn[]
  previewRows: ValidationRow[]
}

/* -- Sabit etiketler -------------------------------------------------------- */

/** Icerik aktariminda kullanilacak zorunlu sistem alanlari. */
const SYSTEM_FIELDS: { value: string; label: string; required: boolean }[] = [
  { value: 'baslik', label: 'Baslik', required: true },
  { value: 'fiyat', label: 'Fiyat', required: true },
  { value: 'kategori', label: 'Kategori', required: true },
  { value: 'il', label: 'Il', required: true },
  { value: 'ilce', label: 'Ilce', required: true },
  { value: 'aciklama', label: 'Aciklama', required: true },
  { value: 'metrekare', label: 'MetreKare', required: false },
  { value: 'odasayisi', label: 'OdaSayisi', required: false },
]

const STEP_LABELS = ['Dosya Yukle', 'Kolon Eslestirme', 'Onizleme', 'Icerik Aktarimi'] as const

/**
 * Yaygin CSV kolon adlarini sistem alanlarina otomatik esler.
 *
 * Anahtar kucultuluyor (`toLowerCase`), deger sistem alaninin `value`'su.
 */
const AUTO_MAP: Record<string, string> = {
  title: 'baslik',
  baslik: 'baslik',
  'başlık': 'baslik',
  price: 'fiyat',
  fiyat: 'fiyat',
  category: 'kategori',
  kategori: 'kategori',
  city: 'il',
  il: 'il',
  sehir: 'il',
  district: 'ilce',
  ilce: 'ilce',
  'ilçe': 'ilce',
  description: 'aciklama',
  aciklama: 'aciklama',
  'açıklama': 'aciklama',
  area: 'metrekare',
  metrekare: 'metrekare',
  m2: 'metrekare',
  rooms: 'odasayisi',
  odasayisi: 'odasayisi',
  'oda sayisi': 'odasayisi',
  'oda sayısı': 'odasayisi',
}

/* -- Props ------------------------------------------------------------------ */

export interface BulkImportPageProps {
  /**
   * Dosya secildiginde cagrilir; cagiran dosyayi ayristirir ve sonucu
   * `onFileParsed` ile geri verir. Gercek CSV/Excel parsing component'in
   * isi degil — presentation katmani yalniz sonucu gosterir.
   */
  onFileSelect?: (file: File) => void
  /**
   * Ayristirilmis dosya verisi. Disaridan verilir boylece component
   * salt sunum katmani kalir.
   */
  parsedFile?: ParsedFile
  /**
   * Eslenmis ve dogrulanmis satirlari sunucuya gonderir.
   * Component `onImport` tamamlanana kadar ilerleme gosterir.
   */
  onImport: (rows: ImportRow[]) => Promise<ImportResult>
  /** Islemi iptal edip sayfadan ayrilir. */
  onCancel: () => void
  /** Dogrulama icin mevcut kategoriler. */
  categories: SelectOption[]
  /** Dogrulama icin mevcut iller. */
  cities: SelectOption[]
}

/* -- Yardimcilar ------------------------------------------------------------ */

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_TYPES = ['.csv', '.xlsx']
const ACCEPTED_MIME = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]

/* -- Component -------------------------------------------------------------- */

/**
 * Toplu ilan icerik aktarimi sihirbazi (bulk import wizard).
 *
 * Dort adimli sunum component'i: dosya yukleme, kolon eslestirme, onizleme
 * ve icerik aktarimi. Veri cekmez — ayristirilmis dosya verisi disaridan
 * `parsedFile` prop'uyla gelir.
 *
 * CSV/Excel ayristirma **uygulanmaz**. Gercek ayristirma cagiran katmanin
 * isidir; component yalniz sonucu gosterir. Story'lerde sahte (mock) veri
 * kullanilir.
 */
export function BulkImportPage({
  onFileSelect,
  parsedFile,
  onImport,
  onCancel,
  categories: _categories,
  cities: _cities,
}: BulkImportPageProps) {
  /* -- Wizard durumu -------------------------------------------------------- */

  const [currentStep, setCurrentStep] = useState(0)
  const [fileError, setFileError] = useState<string | undefined>(undefined)
  const [dragActive, setDragActive] = useState(false)

  /** CSV kolon adi -> sistem alan adi eslesmesi. */
  const [mapping, setMapping] = useState<Record<string, string>>({})

  /** Icerik aktarimi sonucu (4. adim). */
  const [importResult, setImportResult] = useState<ImportResult | undefined>(undefined)
  const [importProgress, setImportProgress] = useState(0)
  const [importing, setImporting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* -- Dosya secimi --------------------------------------------------------- */

  const validateAndSelectFile = useCallback(
    (file: File) => {
      setFileError(undefined)

      if (file.size > MAX_FILE_SIZE) {
        setFileError(`Dosya boyutu en fazla 10 MB olabilir. Secilen: ${formatFileSize(file.size)}`)
        return
      }

      const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
      if (!ACCEPTED_TYPES.includes(extension) && !ACCEPTED_MIME.includes(file.type)) {
        setFileError('Yalnizca .csv ve .xlsx dosyalari kabul edilir.')
        return
      }

      onFileSelect?.(file)
    },
    [onFileSelect],
  )

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setDragActive(false)
      const file = event.dataTransfer.files[0]
      if (file !== undefined) validateAndSelectFile(file)
    },
    [validateAndSelectFile],
  )

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file !== undefined) validateAndSelectFile(file)
    },
    [validateAndSelectFile],
  )

  /* -- Kolon eslestirme ----------------------------------------------------- */

  /**
   * Eslestirme baslatildiginda bilinen kolon adlarini otomatik esle.
   * Yalniz ilk geciste calisir (`mapping` bos ise).
   */
  const initAutoMapping = useCallback(() => {
    if (parsedFile === undefined) return
    if (Object.keys(mapping).length > 0) return

    const auto: Record<string, string> = {}
    const atanmis = new Set<string>()

    for (const col of parsedFile.columns) {
      const hedef = AUTO_MAP[col.name.toLowerCase()]
      if (hedef !== undefined && !atanmis.has(hedef)) {
        auto[col.name] = hedef
        atanmis.add(hedef)
      }
    }

    setMapping(auto)
  }, [parsedFile, mapping])

  const updateMapping = (source: string, target: string) => {
    setMapping((prev) => {
      if (target === '') {
        const next = { ...prev }
        delete next[source]
        return next
      }
      return { ...prev, [source]: target }
    })
  }

  /** Zorunlu alanlarin hepsi eslenmis mi? */
  const allRequiredMapped = SYSTEM_FIELDS.filter((f) => f.required).every((field) =>
    Object.values(mapping).includes(field.value),
  )

  /** Eslenmemis zorunlu alanlar. */
  const unmappedRequired = SYSTEM_FIELDS.filter(
    (f) => f.required && !Object.values(mapping).includes(f.value),
  )

  /* -- Eslestirmede mevcut hedefleri hesapla (bir hedef birden fazla kez secilemez) -- */

  const usedTargets = new Set(Object.values(mapping))

  const getTargetOptions = (currentSource: string): SelectOption[] => {
    const currentTarget = mapping[currentSource]
    return [
      { value: '', label: 'Eslestirme yok' },
      ...SYSTEM_FIELDS.map((f) => ({
        value: f.value,
        label: `${f.label}${f.required ? ' *' : ''}`,
        disabled: usedTargets.has(f.value) && currentTarget !== f.value,
      })),
    ]
  }

  /* -- Adim gecisleri ------------------------------------------------------- */

  const goToMapping = () => {
    initAutoMapping()
    setCurrentStep(1)
  }

  const goToPreview = () => {
    if (!allRequiredMapped) return
    setCurrentStep(2)
  }

  const startImport = async () => {
    if (parsedFile === undefined) return

    setCurrentStep(3)
    setImporting(true)
    setImportProgress(0)

    const rows: ImportRow[] = parsedFile.previewRows.map((row) => {
      const values: Record<string, string> = {}
      for (const [source, target] of Object.entries(mapping)) {
        values[target] = row.values[source] ?? ''
      }
      return { rowIndex: row.rowIndex, values }
    })

    try {
      /** Simule ilerleme: gercek uygulamada `onImport` akis bildirir. */
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => Math.min(prev + 5, 95))
      }, 200)

      const result = await onImport(rows)

      clearInterval(progressInterval)
      setImportProgress(100)
      setImportResult(result)
    } finally {
      setImporting(false)
    }
  }

  /* -- Dogrulama ozeti ------------------------------------------------------ */

  const validationCounts = parsedFile
    ? {
        valid: parsedFile.previewRows.filter((r) => Object.keys(r.errors).length === 0).length,
        error: parsedFile.previewRows.filter((r) => Object.keys(r.errors).length > 0).length,
        warning: parsedFile.previewRows.filter(
          (r) => Object.keys(r.errors).length === 0 && Object.keys(r.warnings).length > 0,
        ).length,
      }
    : { valid: 0, error: 0, warning: 0 }

  /* -- Render --------------------------------------------------------------- */

  const mappedFieldNames = Object.entries(mapping)
    .map(([, target]) => SYSTEM_FIELDS.find((f) => f.value === target)?.label)
    .filter(Boolean)

  return (
    <div className={css.root}>
      <h2 className={css.heading}>Toplu Ilan Icerik Aktarimi</h2>

      {/* Adim gostergesi */}
      <ol className={css.steps}>
        {STEP_LABELS.map((label, idx) => (
          <li
            key={label}
            className={[
              css.step,
              idx === currentStep ? css.stepActive : undefined,
              idx < currentStep ? css.stepDone : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span
              className={[
                css.stepNumber,
                idx === currentStep ? css.stepNumberActive : undefined,
                idx < currentStep ? css.stepNumberDone : undefined,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {idx < currentStep ? <Check size={14} aria-hidden="true" /> : idx + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {/* ADIM 0: Dosya yukleme */}
      {currentStep === 0 ? (
        <>
          <div
            role="button"
            tabIndex={0}
            className={[
              css.dropzone,
              dragActive ? css.dropzoneActive : undefined,
              fileError !== undefined ? css.dropzoneError : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
          >
            <FileSpreadsheet size={48} className={css.dropzoneIcon} aria-hidden="true" />
            <span className={css.dropzoneLabel}>
              {dragActive
                ? 'Dosyayi birakin'
                : 'CSV veya Excel dosyasini surukleyip birakin'}
            </span>
            <span className={css.dropzoneHint}>
              veya dosya secmek icin tiklayin (.csv, .xlsx - maks. 10 MB)
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            style={{ display: 'none' }}
            onChange={handleFileInput}
            aria-label="Dosya sec"
          />

          <div className={css.actions}>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              Dosya sec
            </Button>
          </div>

          {fileError !== undefined ? (
            <Alert tone="danger" title="Gecersiz dosya" description={fileError} />
          ) : null}

          {parsedFile !== undefined ? (
            <>
              <div className={css.fileInfo}>
                <FileSpreadsheet size={24} aria-hidden="true" />
                <div className={css.fileDetails}>
                  <span className={css.fileName}>{parsedFile.fileName}</span>
                  <span className={css.fileMeta}>
                    {formatFileSize(parsedFile.fileSize)} - {parsedFile.rowCount} satir
                  </span>
                </div>
              </div>
              <div className={css.actions}>
                <Button variant="secondary" onClick={onCancel}>
                  Iptal
                </Button>
                <Button variant="primary" onClick={goToMapping}>
                  Devam et
                </Button>
              </div>
            </>
          ) : null}
        </>
      ) : null}

      {/* ADIM 1: Kolon eslestirme */}
      {currentStep === 1 && parsedFile !== undefined ? (
        <>
          {unmappedRequired.length > 0 ? (
            <Alert
              tone="warning"
              title="Eslenmemis zorunlu alanlar"
              description={`Su alanlar henuz eslenmedi: ${unmappedRequired.map((f) => f.label).join(', ')}`}
            />
          ) : null}

          <div className={css.mappingGrid}>
            {parsedFile.columns.map((col) => (
              <div key={col.name} className={css.mappingRow}>
                <div className={css.mappingSource}>
                  <span className={css.mappingSourceLabel}>{col.name}</span>
                  {col.sampleValues.length > 0 ? (
                    <span className={css.mappingSourceSample}>
                      Ornek: {col.sampleValues.slice(0, 2).join(', ')}
                    </span>
                  ) : null}
                </div>

                <span className={css.mappingArrow}>
                  <ArrowRight size={16} aria-hidden="true" />
                </span>

                <Select
                  label={`${col.name} eslestirmesi`}
                  value={mapping[col.name] ?? ''}
                  options={getTargetOptions(col.name)}
                  onValueChange={(value) => updateMapping(col.name, value ?? '')}
                />
              </div>
            ))}
          </div>

          {allRequiredMapped ? (
            <Alert
              tone="success"
              title="Eslestirme tamamlandi"
              description={`${mappedFieldNames.length} alan eslendi.`}
            />
          ) : null}

          <div className={css.actions}>
            <Button variant="secondary" onClick={() => setCurrentStep(0)}>
              Geri
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              Iptal
            </Button>
            <Button variant="primary" disabled={!allRequiredMapped} onClick={goToPreview}>
              Devam et
            </Button>
          </div>
        </>
      ) : null}

      {/* ADIM 2: Onizleme & dogrulama */}
      {currentStep === 2 && parsedFile !== undefined ? (
        <>
          <div className={css.validationSummary}>
            <span className={css.validationStat}>
              <Badge tone="success" variant="soft" size="sm">
                {validationCounts.valid}
              </Badge>
              satir gecerli
            </span>
            <span className={css.validationStat}>
              <Badge tone="danger" variant="soft" size="sm">
                {validationCounts.error}
              </Badge>
              satir hatali
            </span>
            <span className={css.validationStat}>
              <Badge tone="warning" variant="soft" size="sm">
                {validationCounts.warning}
              </Badge>
              satir uyari
            </span>
          </div>

          <div className={css.tableWrapper}>
            <table className={css.previewTable}>
              <thead>
                <tr>
                  <th className={css.previewTh}>#</th>
                  {Object.entries(mapping).map(([source, target]) => {
                    const field = SYSTEM_FIELDS.find((f) => f.value === target)
                    return (
                      <th key={source} className={css.previewTh}>
                        {field?.label ?? target}
                      </th>
                    )
                  })}
                  <th className={css.previewTh}>Durum</th>
                </tr>
              </thead>
              <tbody>
                {parsedFile.previewRows.slice(0, 20).map((row) => {
                  const hasErrors = Object.keys(row.errors).length > 0
                  const hasWarnings = Object.keys(row.warnings).length > 0
                  return (
                    <tr key={row.rowIndex}>
                      <td className={css.previewTd}>{row.rowIndex}</td>
                      {Object.entries(mapping).map(([source, target]) => {
                        const cellValue = row.values[source] ?? ''
                        const error = row.errors[target]
                        const warning = row.warnings[target]
                        return (
                          <td
                            key={source}
                            className={[
                              css.previewTd,
                              error !== undefined ? css.previewTdError : undefined,
                              warning !== undefined && error === undefined
                                ? css.previewTdWarning
                                : undefined,
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            title={error ?? warning}
                          >
                            {cellValue}
                          </td>
                        )
                      })}
                      <td className={css.previewTd}>
                        {hasErrors ? (
                          <Badge tone="danger" variant="soft" size="sm">
                            Hata
                          </Badge>
                        ) : hasWarnings ? (
                          <Badge tone="warning" variant="soft" size="sm">
                            Uyari
                          </Badge>
                        ) : (
                          <Badge tone="success" variant="soft" size="sm">
                            Gecerli
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {validationCounts.error > 0 ? (
            <Alert
              tone="warning"
              title="Hatali satirlar atlancak"
              description={`${validationCounts.error} hatali satir icerik aktarimi sirasinda atlanacak. Yalnizca gecerli satirlar aktarilacak.`}
            />
          ) : null}

          <div className={css.actions}>
            <Button variant="secondary" onClick={() => setCurrentStep(1)}>
              Geri
            </Button>
            <Button variant="secondary" onClick={onCancel}>
              Iptal
            </Button>
            <Button
              variant="primary"
              disabled={validationCounts.valid === 0}
              onClick={startImport}
            >
              Icerik aktarimini baslat ({validationCounts.valid} satir)
            </Button>
          </div>
        </>
      ) : null}

      {/* ADIM 3: Icerik aktarimi */}
      {currentStep === 3 ? (
        <div className={css.progressSection}>
          {importing ? (
            <>
              <div className={css.progressBar}>
                <div className={css.progressFill} style={{ width: `${importProgress}%` }} />
              </div>
              <p className={css.progressLabel}>
                Icerik aktarimi devam ediyor... %{importProgress}
              </p>
              <Spinner label="Icerik aktariliyor" />
            </>
          ) : importResult !== undefined ? (
            <>
              <div className={css.successBlock}>
                <CheckCircle size={48} className={css.resultSuccess} aria-hidden="true" />
                <h3 className={css.successTitle}>Icerik aktarimi tamamlandi</h3>
                <p className={css.summaryText}>
                  {importResult.successCount} ilan basariyla aktarildi
                  {importResult.errorCount > 0
                    ? `, ${importResult.errorCount} ilan hata ile atlandi`
                    : ''}
                </p>
              </div>

              {importResult.results.length > 0 ? (
                <div className={css.importResultList}>
                  {importResult.results.map((row) => (
                    <div key={row.rowIndex} className={css.importResultRow}>
                      {row.status === 'success' ? (
                        <Check size={16} className={css.resultSuccess} aria-hidden="true" />
                      ) : (
                        <X size={16} className={css.resultError} aria-hidden="true" />
                      )}
                      <span className={row.status === 'success' ? css.resultSuccess : css.resultError}>
                        Satir {row.rowIndex}:
                        {row.status === 'success'
                          ? ' Basarili'
                          : ` Hata - ${row.errorMessage ?? 'Bilinmeyen hata'}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className={css.actions}>
                <Button variant="secondary" leadingIcon={<Download size={18} />} onClick={() => {}}>
                  Sonuclari indir
                </Button>
                <Button variant="primary" onClick={onCancel}>
                  Ilan listesine don
                </Button>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
