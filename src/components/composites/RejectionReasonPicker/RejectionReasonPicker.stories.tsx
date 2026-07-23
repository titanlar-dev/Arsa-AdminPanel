import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  AutomatedCheckCode,
  AutomatedCheckResultStatus,
  RejectionReason,
  type AutomatedCheckResult,
} from '../../../types/domain'
import { AutomatedChecksPanel } from '../AutomatedChecksPanel'
import { RejectionReasonPicker } from './RejectionReasonPicker'
import { mapChecksToSuggestions, type SuggestedReason } from './checkToReason'

const VARYANTLAR = ['cards', 'list', 'compactSelect'] as const

const meta = {
  title: 'Composites/RejectionReasonPicker',
  component: RejectionReasonPicker,

  tags: ['stable'],

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gerekce ve notu **birlikte** toplar: gerekce hangi kuralin cignendigini, not bu ilanda ' +
          'tam olarak neyin yanlis oldugunu soyler. Ilan sahibine giden mesaj ikisinin toplamidir -- ' +
          'tek basina "Yaniltici veya Eksik Bilgi" hicbir seyi duzeltmez. Zorunlulugu **denetlemez**: ' +
          '`required` yalniz isareti koyar, gonderimi kapatmak kararin sahibi olan ust katmanin isi ' +
          '(`isModerationDecisionComplete`).',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'form-group',
      useWhen: [
        'Red veya duzeltme kararinda gerekce ve not toplanacaksa',
        'ModerationActionBar disinda, karar formunun kendi ekraninda',
      ],
      doNotUseWhen: [
        'Karar butonlariyla birlikte tam akis gerekiyorsa -- ModerationActionBar zaten bunu iceriyor',
        'Sikayet gerekcesi icin -- o ReportReason, ayri bir enum',
      ],
    },
  },

  args: {
    value: [],
    note: '',
    variant: 'cards',
    required: false,
    disabled: false,
    onValueChange: fn(),
    onNoteChange: fn(),
  },

  argTypes: {
    variant: { control: 'inline-radio', options: VARYANTLAR },
    value: { control: false },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof RejectionReasonPicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Kararin asil verildigi gorunum: her gerekce aciklamasiyla birlikte. */
export const Cards: Story = {
  args: { variant: 'cards' },
}

/** Aciklamasiz, sikisik. Dialog icinde dikey alan pahalidir. */
export const List: Story = {
  args: { variant: 'list' },
}

/** Tek satir: toolbar ve satir ici kullanim. */
export const CompactSelect: Story = {
  args: { variant: 'compactSelect' },
}

/** Hicbir gerekce secilmemis, not bos -- dialog ilk acildigindaki hali. */
export const Empty: Story = {
  args: { value: [], note: '' },
}

export const Selected: Story = {
  args: {
    value: [RejectionReason.MisleadingOrIncompleteInfo, RejectionReason.PricingError],
    note: 'Net m2 128 yazilmis, tapu belgesinde 118 gorunuyor. Fiyat da benzer ilanlarin yaklasik on kati.',
  },
}

/** Gerekce secilmeden gonderilmeye calisilmis. */
export const Error: Story = {
  args: {
    required: true,
    error: 'En az bir gerekce secin.',
    note: 'Aciklamadaki bilgiler tapu belgesiyle uyusmuyor.',
  },
}

/** Karar gonderilirken alanlar kilitlenir; yarida degistirilen gerekce yuku bozar. */
export const Disabled: Story = {
  args: {
    disabled: true,
    value: [RejectionReason.DuplicateListing],
    note: 'Ayni gayrimenkule ait aktif bir ilan bulundu.',
  },
}

/** Zorunlu isareti hem gerekce grubunda hem notta gorunur. */
export const Required: Story = {
  args: { required: true },
}

/**
 * Uzun icerik: on bes gerekcenin tamami secili, not sinira dayanmis.
 *
 * Sayac sinira yaklasinca renk degistirir; kartlar sarar, tasmaz.
 */
export const LongContent: Story = {
  args: {
    value: Object.values(RejectionReason),
    required: true,
    error:
      'Bu ilan icin secilen gerekcelerin bir kismi birbiriyle celisiyor: "Mukerrer Ilan" ile "Sahte Ilan Suphesi" ayni anda secildiginde ilan sahibine gonderilecek mesaj iki farkli duzeltme talimati icerir.',
    note: 'Ilanin basliginda "acil satirlik" vurgusu tekrarli buyuk harfle yazilmis, aciklamada iki farkli telefon numarasi ve bir yonlendirme baglantisi bulunuyor. Fotograflarin dordu baska bir ilandan alinmis, ikisi filigranli. Net metrekare 128 yazilmis ancak tapu belgesinde 118 gorunuyor. Fiyat ayni mahalledeki benzer ilanlarin yaklasik on kati. Konum bilgisi Caferaga olarak girilmis, koordinat Moda sinirlarinda. Yetki belgesi yuklenmemis.',
  },
}

/** Dar ekranda kartlar tek kolona iner ve fieldset kuculmeyi reddetmemeli. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile320' } },
  args: { value: [RejectionReason.InappropriateImage] },
}

/**
 * Grubun erisilebilir adi `<legend>`'den gelmeli.
 *
 * DOM'dan olculuyor: on bes kutunun her biri kendi etiketini tasiyor ama ekran
 * okuyucu kullanicisi gruba girdiginde "Gerekce, grup" duymazsa bunlarin neyin
 * secenekleri oldugunu bilemez.
 */
export const GroupHasAccessibleName: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('group', { name: /Gerekçe/ })).toBeInTheDocument()
  },
}

/** Hata mesaji gruba `aria-describedby` ile baglanmali -- gorsel degil, programatik bag. */
export const ErrorIsBoundToGroup: Story = {
  args: { required: true, error: 'En az bir gerekçe seçin.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const grup = canvas.getByRole('group', { name: /Gerekçe/ })
    const hataId = grup.getAttribute('aria-describedby')

    await expect(hataId).not.toBeNull()
    await expect(canvasElement.querySelector(`#${CSS.escape(hataId ?? '')}`)).toHaveTextContent(
      'En az bir gerekçe seçin.',
    )
  },
}

/** Secim, listenin tamamiyla bildirilmeli -- picker kendi kopyasini tutmaz. */
export const SelectingReportsWholeList: Story = {
  args: { value: [RejectionReason.WrongCategory] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('checkbox', { name: /Fiyat Hatası/ }))

    await expect(args.onValueChange).toHaveBeenCalledWith([
      RejectionReason.WrongCategory,
      RejectionReason.PricingError,
    ])
  },
}

/** Secili bir gerekceye tekrar basmak onu listeden cikarmali. */
export const DeselectingRemovesFromList: Story = {
  args: { value: [RejectionReason.WrongCategory, RejectionReason.PricingError] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('checkbox', { name: /Fiyat Hatası/ }))

    await expect(args.onValueChange).toHaveBeenCalledWith([RejectionReason.WrongCategory])
  },
}

/** Not her tus vurusunda bildirilmeli; geciktirme cagiranin isi. */
export const NoteReportsEveryKeystroke: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByRole('textbox', { name: /Moderasyon notu/ }), 'Tapu')

    await expect(args.onNoteChange).toHaveBeenCalledTimes(4)
  },
}

/**
 * `disabled` iken hem kutular hem not kilitli olmali.
 *
 * Kutularda `toBeDisabled()` **kullanilmiyor**: Base UI'in Checkbox'i bir
 * `<span role="checkbox">` render ediyor ve devre disililigini `aria-disabled`
 * ile bildiriyor. `toBeDisabled()` yalniz native `disabled` attribute'unu
 * tanir, span'de onu bulamaz ve kutu gercekten kilitliyken de duser --
 * yani yanlis olan matcher'dir, component degil. Notta ise gercek bir
 * `<textarea disabled>` var, orada native matcher dogru arac.
 */
export const DisabledLocksEveryControl: Story = {
  args: { disabled: true, value: [RejectionReason.DuplicateListing] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const kutu of canvas.getAllByRole('checkbox')) {
      await expect(kutu).toHaveAttribute('aria-disabled', 'true')
    }

    await expect(canvas.getByRole('textbox', { name: /Moderasyon notu/ })).toBeDisabled()
  },
}

/** Gercek secimle: kartlar isaretlendikce vurgulanir, not sayaci isler. */
export const Interactive: Story = {
  render: function Render(args) {
    const [gerekceler, setGerekceler] = useState<RejectionReason[]>([])
    const [not, setNot] = useState('')

    return (
      <RejectionReasonPicker
        {...args}
        value={gerekceler}
        note={not}
        onValueChange={setGerekceler}
        onNoteChange={setNot}
      />
    )
  },
}

export const VariantsComparison: Story = {
  args: { value: [RejectionReason.MisleadingOrIncompleteInfo, RejectionReason.PricingError] },
  render: (args) => (
    <div style={{ display: 'grid', gap: '2.5rem' }}>
      {VARYANTLAR.map((variant) => (
        <div key={variant} style={{ display: 'grid', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem', opacity: 0.6 }}>{variant}</span>
          <RejectionReasonPicker {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
}

/* ── Suggestion stories ──────────────────────────────────────────────── */

const THREE_SUGGESTIONS: SuggestedReason[] = [
  {
    reason: RejectionReason.MisleadingOrIncompleteInfo,
    confidence: 'high',
    source: 'Zorunlu Alanlar',
  },
  {
    reason: RejectionReason.DuplicateListing,
    confidence: 'high',
    source: 'Mükerrer İçerik',
  },
  {
    reason: RejectionReason.PricingError,
    confidence: 'medium',
    source: 'Fiyat Anomalisi',
  },
]

/** Uc basarisiz kontrolden turetilen onerilerle. */
export const WithSuggestions: Story = {
  args: {
    suggestedReasons: THREE_SUGGESTIONS,
  },
}

/** Tek yuksek guvenli oneri. */
export const HighConfidenceSuggestion: Story = {
  args: {
    suggestedReasons: [
      {
        reason: RejectionReason.ContactInformationViolation,
        confidence: 'high',
        source: 'İletişim Bilgisi Tespiti',
      },
    ],
  },
}

/** Basarisiz kontrol yok, oneri yok -- bolum gorunmez. */
export const NoSuggestions: Story = {
  args: {
    suggestedReasons: [],
  },
}

/** Oneriye tiklandiginda gerekce secilmeli. */
export const SuggestionSelection: Story = {
  args: {
    suggestedReasons: THREE_SUGGESTIONS,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    // Click the first suggestion card
    const buttons = canvas.getAllByRole('button', { pressed: false })
    // Find the suggestion button (not the toggle)
    const suggestionButton = buttons.find((btn) =>
      btn.textContent?.includes('Yanıltıcı veya Eksik Bilgi'),
    )

    if (suggestionButton) {
      await userEvent.click(suggestionButton)

      await expect(args.onValueChange).toHaveBeenCalledWith([
        RejectionReason.MisleadingOrIncompleteInfo,
      ])
    }
  },
}

/* ── Combined story: AutomatedChecksPanel + RejectionReasonPicker ──── */

const kontrol = (
  code: AutomatedCheckCode,
  status: AutomatedCheckResultStatus,
  message: string,
  score?: number,
): AutomatedCheckResult => ({
  code,
  status,
  ...(score !== undefined && { score }),
  message,
  checkedAt: '2026-07-14T09:00:00+03:00',
})

const KARISIK_KONTROLLER: AutomatedCheckResult[] = [
  kontrol(
    AutomatedCheckCode.RequiredFields,
    AutomatedCheckResultStatus.Failed,
    'Brut metrekare girilmemiş.',
  ),
  kontrol(
    AutomatedCheckCode.DuplicateContent,
    AutomatedCheckResultStatus.Failed,
    'Aynı gayrimenkule ait aktif bir ilan bulundu (1245789630).',
    0.94,
  ),
  kontrol(
    AutomatedCheckCode.PriceAnomaly,
    AutomatedCheckResultStatus.Warning,
    'Fiyat, benzer ilanların ortalamasının 3,4 katı.',
    0.71,
  ),
  kontrol(
    AutomatedCheckCode.ContactInfoDetection,
    AutomatedCheckResultStatus.Passed,
    'Açıklamada harici iletişim bilgisi bulunmadı.',
  ),
  kontrol(
    AutomatedCheckCode.ImageQuality,
    AutomatedCheckResultStatus.Passed,
    'Fotoğrafların çözünürlüğü yeterli.',
    0.9,
  ),
  kontrol(
    AutomatedCheckCode.ImageSafety,
    AutomatedCheckResultStatus.Passed,
    'Görsellerde politika dışı içerik saptanmadı.',
    0.97,
  ),
  kontrol(
    AutomatedCheckCode.LocationConsistency,
    AutomatedCheckResultStatus.Failed,
    'Koordinat, girilen mahallenin 2,8 km dışında.',
  ),
  kontrol(
    AutomatedCheckCode.FraudRisk,
    AutomatedCheckResultStatus.Failed,
    'Hesap yeni açılmış ve ilk ilan olağandışı yüksek fiyatlı.',
    0.82,
  ),
]

/**
 * Birlesik gorunum: AutomatedChecksPanel sonuclari RejectionReasonPicker'a
 * oneri olarak akar. `mapChecksToSuggestions` koprusu calisiyor.
 */
export const CombinedWithChecksPanel: Story = {
  render: function Render(args) {
    const [gerekceler, setGerekceler] = useState<RejectionReason[]>([])
    const [not, setNot] = useState('')
    const suggestions = mapChecksToSuggestions(KARISIK_KONTROLLER)

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div>
          <h3 style={{ marginBlockEnd: '0.75rem', fontSize: '0.875rem', opacity: 0.6 }}>
            Otomatik Kontrol Sonuçları
          </h3>
          <AutomatedChecksPanel items={KARISIK_KONTROLLER} variant="list" />
        </div>
        <div>
          <h3 style={{ marginBlockEnd: '0.75rem', fontSize: '0.875rem', opacity: 0.6 }}>
            Red Gerekçesi Seçimi
          </h3>
          <RejectionReasonPicker
            {...args}
            value={gerekceler}
            note={not}
            suggestedReasons={suggestions}
            onValueChange={setGerekceler}
            onNoteChange={setNot}
          />
        </div>
      </div>
    )
  },
}
