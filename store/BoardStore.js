import { databases } from '@/appwrite'
import { getTodosGroupedByColumn } from '@/utils/getTodosGroupedByColumn.js'
import { create } from 'zustand'

export const useBoardStore = create((set) => ({
  board: {
    columns: new Map()
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn()
    set({ board })
  },
  setBoardState: (newColumns) => {
    const board = {
      columns: newColumns
    }
    set({ board })
  },
  updateTodoInDB: async (todo, columnId) => {
    const data = await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
      todo.$id,
      {
        title: todo.title,
        status: columnId
      }
    )
    return data
  },

  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
}))
