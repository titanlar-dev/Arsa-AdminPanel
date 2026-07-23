/**
 * Turkiye emlak kategori hiyerarsisi.
 *
 * Ilan sayilari dashboard kategori dagilimi ile tutarlidir.
 */

import { ListingCategory } from '../types/domain'
import type { CategoryTreeNode } from '../types/component-props'

export const categoryTree: CategoryTreeNode[] = [
  {
    id: 'cat-konut',
    label: 'Konut',
    category: ListingCategory.Residential,
    active: true,
    count: 1612,
    children: [
      { id: 'cat-konut-daire', label: 'Daire', active: true, count: 892 },
      { id: 'cat-konut-rezidans', label: 'Rezidans', active: true, count: 124 },
      { id: 'cat-konut-villa', label: 'Villa', active: true, count: 215 },
      { id: 'cat-konut-mustakil', label: 'Mustakil Ev', active: true, count: 178 },
      { id: 'cat-konut-yazlik', label: 'Yazlik', active: true, count: 134 },
      { id: 'cat-konut-ciftlik', label: 'Ciftlik Evi', active: true, count: 45 },
      { id: 'cat-konut-prefabrik', label: 'Prefabrik', active: true, count: 24 },
    ],
  },
  {
    id: 'cat-arsa',
    label: 'Arsa',
    category: ListingCategory.Land,
    active: true,
    count: 558,
    children: [
      { id: 'cat-arsa-konut-imarli', label: 'Konut Imarli', active: true, count: 198 },
      { id: 'cat-arsa-ticari-imarli', label: 'Ticari Imarli', active: true, count: 87 },
      { id: 'cat-arsa-sanayi-imarli', label: 'Sanayi Imarli', active: true, count: 45 },
      { id: 'cat-arsa-turizm-imarli', label: 'Turizm Imarli', active: true, count: 32 },
      { id: 'cat-arsa-tarla', label: 'Tarla', active: true, count: 156 },
      { id: 'cat-arsa-bag-bahce', label: 'Bag / Bahce', active: true, count: 40 },
    ],
  },
  {
    id: 'cat-isyeri',
    label: 'Isyeri',
    category: ListingCategory.Commercial,
    active: true,
    count: 465,
    children: [
      { id: 'cat-isyeri-dukkan', label: 'Dukkan / Magaza', active: true, count: 178 },
      { id: 'cat-isyeri-ofis', label: 'Ofis', active: true, count: 134 },
      { id: 'cat-isyeri-plaza', label: 'Plaza Kati', active: true, count: 56 },
      { id: 'cat-isyeri-depo', label: 'Depo / Antrepo', active: true, count: 67 },
      { id: 'cat-isyeri-fabrika', label: 'Fabrika', active: false, count: 12 },
      { id: 'cat-isyeri-atolye', label: 'Atolye', active: true, count: 18 },
    ],
  },
  {
    id: 'cat-bina',
    label: 'Bina',
    category: ListingCategory.Building,
    active: true,
    count: 186,
    children: [
      { id: 'cat-bina-komple', label: 'Komple Bina', active: true, count: 186 },
    ],
  },
  {
    id: 'cat-devremulk',
    label: 'Devremulk',
    category: ListingCategory.Timeshare,
    active: true,
    count: 155,
    children: [
      { id: 'cat-devremulk-devremulk', label: 'Devremulk', active: true, count: 155 },
    ],
  },
  {
    id: 'cat-turistik',
    label: 'Turistik Tesis',
    category: ListingCategory.TourismFacility,
    active: true,
    count: 124,
    children: [
      { id: 'cat-turistik-otel', label: 'Otel', active: true, count: 38 },
      { id: 'cat-turistik-butik-otel', label: 'Butik Otel', active: true, count: 28 },
      { id: 'cat-turistik-apart-otel', label: 'Apart Otel', active: true, count: 22 },
      { id: 'cat-turistik-pansiyon', label: 'Pansiyon', active: true, count: 18 },
      { id: 'cat-turistik-motel', label: 'Motel', active: false, count: 5 },
      { id: 'cat-turistik-tatil-koyu', label: 'Tatil Koyu', active: true, count: 10 },
      { id: 'cat-turistik-kamp', label: 'Kamp Yeri', active: true, count: 3 },
    ],
  },
]

/** Duz liste: tum yaprak kategoriler. */
export const allLeafCategories: CategoryTreeNode[] = categoryTree.flatMap(
  parent => parent.children ?? [parent],
)

/** Toplam ilan sayisi (kok dugumlerin toplami). */
export const totalListingCount: number = categoryTree.reduce(
  (sum, node) => sum + (node.count ?? 0),
  0,
)
