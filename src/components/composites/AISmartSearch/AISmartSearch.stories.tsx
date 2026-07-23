import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { SearchResult } from './AISmartSearch'
import { AISmartSearch } from './AISmartSearch'

/* ------------------------------------------------------------------ */
/*  Ornek veriler                                                      */
/* ------------------------------------------------------------------ */

const RECENT_SEARCHES = [
  'kadikoy 3+1 daire',
  'ahmet yilmaz',
  'son 7 gunde onaylanan ilanlar',
  'satilik villa besiktas',
  'kurumsal kullanicilar',
]

const LISTING_RESULTS: SearchResult[] = [
  {
    id: 'l1',
    title: 'Kadikoy Moda 3+1 Deniz Manzarali Daire',
    description: 'Kadikoy, Istanbul - 145 m2',
    price: '4.850.000 TL',
    thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=80&h=80&fit=crop',
    status: { label: 'Yayinda', variant: 'success' },
  },
  {
    id: 'l2',
    title: 'Kadikoy Feneryolu 3+1 Ara Kat',
    description: 'Kadikoy, Istanbul - 120 m2',
    price: '3.600.000 TL',
    thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=80&h=80&fit=crop',
    status: { label: 'Yayinda', variant: 'success' },
  },
  {
    id: 'l3',
    title: 'Kadikoy Caddebostan 3+1 Lux Daire',
    description: 'Kadikoy, Istanbul - 180 m2',
    price: '7.200.000 TL',
    thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=80&h=80&fit=crop',
    status: { label: 'Beklemede', variant: 'warning' },
  },
  {
    id: 'l4',
    title: 'Kadikoy Bostanci 3+1 Yeni Bina',
    description: 'Kadikoy, Istanbul - 135 m2',
    price: '4.100.000 TL',
    status: { label: 'Taslak', variant: 'neutral' },
  },
]

const USER_RESULTS: SearchResult[] = [
  {
    id: 'u1',
    title: 'Ahmet Yilmaz',
    description: 'Bireysel - 12 ilan',
    avatar: 'https://i.pravatar.cc/64?u=ahmet',
    status: { label: 'Aktif', variant: 'success' },
  },
  {
    id: 'u2',
    title: 'Ahmet Kaya Emlak',
    description: 'Kurumsal - 48 ilan',
    avatar: 'https://i.pravatar.cc/64?u=ahmetkaya',
    status: { label: 'Aktif', variant: 'success' },
  },
]

const ACTION_RESULTS: SearchResult[] = [
  {
    id: 'a1',
    title: 'Ilan #4521 onaylandi',
    description: '2 saat once - Admin: Mehmet D.',
    status: { label: 'Onay', variant: 'success' },
  },
  {
    id: 'a2',
    title: 'Ilan #4518 reddedildi',
    description: '3 saat once - Admin: Ayse K.',
    status: { label: 'Red', variant: 'danger' },
  },
]

const COMMAND_RESULTS: SearchResult[] = [
  {
    id: 'c1',
    title: 'Toplu Ilan Onayla',
    description: 'Secili ilanlari toplu olarak onayla',
  },
  {
    id: 'c2',
    title: 'Rapor Olustur',
    description: 'Ilan istatistik raporu olustur',
  },
  {
    id: 'c3',
    title: 'Kullanici Davet Et',
    description: 'Yeni kullanici davet e-postasi gonder',
  },
]

const PARSED_KADIKOY = {
  chips: [
    { label: 'Konum', value: 'Kadikoy', category: 'location' },
    { label: 'Tip', value: '3+1 Daire', category: 'type' },
    { label: 'Fiyat', value: '<5M TL', category: 'price' },
  ],
}

const PARSED_REJECTED = {
  chips: [
    { label: 'Tarih', value: 'Son 7 gun', category: 'date' },
    { label: 'Durum', value: 'Reddedildi', category: 'status' },
  ],
}

const PARSED_USER = {
  chips: [{ label: 'Kullanici', value: 'Ahmet Yilmaz', category: 'user' }],
}

const SUGGESTIONS = ['kadikoy 3+1 satilik daire', 'kadikoy kiralik daire', 'kadikoy arsa ilanlari']

/* ------------------------------------------------------------------ */
/*  Glass dekorator                                                    */
/* ------------------------------------------------------------------ */

const koyuZemin = (Story: () => React.JSX.Element) => (
  <div
    style={{
      minHeight: '100vh',
      background: '#050510',
      backgroundImage:
        'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 100%, rgba(139,92,246,0.10) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 5% 50%, rgba(59,130,246,0.08) 0%, transparent 50%)',
      position: 'relative',
    }}
  >
    <Story />
  </div>
)

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: 'Composites/AISmartSearch',
  component: AISmartSearch,

  tags: ['stable'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AI destekli akilli arama overlay\'i. Dogal dil sorgularini chip\'lerle ' +
          'gorsellestiren, sonuclari kategorize eden ve AI onerileri sunan bir ' +
          'arama bileseni. Tum sonuclar ve ayristirma props uzerinden gelir -- bilesen ' +
          'arama mantigi icermez. Glass estetigi DynamicIsland ile ayni koyu ' +
          'cam-morfizm dilindedir.',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'search',
      useWhen: [
        'Koyu, cam temalı panelde AI destekli global arama istenirken',
        'Dogal dil ile ilan/kullanici/islem aramasi gerektiginde',
      ],
      doNotUseWhen: [
        'Basit metin filtreleme yeterliyse -- SearchInput kullanin',
        'Acik tema panelde -- ayri stil gerekir',
      ],
    },
  },

  decorators: [koyuZemin],

  args: {
    open: true,
    onOpenChange: fn(),
    onSearch: fn(),
    onResultClick: fn(),
    onClearHistory: fn(),
  },

  argTypes: {
    open: { control: 'boolean' },
    isSearching: { control: 'boolean' },
    results: { control: false },
    parsedQuery: { control: false },
    suggestions: { control: false },
    recentSearches: { control: false },
  },
} satisfies Meta<typeof AISmartSearch>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/*  Story'ler                                                          */
/* ------------------------------------------------------------------ */

/** Bos arama cubugu -- son aramalar gosterilir. */
export const Empty: Story = {
  args: {
    recentSearches: RECENT_SEARCHES,
  },
}

/** Dogal dil sorgusu: "kadikoy 3+1 daire 5 milyon alti" -> ayristirma chip'leri + sonuclar. */
export const NaturalLanguageQuery: Story = {
  args: {
    parsedQuery: PARSED_KADIKOY,
    results: {
      listings: LISTING_RESULTS,
      users: [],
      actions: [],
      commands: [],
    },
  },
}

/** Kullanici arama: "ahmet yilmaz kullanicisi" -> kullanici chip'i + sonuclar. */
export const UserSearch: Story = {
  args: {
    parsedQuery: PARSED_USER,
    results: {
      listings: [],
      users: USER_RESULTS,
      actions: [],
      commands: [],
    },
  },
}

/** Komut arama: sistem komutlarini arama. */
export const CommandSearch: Story = {
  args: {
    results: {
      listings: [],
      users: [],
      actions: [],
      commands: COMMAND_RESULTS,
    },
  },
}

/** AI duzeltme: "Bunu mu demek istediniz?" onerileri gosterilir. */
export const AICorrection: Story = {
  args: {
    parsedQuery: PARSED_KADIKOY,
    results: {
      listings: LISTING_RESULTS.slice(0, 2),
      users: [],
      actions: [],
      commands: [],
    },
    suggestions: SUGGESTIONS,
  },
}

/** Sonuc yok -- bos durum + oneriler. */
export const NoResults: Story = {
  args: {
    parsedQuery: {
      chips: [
        { label: 'Konum', value: 'Tuzla', category: 'location' },
        { label: 'Tip', value: '6+1 Villa', category: 'type' },
      ],
    },
    results: {
      listings: [],
      users: [],
      actions: [],
      commands: [],
    },
    suggestions: ['tuzla 4+1 villa', 'tuzla mustakil ev', 'tuzla arsa'],
  },
}

/** Yukleniyor -- arama devam ederken iskelet gosterilir. */
export const Loading: Story = {
  args: {
    parsedQuery: PARSED_KADIKOY,
    isSearching: true,
  },
}

/** Mobil gorunum -- 320px tam ekran arama. */
export const MobileView: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [320] },
  },
  args: {
    parsedQuery: PARSED_KADIKOY,
    results: {
      listings: LISTING_RESULTS.slice(0, 2),
      users: USER_RESULTS.slice(0, 1),
      actions: [],
      commands: [],
    },
  },
}

/** Tam dolu -- tum kategorilerde sonuclar, chip'ler ve oneriler. */
export const FullResults: Story = {
  args: {
    parsedQuery: PARSED_REJECTED,
    results: {
      listings: LISTING_RESULTS,
      users: USER_RESULTS,
      actions: ACTION_RESULTS,
      commands: COMMAND_RESULTS,
    },
    suggestions: ['reddedilen ilanlar son 30 gun', 'onay bekleyen ilanlar'],
  },
}
