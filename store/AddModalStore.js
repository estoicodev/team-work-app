import { create } from 'zustand'
import { useBoardStore } from './BoardStore'

export const useAddModalStore = create((set) => ({
  isOpen: false,
  openModal: () => {
    set({ isOpen: true })
    useBoardStore.getState().setModalIsOpen(true)
  },
  closeModal: () => {
    set({ isOpen: false })
    useBoardStore.getState().setModalIsOpen(false)
  },
}))