import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router'
import { ListingEditPage } from './ListingEditPage'

const meta = {
  title: 'Pages/ListingEditPage',
  component: ListingEditPage,
} satisfies Meta<typeof ListingEditPage>

export default meta
type Story = StoryObj<typeof meta>

export const EditMode: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/listings/lst-001/edit']}>
        <Routes>
          <Route path="/listings/:id/edit" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
}

export const CreateMode: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/listings/new/edit']}>
        <Routes>
          <Route path="/listings/:id/edit" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
}
