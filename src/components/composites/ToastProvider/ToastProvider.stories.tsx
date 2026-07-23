import { useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from '../../primitives/Button'
import { ToastProvider, useToast } from './ToastProvider'

/* ------------------------------------------------------------------ */
/*  Helper: her story kendi ToastProvider'ini sarar.                    */
/* ------------------------------------------------------------------ */

function WithProvider({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta = {
  title: 'Composites/ToastProvider',
  component: ToastProvider,

  tags: ['stable'],

  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Birden fazla toast bildirimini kuyrukla yoneten saglayici. Uygulama kokune ' +
          '`<ToastProvider>` sarin, alt bilesenlerden `useToast()` ile toast tetikleyin. ' +
          'Kuyruk en fazla `maxVisible` (varsayilan 5) toast gosterir; tasan bildirimlerde ' +
          'oncelikle eski, tehlike-disi toast\'lar cikarilir. Fareyle uzerine gelindiginde ' +
          'tum zamanlayicilar durur.',
      },
    },
    ai: {
      project: 'admin-panel',
      role: 'notification-manager',
      useWhen: [
        'Toplu islem sonuclarini bildirirken',
        'Moderasyon eylemlerinde birden fazla bildirim gerektiginde',
      ],
      doNotUseWhen: [
        'Tek bir toast yeterliyse — dogrudan Toast primitive kullanin',
      ],
    },
  },

  decorators: [
    (Story) => (
      <div style={{ minHeight: '20rem', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    children: null,
  },
} satisfies Meta<typeof ToastProvider>

export default meta

type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

function BasicUsageDemo() {
  const { toast } = useToast()
  return (
    <Button onClick={() => toast.success('Ilan onaylandi')}>
      Toast goster
    </Button>
  )
}

/** Butona tiklandiginda basarili bir toast goruntulenir. */
export const BasicUsage: Story = {
  render: () => (
    <WithProvider>
      <BasicUsageDemo />
    </WithProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /toast goster/i })
    await userEvent.click(btn)
    const body = within(document.body)
    await expect(await body.findByText('Ilan onaylandi')).toBeInTheDocument()
  },
}

/* ------------------------------------------------------------------ */

function MultipleToastsDemo() {
  const { toast } = useToast()
  const fire = () => {
    toast.success('Ilan onaylandi')
    setTimeout(() => toast.info('Degisiklikler kaydedildi'), 200)
    setTimeout(() => toast.warning('1 ilan atlandi'), 400)
  }
  return <Button onClick={fire}>3 toast gonder</Button>
}

/** Butona tiklandiginda art arda 3 farkli toast goruntulenir. */
export const MultipleToasts: Story = {
  render: () => (
    <WithProvider>
      <MultipleToastsDemo />
    </WithProvider>
  ),
}

/* ------------------------------------------------------------------ */

function ToastTypesDemo() {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <Button variant="secondary" onClick={() => toast.success('Basarili islem')}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast.warning('Dikkat gerekiyor')}>
        Warning
      </Button>
      <Button variant="secondary" onClick={() => toast.danger('Islem basarisiz')}>
        Danger
      </Button>
      <Button variant="secondary" onClick={() => toast.info('Bilgi notu')}>
        Info
      </Button>
    </div>
  )
}

/** Her ton icin ayri bir buton: success, warning, danger, info. */
export const ToastTypes: Story = {
  render: () => (
    <WithProvider>
      <ToastTypesDemo />
    </WithProvider>
  ),
}

/* ------------------------------------------------------------------ */

function QueueOverflowDemo() {
  const { toast } = useToast()
  const counterRef = useRef(0)
  const fire = () => {
    const tones = ['success', 'info', 'warning'] as const
    for (let i = 0; i < 8; i++) {
      counterRef.current += 1
      const n = counterRef.current
      const tone = tones[i % tones.length] ?? 'info'
      setTimeout(() => {
        toast({ title: `Bildirim #${n}`, tone })
      }, i * 150)
    }
  }
  return <Button onClick={fire}>8 toast gonder (max 5 gorunur)</Button>
}

/** 8 toast gonderilir, en fazla 5 tanesi ayni anda gorunur. Eski toast'lar cikarilir. */
export const QueueOverflow: Story = {
  render: () => (
    <WithProvider>
      <QueueOverflowDemo />
    </WithProvider>
  ),
}

/* ------------------------------------------------------------------ */

function WithActionsDemo() {
  const { toast } = useToast()
  return (
    <Button
      onClick={() =>
        toast.success('Ilan arsive tasindi', {
          action: {
            label: 'Geri al',
            onClick: () => {
              toast.info('Islem geri alindi')
            },
          },
        })
      }
    >
      Arsivle (geri al aksiyonu ile)
    </Button>
  )
}

/** Toast icerisinde "Geri al" aksiyonu bulunan bildirim. */
export const WithActions: Story = {
  render: () => (
    <WithProvider>
      <WithActionsDemo />
    </WithProvider>
  ),
}

/* ------------------------------------------------------------------ */

function PauseOnHoverDemo() {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '20rem' }}>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>
        Toast gosterdikten sonra fareyi toast uzerine goturun — zamanlayici durur.
        Fare ayrildiginda geri sayim devam eder.
      </p>
      <Button onClick={() => toast.success('Fareyi uzerime getir (5sn)')}>
        Toast goster
      </Button>
    </div>
  )
}

/**
 * Fareyle toast uzerine gelindiginde otomatik kapanma zamanlayicisi durur.
 * Fare ayrildiginda geri sayim devam eder.
 */
export const PauseOnHover: Story = {
  render: () => (
    <WithProvider>
      <PauseOnHoverDemo />
    </WithProvider>
  ),
}
