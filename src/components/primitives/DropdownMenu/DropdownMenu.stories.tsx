import { useState } from 'react'
import { Columns3, Download, Trash2 } from 'lucide-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuItem } from './DropdownMenu'

const meta = {
  title: 'Primitives/DropdownMenu',
  component: DropdownMenu,

  tags: ['stable'],

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Base UI `menu` üstüne kurulu genel amaçlı açılır menü. Repoda tetikleyici-butonlu ' +
          'bir dropdown yoktu; DataTable toolbar’ının sütun görünürlük seçicisi için eklendi. ' +
          'Erişilebilir menü davranışı (ok tuşları, Esc, `role="menu"`, `aria-checked`) Base ' +
          'UI’dan gelir. `DropdownMenuCheckboxItem` varsayılan olarak menüyü kapatmaz — birden ' +
          'çok öğe arka arkaya işaretlenebilsin diye.',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'menu',
      useWhen: ['Sütun görünürlük seçici', 'Bir toolbar’da taşan eylemleri toplamak'],
      doNotUseWhen: [
        'Tekli form seçimi — bunun için Select',
        'Sayfa gezinmesi — bunun için bağlantı',
      ],
    },
  },

  // Zorunlu props; render’lı story’ler bunları geçersiz kılar ama tip için gerekli.
  args: {
    trigger: 'Menü',
    children: null,
  },

  decorators: [
    (Story) => (
      <div style={{ minHeight: '18rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

const SUTUNLAR = [
  { id: 'listingNo', label: 'İlan no' },
  { id: 'title', label: 'Başlık' },
  { id: 'price', label: 'Fiyat' },
  { id: 'status', label: 'Durum' },
]

/** `useState` bir isimli component’te olmalı (react-hooks: render fonksiyonunda olamaz). */
function ColumnPickerDemo() {
  const [gizli, setGizli] = useState<string[]>(['status'])
  const gorunur = (id: string) => !gizli.includes(id)
  const toggle = (id: string, next: boolean) =>
    setGizli((onceki) => (next ? onceki.filter((x) => x !== id) : [...onceki, id]))
  // En az bir sütun görünür kalmalı: son görünür sütunun kutusu kilitlenir.
  const gorunurSayisi = SUTUNLAR.filter((s) => gorunur(s.id)).length

  return (
    <DropdownMenu
      label="Sütunları seç"
      trigger={
        <>
          <Columns3 size={16} aria-hidden="true" /> Sütunlar
        </>
      }
    >
      {SUTUNLAR.map((s) => {
        const isVisible = gorunur(s.id)
        return (
          <DropdownMenuCheckboxItem
            key={s.id}
            checked={isVisible}
            disabled={isVisible && gorunurSayisi === 1}
            onCheckedChange={(next) => toggle(s.id, next)}
          >
            {s.label}
          </DropdownMenuCheckboxItem>
        )
      })}
    </DropdownMenu>
  )
}

/** Sütun görünürlük seçici — DataTable toolbar’ının asıl kullanımı. */
export const ColumnPicker: Story = {
  render: () => <ColumnPickerDemo />,
}

/** Eylem menüsü — tıklanınca kapanan `DropdownMenuItem`’lar. */
export const ActionMenu: Story = {
  args: { trigger: 'Eylemler', children: null },
  render: () => (
    <DropdownMenu label="Toplu eylemler" trigger="Eylemler">
      <DropdownMenuItem onSelect={fn()}>
        <Download size={16} aria-hidden="true" /> Dışa aktar
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={fn()} disabled>
        <Trash2 size={16} aria-hidden="true" /> Sil (yetki yok)
      </DropdownMenuItem>
    </DropdownMenu>
  ),
}

/**
 * Menü klavye/işaretleme etkileşimi: tetikleyici açılır, checkbox öğe
 * `aria-checked` taşır ve tıklayınca değeri döner, menü açık kalır.
 */
export const OpensAndTogglesChecked: Story = {
  ...ColumnPicker,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Sütunları seç' })

    await step('Menü açılır', async () => {
      await userEvent.click(trigger)
      // Base UI portalı body’ye render eder; canvas değil body’de aranır.
      await waitFor(() => expect(within(document.body).getByRole('menu')).toBeVisible())
    })

    await step('Görünür sütun işaretli, gizli sütun işaretsiz', async () => {
      const body = within(document.body)
      const fiyat = body.getByRole('menuitemcheckbox', { name: 'Fiyat' })
      const durum = body.getByRole('menuitemcheckbox', { name: 'Durum' })
      await expect(fiyat).toHaveAttribute('aria-checked', 'true')
      await expect(durum).toHaveAttribute('aria-checked', 'false')
    })

    await step('Tıklama değeri çevirir, menü açık kalır', async () => {
      const body = within(document.body)
      await userEvent.click(body.getByRole('menuitemcheckbox', { name: 'Fiyat' }))
      await expect(body.getByRole('menuitemcheckbox', { name: 'Fiyat' })).toHaveAttribute(
        'aria-checked',
        'false',
      )
      await expect(body.getByRole('menu')).toBeVisible()
    })
  },
}
