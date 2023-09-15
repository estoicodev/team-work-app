import { create } from 'zustand'

export const useEditModalStore = create((set) => ({
  isOpen: false,
  titleTodo: "",
  $idTodo: "",
  columnIdSrc: "",
  openModal: () => set({ isOpen: true }),
  closeModal: () => {
    set({ isOpen: false })
  },
  setTitleTodo: (title) => set({ titleTodo: title }),
  setStatusTodo: (status) => set({ statusTodo: status }),
  setIdTodo: (id) => set({ $idTodo: id }),
  setColumnIdSrc: (columnId) => set({ columnIdSrc: columnId }),
}))