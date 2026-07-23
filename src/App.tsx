import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { ToastProvider } from './components/composites/ToastProvider/ToastProvider'
import { KeyboardShortcutsProvider } from './components/composites/KeyboardShortcuts/KeyboardShortcuts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

/**
 * Uygulamanin kok bileseni.
 *
 * Saglayici sirasi:
 * 1. QueryClientProvider — veri katmani (henuz mock, Faz 5'te gercek API)
 * 2. ToastProvider — bildirim kuyruklama
 * 3. KeyboardShortcutsProvider — global kisayollar ve yardim paleti
 * 4. RouterProvider — sayfa yonlendirme
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <KeyboardShortcutsProvider>
          <RouterProvider router={router} />
        </KeyboardShortcutsProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}
