import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router'
import { ListingDetailPage } from './ListingDetailPage'

const meta = {
  title: 'Pages/ListingDetailPage',
  component: ListingDetailPage,
} satisfies Meta<typeof ListingDetailPage>

export default meta
type Story = StoryObj<typeof meta>

/** Konut ilani - tum konut alanlarini gosterir (lst-001). */
export const ResidentialListing: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/listings/lst-001']}>
        <Routes>
          <Route path="/listings/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
}

/** Arsa ilani - arsa-ozel alanlari gosterir (lst-009). */
export const LandListing: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/listings/lst-009']}>
        <Routes>
          <Route path="/listings/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
}

/** Isyeri ilani - ticari alanlari gosterir (lst-013). */
export const CommercialListing: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/listings/lst-013']}>
        <Routes>
          <Route path="/listings/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
}

/** Reddedilmis ilan - red gerekceleri ve moderasyon notu (lst-005). */
export const RejectedListing: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/listings/lst-005']}>
        <Routes>
          <Route path="/listings/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
}

/** 404 durumu - bulunamayan ilan. */
export const NotFound: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/listings/nonexistent']}>
        <Routes>
          <Route path="/listings/:id" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
}
