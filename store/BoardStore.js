import { databases, storage } from '@/appwrite'
import { getTodosGroupedByColumn } from '@/utils/getTodosGroupedByColumn.js'
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { useEditModalStore } from './EditModalStore'
import uploadImage from '@/utils/uploadImage'
import getUrl from '@/utils/getUrl'

export const useBoardStore = create((set) => ({
  board: {
    columns: new Map()
  },
  newTaskInput: "",
  columnIdSelected: "",
  image: null,
  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
  setNewTaskInput: (newTaskInput) => set({ newTaskInput }),
  setColumnIdSelected: (columnIdSelected) => set({ columnIdSelected }),
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
  setImage: (image) => set({ image }),
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
  deleteTodoInBoardAndDB: async (id, index) => {
    const board = useBoardStore.getState().board
    const column = board.columns.get(id)
    const [deleted] = column.todos.splice(index, 1)
    board.columns.set(id, column)
    set({ board })
    
    // Delete in DB
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
      deleted.$id
    )

    // Delete image from storage if exists
    if (deleted.image) {
      await storage.deleteFile(deleted.bucketId, deleted.fileId)
    }
  },
  addTodoToBoardAndDB: async (todo) => {
    const board = useBoardStore.getState().board
    const column = board.columns.get(useBoardStore.getState().columnIdSelected)

    let file
    // Add image in storage if exists
    if (todo.image) {
      const fileUploaded = await uploadImage(todo.image)

      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id
        }
      }
    }

    // Add todo in DB
    const addedTodo = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
      uuidv4(),
      {
        title: todo.title,
        status: todo.status,
        ...(file && { image: getUrl(file.bucketId, file.fileId) }),
      }
    )

    addedTodo.bucketId = file?.bucketId || null
    addedTodo.fileId = file?.fileId || null

    column.todos.push(addedTodo)
    board.columns.set(addedTodo.status, column)
    set({ board })

    return { board }
  },
  updateTodoToBoardAndDB: async (todo) => {
    const board = useBoardStore.getState().board
    const statusSrc = useEditModalStore.getState().columnIdSrc || todo.status
    const columnSrc = board.columns.get(statusSrc)
    const columnDest = board.columns.get(todo.status)

    let file
    // Add image in storage if exists
    if (todo.image) {
      const fileUploaded = await uploadImage(todo.image)

      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id
        }
      }
    }

    // Handle ui update
    const indexSrc = columnSrc.todos.findIndex((t) => t.$id === todo.$id)
    if (columnSrc && columnSrc === columnDest) {
      columnSrc.todos[indexSrc].title = todo.title
      columnSrc.todos[indexSrc].image = file ? getUrl(file.bucketId, file.fileId) : null
      board.columns.get(todo.status).todos = columnSrc.todos
    } else {
      columnSrc.todos.splice(indexSrc, 1)
      columnDest.todos.push({
        ...todo,
        ...(file && { image: getUrl(file.bucketId, file.fileId) }),
      })
      board.columns.get(statusSrc).todos = columnSrc.todos
      board.columns.get(todo.status).todos = columnDest.todos
    }

    // Update todo in DB
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
      todo.$id,
      {
        title: todo.title,
        status: todo.status,
        ...(file && { image: getUrl(file.bucketId, file.fileId) }),
      }
    )

    set({ board })
    return { board }
  },
}))
