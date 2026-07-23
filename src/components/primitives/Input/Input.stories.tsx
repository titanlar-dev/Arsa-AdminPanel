import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Hash, Search } from 'lucide-react'
import type { ValidationState } from '../../../types/component-props'
import { Input } from './Input'

const meta = {
  title: 'Primitives/Input',
  component: Input,

  tags: ['stable'],

  parameters: {
    docs: {
      description: {
        component:
          'Tek satırlık metin girişi. Etiketsiz kullanmayın — placeholder etiket yerine geçmez, ' +
          'kullanıcı yazmaya başlayınca kaybolur. Erişilebilir bağlantıları Base UI Field kurar.',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'form-control',
      useWhen: ['Serbest metin alınırken', 'İlan no veya başlık aranırken'],
      doNotUseWhen: [
        'Arama kutusu gerekiyorsa — SearchInput kullanın',
        'Sayı alınıyorsa — NumberInput kullanın',
        'Tutar alınıyorsa — CurrencyInput kullanın',
      ],
    },
  },

  args: {
    label: 'İlan başlığı',
    placeholder: 'Örn. Caferağa’da 3+1 daire',
    size: 'md',
    required: false,
    disabled: false,
  },

  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    leadingIcon: { control: false },
    trailingAction: { control: false },
  },

  decorators: [
    (Story) => (
      <div style={{ maxWidth: '22rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Filled: Story = {
  args: { defaultValue: 'Caferağa’da Asansörlü Binada Ferah 3+1 Daire' },
}

export const WithHelperText: Story = {
  args: {
    label: 'İlan no',
    helperText: '10 haneli ilan numarasını girin',
    placeholder: '1245789630',
  },
}

export const Required: Story = {
  args: { required: true, helperText: 'Bu alan zorunludur' },
}

/** Hata varken yardımcı metin gizlenir; ikisi birden okunmaz. */
export const WithError: Story = {
  args: {
    error: 'İlan başlığı en az 10 karakter olmalıdır',
    helperText: 'Bu metin hata varken gizlenir',
    defaultValue: 'Daire',
  },
}

/**
 * Mesajsız geçersiz: kırmızı kenarlık ve `aria-invalid`, ama alanın altında
 * metin **yok**. Giriş ekranı gibi geçersizliğin alan bazında bir cümle
 * üretmediği (hata tek bir üst uyarı olan) yerler için.
 */
export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'abc' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    /*
      Kenarlık DOM'dan ölçülüyor: kırmızıyı çizen kural `&[data-invalid]` ve o
      işaret kutudadır (input'un span atası) — `closest()` ile atayı bulup
      "geçti" demek yerine işaretin gerçekten kutuda olduğunu doğruluyoruz.
    */
    const input = canvas.getByRole('textbox')
    await expect(input).toHaveAttribute('aria-invalid', 'true')

    const kutu = input.closest('[data-invalid]')
    await expect(kutu).not.toBeNull()

    /*
      Mesaj YOK: `invalid` mesajsızdır. Base UI, altta bir Description/Error
      render edilmediği için input'a `aria-describedby` de bağlamaz — "alan
      altında metin yok"un DOM'daki karşılığı budur.
    */
    await expect(input).not.toHaveAttribute('aria-describedby')
  },
}

/**
 * `error` ve `invalid` birlikte verilince **`error` kazanır**: kutu yine
 * kırmızı ama bu kez mesaj da görünür. `invalid`'in "mesajsız" olması onu
 * bastırmaz — öncelik `error`'dadır.
 */
export const ErrorWinsOverInvalid: Story = {
  args: {
    error: 'İlan başlığı en az 10 karakter olmalıdır',
    invalid: true,
    defaultValue: 'Daire',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const input = canvas.getByRole('textbox')
    await expect(input).toHaveAttribute('aria-invalid', 'true')

    const kutu = input.closest('[data-invalid]')
    await expect(kutu).not.toBeNull()

    /* error kazanır: mesaj görünür (invalid tek başına bunu yapmazdı). */
    await expect(canvas.getByText('İlan başlığı en az 10 karakter olmalıdır')).toBeInTheDocument()
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Düzenlenemez' },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: '1245789630', label: 'İlan no (değiştirilemez)' },
}

export const WithLeadingIcon: Story = {
  args: { leadingIcon: <Hash size={16} />, label: 'İlan no', placeholder: '1245789630' },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const VariantsComparison: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <Input {...args} size="sm" label="Kucuk" />
      <Input {...args} size="md" label="Orta" />
      <Input {...args} size="lg" label="Buyuk" />
      <Input {...args} label="Ikonlu" leadingIcon={<Search size={16} />} />
      <Input {...args} label="Zorunlu" required helperText="Zorunlu alan" />
      <Input {...args} label="Hatali" error="Gecersiz deger" defaultValue="abc" />
      <Input {...args} label="Devre disi" disabled defaultValue="Duzenlenemez" />
    </div>
  ),
}

/** Dort dogrulama durumu yan yana: error, warning, success, validating. */
export const ValidationStates: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <Input
        {...args}
        label="Hata (error)"
        error="Ilan basligi en az 10 karakter olmalidir"
        defaultValue="Daire"
      />
      <Input
        {...args}
        label="Uyari (warning)"
        validationState="warning"
        validationMessage="Baslik cok kisa olabilir, SEO icin en az 30 karakter onerilir"
        defaultValue="3+1 daire satilik"
      />
      <Input
        {...args}
        label="Basari (success)"
        validationState="success"
        validationMessage="Ilan numarasi dogrulandi"
        defaultValue="1245789630"
      />
      <Input
        {...args}
        label="Dogrulaniyor (validating)"
        validationState="validating"
        defaultValue="1245789630"
      />
    </div>
  ),
}

/** Asenkron dogrulama simulasyonu: ilan no girilince sunucudan kontrol edilir. */
export const AsyncValidation: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('')
    const [state, setState] = useState<ValidationState | undefined>(undefined)
    const [message, setMessage] = useState<string | undefined>(undefined)

    useEffect(() => {
      if (value.length === 0) {
        setState(undefined)
        setMessage(undefined)
        return
      }
      if (value.length < 10) {
        setState('warning')
        setMessage('Ilan numarasi 10 haneli olmalidir')
        return
      }

      setState('validating')
      setMessage(undefined)

      const timer = setTimeout(() => {
        if (value === '1234567890') {
          setState('error')
          setMessage('Bu ilan numarasi zaten kayitli')
        } else {
          setState('success')
          setMessage('Ilan numarasi kullanilabilir')
        }
      }, 1500)

      return () => clearTimeout(timer)
    }, [value])

    return (
      <Input
        {...args}
        label="Ilan no"
        placeholder="10 haneli ilan numarasini girin"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        {...(state !== undefined && { validationState: state })}
        {...(message !== undefined && { validationMessage: message })}
        helperText="Ornek: 1234567890 (kayitli) veya 9876543210 (bos)"
      />
    )
  },
}

/** Basari durumu: ilan numarasi dogrulandi. */
export const SuccessState: Story = {
  args: {
    label: 'Ilan no',
    defaultValue: '9876543210',
    validationState: 'success',
    validationMessage: 'Ilan numarasi dogrulandi',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Dogrulama mesajinin gorunur oldugunu dogrula
    await expect(canvas.getByText('Ilan numarasi dogrulandi')).toBeInTheDocument()

    // Kutunun data-validation-state attribute'unu dogrula
    const input = canvas.getByRole('textbox')
    const kutu = input.closest('[data-validation-state="success"]')
    await expect(kutu).not.toBeNull()
  },
}

/** `error` prop'u `validationState`'ten onceliklidir. */
export const ErrorOverridesValidationState: Story = {
  args: {
    label: 'Ilan no',
    defaultValue: 'abc',
    error: 'Gecersiz ilan numarasi',
    validationState: 'success',
    validationMessage: 'Bu mesaj gorunmemeli',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // error mesaji gorunmeli
    await expect(canvas.getByText('Gecersiz ilan numarasi')).toBeInTheDocument()

    // validationMessage gorunmemeli
    const successMsg = canvas.queryByText('Bu mesaj gorunmemeli')
    await expect(successMsg).toBeNull()
  },
}

/** Karakter sayaci: maxLength ile sayac gosterilir. */
export const WithCharacterCount: Story = {
  args: {
    label: 'Ilan basligi',
    maxLength: 80,
    defaultValue: 'Caferagada 3+1 Daire',
    helperText: 'Baslik en fazla 80 karakter olabilir',
  },
}

/** Karakter sayaci sinira yaklastiginda uyari rengi alir. */
export const CharacterCountNearLimit: Story = {
  args: {
    label: 'Ilan basligi',
    maxLength: 30,
    defaultValue: 'Bu baslik 30 karaktere cok yak',
  },
}
