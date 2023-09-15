import { create } from 'zustand'

export const useAddModalStore = create((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => {
    set({ isOpen: false })
  },
}))