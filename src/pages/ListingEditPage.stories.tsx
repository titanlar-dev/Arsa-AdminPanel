import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router'
import { ListingEditPage } from './ListingEditPage'

const meta = {
  title: 'Pages/ListingEditPage',
  component: ListingEditPage,
} satisfies Meta<typeof ListingEditPage>

export default meta
type Story = StoryObj<typeof meta>

/** Editing a konut (residential) listing - lst-001. All tabs visible, Tab 3 shows konut fields. */
export const EditResidential: Story = {
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

/** Editing an arsa (land) listing - lst-009. Tab 3 shows arsa fields. */
export const EditLand: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/listings/lst-009/edit']}>
        <Routes>
          <Route path="/listings/:id/edit" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
}

/** Create mode - empty form, no pre-filled data. */
export const CreateNew: Story = {
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

/** Photos tab active (Tab 4), showing the photo grid for lst-001. */
export const PhotosTab: Story = {
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
