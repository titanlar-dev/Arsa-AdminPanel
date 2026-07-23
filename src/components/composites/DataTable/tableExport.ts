import type { ColumnDef } from '../../../types/component-props'

export interface CSVOptions {
  /** Alan ayiricisi. @default ',' */
  separator?: string
  /** Baslik satirini dahil et. @default true */
  includeHeaders?: boolean
}

/**
 * Satir ve sutun tanimlarindan CSV metni uretir.
 *
 * - UTF-8 BOM eklenir: Excel Turkce karakterleri dogru gosterir.
 * - `ColumnDef.accessor` veya `ColumnDef.cell` ile deger okunur; `cell` bir
 *   `ReactNode` dondurdugu icin CSV'de sadece `accessor`/`sortAccessor`'dan
 *   gelen ham deger kullanilir. `cell` verilmis ama `accessor` yoksa hucre
 *   bos kalir — bicimlenmis cikti icin `sortAccessor`'a dusulur.
 * - Degerler RFC 4180'e uygun kacar: cift tirnak, virgul veya yeni satir
 *   iceren degerler cift tirnakla sarilir.
 */
export function generateCSV<T extends { id: string }>(
  rows: T[],
  columns: ColumnDef<T>[],
  options?: CSVOptions,
): string {
  const separator = options?.separator ?? ','
  const includeHeaders = options?.includeHeaders ?? true

  const escapeCell = (value: unknown): string => {
    if (value === null || value === undefined) return ''
    const str = value instanceof Date ? value.toISOString() : String(value)
    // RFC 4180: tirnak, ayirici veya yeni satir varsa sarmala
    if (str.includes('"') || str.includes(separator) || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const getCellValue = (row: T, column: ColumnDef<T>): unknown => {
    // accessor once, cunku ham deger verir
    if (column.accessor !== undefined) {
      return row[column.accessor]
    }
    // sortAccessor ham deger verebilir (para tutari, tarih vs.)
    if (column.sortAccessor !== undefined) {
      return column.sortAccessor(row)
    }
    // filterAccessor metin verir
    if (column.filterAccessor !== undefined) {
      return column.filterAccessor(row)
    }
    return ''
  }

  const lines: string[] = []

  if (includeHeaders) {
    const headerLine = columns
      .map((col) => {
        // header ReactNode olabilir; string degilse id kullan
        const label = typeof col.header === 'string' ? col.header : col.id
        return escapeCell(label)
      })
      .join(separator)
    lines.push(headerLine)
  }

  for (const row of rows) {
    const line = columns.map((col) => escapeCell(getCellValue(row, col))).join(separator)
    lines.push(line)
  }

  // UTF-8 BOM + icerik
  return '\uFEFF' + lines.join('\r\n')
}

/**
 * Uretilen CSV'yi tarayicida dosya olarak indirir.
 *
 * Blob `text/csv;charset=utf-8` olarak olusturulur; BOM `generateCSV`
 * tarafindan eklenmistir.
 */
export function downloadCSV(csvContent: string, filename: string = 'export.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  // Temizlik: DOM'dan kaldir ve URL'yi serbest birak
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}
