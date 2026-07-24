import { createHashRouter, RouterProvider } from 'react-router'
import { AdminLayout } from './layouts/AdminLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ListingsPage } from './pages/ListingsPage'
import { ModerationPage } from './pages/ModerationPage'
import { UsersPage } from './pages/UsersPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPageWrapper } from './pages/SettingsPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ListingDetailPage } from './pages/ListingDetailPage'
import { ListingEditPage } from './pages/ListingEditPage'

/**
 * Panel rotalarini tanimlayan browser router.
 *
 * `createBrowserRouter` react-router v8'in veri yonlendirme API'si:
 * loader/action destegi, lazy route'lar ve gelecekte SSR uyumlulugu saglar.
 *
 * Kimlik dogrulamanin olmadigi bu asamada `/login` kabuk disinda,
 * diger tum rotalar `AdminLayout` icinde render edilir.
 */
const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'listings',
        element: <ListingsPage />,
      },
      {
        path: 'listings/:id',
        element: <ListingDetailPage />,
      },
      {
        path: 'listings/:id/edit',
        element: <ListingEditPage />,
      },
      {
        path: 'moderation',
        element: <ModerationPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'users/:id',
        element: <PlaceholderPage title="Kullanici Detayi" />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'categories',
        element: <PlaceholderPage title="Kategori Oznitelikleri" />,
      },
      {
        path: 'locations',
        element: <PlaceholderPage title="Konum Yonetimi" />,
      },
      {
        path: 'pricing',
        element: <PlaceholderPage title="Fiyatlandirma ve Promosyonlar" />,
      },
      {
        path: 'verification',
        element: <PlaceholderPage title="Satici Dogrulama" />,
      },
      {
        path: 'import',
        element: <PlaceholderPage title="Toplu Icerik Aktarimi" />,
      },
      {
        path: 'audit-log',
        element: <PlaceholderPage title="Islem Gecmisi" />,
      },
      {
        path: 'settings',
        element: <SettingsPageWrapper />,
      },
    ],
  },
])

export { router, RouterProvider }
