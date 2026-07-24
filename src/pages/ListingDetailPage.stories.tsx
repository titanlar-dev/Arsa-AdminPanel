import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router'
import { ListingDetailPage } from './ListingDetailPage'

const meta = {
  title: 'Pages/ListingDetailPage',
  component: ListingDetailPage,
} satisfies Meta<typeof ListingDetailPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
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
