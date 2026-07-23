import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import type { SelectOption, CascadingSelectLevel } from '../../../types/component-props'
import { CascadingSelect } from './CascadingSelect'

// ---------------------------------------------------------------------------
// Statik veri: Il -> Ilce -> Mahalle
// ---------------------------------------------------------------------------

const ILLER: SelectOption[] = [
  { value: '34', label: 'Istanbul' },
  { value: '06', label: 'Ankara' },
  { value: '35', label: 'Izmir' },
  { value: '07', label: 'Antalya' },
  { value: '16', label: 'Bursa' },
]

const ILCELER: Record<string, SelectOption[]> = {
  '34': [
    { value: '34-kadikoy', label: 'Kadikoy' },
    { value: '34-besiktas', label: 'Besiktas' },
    { value: '34-uskudar', label: 'Uskudar' },
    { value: '34-fatih', label: 'Fatih' },
    { value: '34-sariyer', label: 'Sariyer' },
  ],
  '06': [
    { value: '06-cankaya', label: 'Cankaya' },
    { value: '06-kecioren', label: 'Kecioren' },
    { value: '06-mamak', label: 'Mamak' },
    { value: '06-yenimahalle', label: 'Yenimahalle' },
  ],
  '35': [
    { value: '35-konak', label: 'Konak' },
    { value: '35-karsiyaka', label: 'Karsiyaka' },
    { value: '35-bornova', label: 'Bornova' },
  ],
  '07': [
    { value: '07-muratpasa', label: 'Muratpasa' },
    { value: '07-konyaalti', label: 'Konyaalti' },
    { value: '07-kepez', label: 'Kepez' },
    { value: '07-alanya', label: 'Alanya' },
  ],
  '16': [
    { value: '16-osmangazi', label: 'Osmangazi' },
    { value: '16-nilufer', label: 'Nilufer' },
    { value: '16-yildirim', label: 'Yildirim' },
  ],
}

const MAHALLELER: Record<string, SelectOption[]> = {
  '34-kadikoy': [
    { value: 'caferaga', label: 'Caferaga' },
    { value: 'moda', label: 'Moda' },
    { value: 'fenerbahce', label: 'Fenerbahce' },
  ],
  '34-besiktas': [
    { value: 'levent', label: 'Levent' },
    { value: 'etiler', label: 'Etiler' },
  ],
  '34-uskudar': [
    { value: 'cengelkoy', label: 'Cengelkoy' },
    { value: 'kuzguncuk', label: 'Kuzguncuk' },
  ],
  '34-fatih': [
    { value: 'sultanahmet', label: 'Sultanahmet' },
    { value: 'sirkeci', label: 'Sirkeci' },
  ],
  '34-sariyer': [
    { value: 'istinye', label: 'Istinye' },
    { value: 'tarabya', label: 'Tarabya' },
  ],
  '06-cankaya': [
    { value: 'kizilay', label: 'Kizilay' },
    { value: 'bahcelievler06', label: 'Bahcelievler' },
  ],
  '06-kecioren': [
    { value: 'etlik', label: 'Etlik' },
    { value: 'ovacik', label: 'Ovacik' },
  ],
  '06-mamak': [
    { value: 'abidinpasa', label: 'Abidinpasa' },
    { value: 'natoyolu', label: 'Natoyolu' },
  ],
  '06-yenimahalle': [
    { value: 'batikent', label: 'Batikent' },
    { value: 'demetevler', label: 'Demetevler' },
  ],
  '35-konak': [
    { value: 'alsancak', label: 'Alsancak' },
    { value: 'basmane', label: 'Basmane' },
  ],
  '35-karsiyaka': [
    { value: 'bostanli', label: 'Bostanli' },
    { value: 'cigli', label: 'Cigli' },
  ],
  '35-bornova': [
    { value: 'evka3', label: 'Evka-3' },
    { value: 'kazimdirik', label: 'Kazimdirik' },
  ],
  '07-muratpasa': [
    { value: 'lara', label: 'Lara' },
    { value: 'kaleici', label: 'Kaleici' },
  ],
  '07-konyaalti': [
    { value: 'hurma', label: 'Hurma' },
    { value: 'liman', label: 'Liman' },
  ],
  '07-kepez': [
    { value: 'varsak', label: 'Varsak' },
    { value: 'santral', label: 'Santral' },
  ],
  '07-alanya': [
    { value: 'oba', label: 'Oba' },
    { value: 'tosmur', label: 'Tosmur' },
    { value: 'kestel', label: 'Kestel' },
  ],
  '16-osmangazi': [
    { value: 'cekirge', label: 'Cekirge' },
    { value: 'hamitler', label: 'Hamitler' },
  ],
  '16-nilufer': [
    { value: 'gorukle', label: 'Gorukle' },
    { value: 'ozluce', label: 'Ozluce' },
  ],
  '16-yildirim': [
    { value: 'ertugrulgazi', label: 'Ertugrulgazi' },
    { value: 'yildirimbeyazit', label: 'Yildirim Beyazit' },
  ],
}

// ---------------------------------------------------------------------------
// 2-Level: Kategori -> Alt Kategori
// ---------------------------------------------------------------------------

const KATEGORILER: SelectOption[] = [
  { value: 'konut', label: 'Konut' },
  { value: 'arsa', label: 'Arsa' },
  { value: 'isyeri', label: 'Isyeri' },
]

const ALT_KATEGORILER: Record<string, SelectOption[]> = {
  konut: [
    { value: 'daire', label: 'Daire' },
    { value: 'villa', label: 'Villa' },
    { value: 'mustakil', label: 'Mustakil Ev' },
    { value: 'residans', label: 'Residans' },
  ],
  arsa: [
    { value: 'imarli', label: 'Imarli Arsa' },
    { value: 'tarla', label: 'Tarla' },
    { value: 'bag-bahce', label: 'Bag / Bahce' },
  ],
  isyeri: [
    { value: 'dukkan', label: 'Dukkan' },
    { value: 'ofis', label: 'Ofis' },
    { value: 'depo', label: 'Depo' },
    { value: 'fabrika', label: 'Fabrika' },
  ],
}

// ---------------------------------------------------------------------------
// Yardimci: async gecikme
// ---------------------------------------------------------------------------

function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'Composites/CascadingSelect',
  component: CascadingSelect,

  tags: ['stable'],

  parameters: {
    docs: {
      description: {
        component:
          'Kademeye bagimli (cascading) secim bileseni. Il -> Ilce -> Mahalle gibi ' +
          'N kademeli bagimli secimler icin tasarlanmistir. Her kademe mevcut Select ' +
          "primitive'ini kullanir; ust kademe degistiginde alt kademelerin secimi " +
          'sifirlanir ve secenekleri yeniden yuklenir.',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'form-control',
      useWhen: [
        'Il/ilce/mahalle gibi bagimli secimler gerektiginde',
        'Kategori/alt kategori hiyerarsik secimlerinde',
      ],
      doNotUseWhen: [
        'Tek seviyeli secim icin — Select kullanin',
        'Coklu secim gerekiyorsa — MultiSelect kullanin',
      ],
    },
  },

  args: {
    levels: [],
    size: 'md',
    disabled: false,
    onValueChange: fn(),
  },

  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof CascadingSelect>

export default meta

type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** 3 kademeli Turkiye konum secimi: Il -> Ilce -> Mahalle (statik veri). */
export const IlIlceMahalle: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<(string | undefined)[]>([
      undefined,
      undefined,
      undefined,
    ])

    const levels: CascadingSelectLevel[] = [
      { label: 'Il', placeholder: 'Il secin', options: ILLER },
      {
        label: 'Ilce',
        placeholder: 'Ilce secin',
        options: (parentValue: string) =>
          Promise.resolve(ILCELER[parentValue] ?? []),
      },
      {
        label: 'Mahalle',
        placeholder: 'Mahalle secin',
        options: (parentValue: string) =>
          Promise.resolve(MAHALLELER[parentValue] ?? []),
      },
    ]

    return (
      <div>
        <CascadingSelect
          {...args}
          levels={levels}
          value={value}
          onValueChange={(v, level) => {
            setValue(v)
            args.onValueChange?.(v, level)
          }}
        />
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Secili: {JSON.stringify(value)}
        </p>
      </div>
    )
  },
}

/** Async yukleme: her kademe gecikme ile yuklenir, spinner gorulur. */
export const AsyncLoading: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<(string | undefined)[]>([
      undefined,
      undefined,
      undefined,
    ])

    const levels: CascadingSelectLevel[] = [
      { label: 'Il', placeholder: 'Il secin', options: ILLER },
      {
        label: 'Ilce',
        placeholder: 'Ilce secin',
        options: (parentValue: string) =>
          delay(1200, ILCELER[parentValue] ?? []),
      },
      {
        label: 'Mahalle',
        placeholder: 'Mahalle secin',
        options: (parentValue: string) =>
          delay(800, MAHALLELER[parentValue] ?? []),
      },
    ]

    return (
      <CascadingSelect
        {...args}
        levels={levels}
        value={value}
        onValueChange={(v, level) => {
          setValue(v)
          args.onValueChange?.(v, level)
        }}
      />
    )
  },
}

/** 2 kademeli: Kategori -> Alt Kategori. */
export const TwoLevel: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<(string | undefined)[]>([
      undefined,
      undefined,
    ])

    const levels: CascadingSelectLevel[] = [
      { label: 'Kategori', placeholder: 'Kategori secin', options: KATEGORILER },
      {
        label: 'Alt Kategori',
        placeholder: 'Alt kategori secin',
        options: (parentValue: string) =>
          Promise.resolve(ALT_KATEGORILER[parentValue] ?? []),
      },
    ]

    return (
      <CascadingSelect
        {...args}
        levels={levels}
        value={value}
        onValueChange={(v, level) => {
          setValue(v)
          args.onValueChange?.(v, level)
        }}
      />
    )
  },
}

/** Farkli kademelerde dogrulama hatalari. */
export const WithValidation: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<(string | undefined)[]>([
      '34',
      undefined,
      undefined,
    ])

    const levels: CascadingSelectLevel[] = [
      {
        label: 'Il',
        placeholder: 'Il secin',
        options: ILLER,
        helperText: 'Turkiye genelinde secim yapabilirsiniz',
      },
      {
        label: 'Ilce',
        placeholder: 'Ilce secin',
        options: (parentValue: string) =>
          Promise.resolve(ILCELER[parentValue] ?? []),
        error: 'Ilce secimi zorunludur',
      },
      {
        label: 'Mahalle',
        placeholder: 'Mahalle secin',
        options: (parentValue: string) =>
          Promise.resolve(MAHALLELER[parentValue] ?? []),
        error: 'Mahalle secimi zorunludur',
      },
    ]

    return (
      <CascadingSelect
        {...args}
        levels={levels}
        value={value}
        onValueChange={(v, level) => {
          setValue(v)
          args.onValueChange?.(v, level)
        }}
      />
    )
  },
}

/** Tam kontrol: dis durum yonetimi ile. */
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<(string | undefined)[]>([
      '06',
      '06-cankaya',
      'kizilay',
    ])

    const levels: CascadingSelectLevel[] = [
      { label: 'Il', placeholder: 'Il secin', options: ILLER },
      {
        label: 'Ilce',
        placeholder: 'Ilce secin',
        options: (parentValue: string) =>
          Promise.resolve(ILCELER[parentValue] ?? []),
      },
      {
        label: 'Mahalle',
        placeholder: 'Mahalle secin',
        options: (parentValue: string) =>
          Promise.resolve(MAHALLELER[parentValue] ?? []),
      },
    ]

    return (
      <div>
        <CascadingSelect
          {...args}
          levels={levels}
          value={value}
          onValueChange={(v, level) => {
            setValue(v)
            args.onValueChange?.(v, level)
          }}
        />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setValue(['34', undefined, undefined])}
          >
            Istanbul'a ayarla
          </button>
          <button
            type="button"
            onClick={() => setValue([undefined, undefined, undefined])}
          >
            Sifirla
          </button>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
          Secili: {JSON.stringify(value)}
        </p>
      </div>
    )
  },
}

// ---------------------------------------------------------------------------
// Erisilebirlik testi
// ---------------------------------------------------------------------------

/**
 * Select acilip secim yapilabiliyor mu, alt kademe gunceleniyor mu?
 *
 * Portal'a giden popup body icinde aranir (Select'in kendi test deseniyle ayni).
 */
export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<(string | undefined)[]>([
      undefined,
      undefined,
    ])

    const levels: CascadingSelectLevel[] = [
      { label: 'Kategori', placeholder: 'Kategori secin', options: KATEGORILER },
      {
        label: 'Alt Kategori',
        placeholder: 'Alt kategori secin',
        options: (parentValue: string) =>
          Promise.resolve(ALT_KATEGORILER[parentValue] ?? []),
      },
    ]

    return (
      <CascadingSelect
        {...args}
        levels={levels}
        value={value}
        onValueChange={(v, level) => {
          setValue(v)
          args.onValueChange?.(v, level)
        }}
      />
    )
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const body = within(document.body)

    // Ilk kademe: Kategori secimi
    const triggers = canvas.getAllByRole('combobox')
    const firstTrigger = triggers[0]
    if (firstTrigger === undefined) throw new Error('No combobox found')
    await userEvent.click(firstTrigger)

    const konutOption = await body.findByRole('option', { name: /Konut/ })
    await userEvent.click(konutOption)

    // Popup kapanmasini bekle
    await waitFor(() =>
      expect(
        document.querySelector('[data-base-ui-focus-guard]'),
      ).not.toBeInTheDocument(),
    )

    // Ikinci kademe artik etkin olmali — secenekler yuklenmis olmali
    await waitFor(() => {
      const secondTriggers = canvas.getAllByRole('combobox')
      const secondTrigger = secondTriggers[1]
      if (secondTrigger === undefined) throw new Error('Second combobox not found')
      expect(secondTrigger).not.toHaveAttribute('data-disabled')
    })
  },
}
