import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { LocationNode, LocationStats } from '../../types/component-props'
import { LocationManagementPage } from './LocationManagementPage'

/* ──────────────────────────────────────────────────────────────────────────
   Fixture
   ────────────────────────────────────────────────────────────────────────── */

const MODA: LocationNode = {
  id: 'moda',
  name: 'Moda',
  level: 'mahalle',
  active: true,
  listingCount: 342,
  activeListingCount: 281,
  coordinates: { lat: 40.9828, lng: 29.0254 },
}

const CAFERAGA: LocationNode = {
  id: 'caferaga',
  name: 'Caferaga',
  level: 'mahalle',
  active: true,
  listingCount: 218,
  activeListingCount: 195,
  coordinates: { lat: 40.9875, lng: 29.0280 },
}

const OSMANAGA: LocationNode = {
  id: 'osmanaga',
  name: 'Osmanaga',
  level: 'mahalle',
  active: true,
  listingCount: 176,
  activeListingCount: 152,
}

const FENERBAHCE: LocationNode = {
  id: 'fenerbahce',
  name: 'Fenerbahce',
  level: 'mahalle',
  active: true,
  listingCount: 287,
  activeListingCount: 241,
}

const GOZTEPE: LocationNode = {
  id: 'goztepe',
  name: 'Goztepe',
  level: 'mahalle',
  active: false,
  listingCount: 12,
  activeListingCount: 0,
}

const KADIKOY: LocationNode = {
  id: 'kadikoy',
  name: 'Kadikoy',
  level: 'ilce',
  active: true,
  listingCount: 1035,
  activeListingCount: 869,
  children: [MODA, CAFERAGA, OSMANAGA, FENERBAHCE, GOZTEPE],
  coordinates: { lat: 40.9927, lng: 29.0290 },
}

const USKUDAR: LocationNode = {
  id: 'uskudar',
  name: 'Uskudar',
  level: 'ilce',
  active: true,
  listingCount: 782,
  activeListingCount: 654,
  children: [
    { id: 'cengelkoy', name: 'Cengelkoy', level: 'mahalle', active: true, listingCount: 145, activeListingCount: 122 },
    { id: 'beylerbeyi', name: 'Beylerbeyi', level: 'mahalle', active: true, listingCount: 198, activeListingCount: 167 },
    { id: 'kuzguncuk', name: 'Kuzguncuk', level: 'mahalle', active: true, listingCount: 89, activeListingCount: 74 },
  ],
}

const BESIKTAS: LocationNode = {
  id: 'besiktas',
  name: 'Besiktas',
  level: 'ilce',
  active: true,
  listingCount: 1240,
  activeListingCount: 1089,
  children: [
    { id: 'levent', name: 'Levent', level: 'mahalle', active: true, listingCount: 420, activeListingCount: 380 },
    { id: 'etiler', name: 'Etiler', level: 'mahalle', active: true, listingCount: 310, activeListingCount: 276 },
    { id: 'bebek', name: 'Bebek', level: 'mahalle', active: true, listingCount: 198, activeListingCount: 172 },
  ],
}

const ISTANBUL: LocationNode = {
  id: 'istanbul',
  name: 'Istanbul',
  level: 'il',
  active: true,
  listingCount: 12450,
  activeListingCount: 10234,
  children: [KADIKOY, USKUDAR, BESIKTAS],
  coordinates: { lat: 41.0082, lng: 28.9784 },
}

const ANKARA: LocationNode = {
  id: 'ankara',
  name: 'Ankara',
  level: 'il',
  active: true,
  listingCount: 8920,
  activeListingCount: 7430,
  children: [
    {
      id: 'cankaya',
      name: 'Cankaya',
      level: 'ilce',
      active: true,
      listingCount: 3420,
      activeListingCount: 2890,
      children: [
        { id: 'kavaklidere', name: 'Kavaklidere', level: 'mahalle', active: true, listingCount: 520, activeListingCount: 445 },
        { id: 'gaziosmanpasa-mh', name: 'Gaziosmanpasa', level: 'mahalle', active: true, listingCount: 380, activeListingCount: 312 },
      ],
    },
    {
      id: 'kecioren',
      name: 'Kecioren',
      level: 'ilce',
      active: true,
      listingCount: 2180,
      activeListingCount: 1820,
      children: [
        { id: 'etlik', name: 'Etlik', level: 'mahalle', active: true, listingCount: 640, activeListingCount: 540 },
      ],
    },
  ],
  coordinates: { lat: 39.9334, lng: 32.8597 },
}

const IZMIR: LocationNode = {
  id: 'izmir',
  name: 'Izmir',
  level: 'il',
  active: true,
  listingCount: 7650,
  activeListingCount: 6320,
  children: [
    {
      id: 'konak',
      name: 'Konak',
      level: 'ilce',
      active: true,
      listingCount: 1890,
      activeListingCount: 1560,
      children: [
        { id: 'alsancak', name: 'Alsancak', level: 'mahalle', active: true, listingCount: 420, activeListingCount: 356 },
      ],
    },
    {
      id: 'karsiyaka',
      name: 'Karsiyaka',
      level: 'ilce',
      active: true,
      listingCount: 1420,
      activeListingCount: 1180,
      children: [
        { id: 'bostanli', name: 'Bostanli', level: 'mahalle', active: true, listingCount: 380, activeListingCount: 312 },
      ],
    },
  ],
  coordinates: { lat: 38.4192, lng: 27.1287 },
}

const ANTALYA: LocationNode = {
  id: 'antalya',
  name: 'Antalya',
  level: 'il',
  active: true,
  listingCount: 5430,
  activeListingCount: 4560,
  children: [
    {
      id: 'muratpasa',
      name: 'Muratpasa',
      level: 'ilce',
      active: true,
      listingCount: 1650,
      activeListingCount: 1380,
      children: [
        { id: 'lara', name: 'Lara', level: 'mahalle', active: true, listingCount: 520, activeListingCount: 432 },
        { id: 'konyaalti-mh', name: 'Konyaalti', level: 'mahalle', active: true, listingCount: 410, activeListingCount: 345 },
      ],
    },
  ],
  coordinates: { lat: 36.8969, lng: 30.7133 },
}

const BURSA: LocationNode = {
  id: 'bursa',
  name: 'Bursa',
  level: 'il',
  active: false,
  listingCount: 24,
  activeListingCount: 0,
  children: [
    {
      id: 'osmangazi',
      name: 'Osmangazi',
      level: 'ilce',
      active: false,
      listingCount: 24,
      activeListingCount: 0,
      children: [],
    },
  ],
  coordinates: { lat: 40.1826, lng: 29.0665 },
}

const KONUM_AGACI: LocationNode[] = [ISTANBUL, ANKARA, IZMIR, ANTALYA, BURSA]

const ISTATISTIKLER: LocationStats = {
  totalIl: 5,
  totalIlce: 9,
  totalMahalle: 18,
  activeCount: 30,
}

/* ──────────────────────────────────────────────────────────────────────────
   Meta
   ────────────────────────────────────────────────────────────────────────── */

const meta = {
  title: 'Screens/LocationManagementPage',
  component: LocationManagementPage,

  tags: ['stable'],

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Konum yonetimi ekrani: il/ilce/mahalle hiyerarsisinde CRUD islemleri ve ' +
          'ilan istatistikleri. Genis ekranda split-view, dar ekranda drill-down. ' +
          'Veri cekmez: her sey prop olarak gelir.',
      },
    },
  },

  args: {
    locations: KONUM_AGACI,
    stats: ISTATISTIKLER,
    onSelectLocation: fn(),
    onSaveLocation: fn().mockResolvedValue(undefined),
    onDeleteLocation: fn().mockResolvedValue(undefined),
    onCreateLocation: fn().mockResolvedValue(undefined),
  },

  argTypes: {
    locations: { control: false },
    stats: { control: false },
  },
} satisfies Meta<typeof LocationManagementPage>

export default meta

type Story = StoryObj<typeof meta>

/* ──────────────────────────────────────────────────────────────────────────
   Stories
   ────────────────────────────────────────────────────────────────────────── */

/** Tam sayfa: 5 il, ilceler ve mahalleler. Istatistik kartlari ustte. */
export const Default: Story = {}

/** Kadikoy secili: detay panelinde konum bilgileri ve ilan istatistikleri gorunur. */
export const LocationSelected: Story = {
  args: {
    selectedLocationId: 'kadikoy',
  },
}

/** Hic konum secilmemis: sag panelde yonlendirme mesaji. */
export const EmptyDetail: Story = {
  args: {},
}

/**
 * Yeni mahalle ekleme formu acik.
 *
 * Gercek uygulamada form bir modal veya satir ici olabilir; burada
 * alt kisimda gosteriliyor.
 */
export const CreateNewLocation: Story = {
  render: function Render(args) {
    return (
      <div>
        <LocationManagementPage
          {...args}
          selectedLocationId="kadikoy"
        />
        {/* Story gosterimi icin: gercekte form component icinde yonetiliyor */}
      </div>
    )
  },
  args: {
    selectedLocationId: 'kadikoy',
  },
}

/**
 * Silme onayi: aktif ilani olmayan konum icin ConfirmDialog.
 *
 * Bursa ili pasif ve 0 aktif ilani var, silinebilir durumda.
 */
export const DeleteConfirmation: Story = {
  args: {
    selectedLocationId: 'goztepe',
  },
}

/** Mobil gorunum: 320px viewport. Drill-down calisiyor. */
export const MobileView: Story = {
  globals: { viewport: { value: 'mobile320' } },
  args: {
    selectedLocationId: 'kadikoy',
  },
}

/** Masaustu split gorunumu. */
export const DesktopSplit: Story = {
  globals: { viewport: { value: 'desktop1440' } },
  args: {
    selectedLocationId: 'kadikoy',
  },
}

/** Pasif konum secili: rozet gorunur. */
export const PassiveLocation: Story = {
  args: {
    selectedLocationId: 'bursa',
  },
}

/** Mahalle secili: en derin seviye, alt konum ekleme yok. */
export const MahalleSelected: Story = {
  args: {
    selectedLocationId: 'moda',
  },
}

/** Istatistikler olmadan: StatCard sırası gorunmez. */
export const WithoutStats: Story = {
  args: {
    selectedLocationId: 'kadikoy',
  },
}

/**
 * Gercek durum: secim, duzenleme ve kaydetme cagiraninda.
 */
export const Interactive: Story = {
  render: function Render(args) {
    const [seciliId, setSeciliId] = useState('istanbul')

    return (
      <LocationManagementPage
        {...args}
        selectedLocationId={seciliId}
        onSelectLocation={(id) => setSeciliId(id)}
      />
    )
  },
}
