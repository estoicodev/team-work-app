import { create } from 'zustand'
import { useBoardStore } from './BoardStore'

export const useEditModalStore = create((set) => ({
  isOpen: false,
  titleTodo: "",
  $idTodo: "",
  columnIdSrc: "",
  statusTodo: "",
  openModal: () => {
    set({ isOpen: true })
    useBoardStore.getState().setModalIsOpen(true)
  },
  closeModal: () => {
    set({ isOpen: false })
    useBoardStore.getState().setModalIsOpen(false)
  },
  setTitleTodo: (title) => set({ titleTodo: title }),
  setStatusTodo: (status) => set({ statusTodo: status }),
  setIdTodo: (id) => set({ $idTodo: id }),
  setColumnIdSrc: (columnId) => set({ columnIdSrc: columnId }),
}))