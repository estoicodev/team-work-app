import { databases, storage } from '@/appwrite'
import { getTodosGroupedByColumn } from '@/utils/getTodosGroupedByColumn.js'
import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { useEditModalStore } from './EditModalStore'
import uploadImage from '@/utils/uploadImage'
import getUrl from '@/utils/getUrl'
import getImageIdByUrl from '@/utils/getImageByUrl'

export const useBoardStore = create((set) => ({
  board: {
    columns: new Map()
  },
  newTaskInput: "",
  columnIdSelected: "",
  image: null,
  searchString: "",
  inputSearchFocused: false,
  modalIsOpen: false,
  isShortcutActive: false,
  setIsShortcutActive: (inputSearchFocused) => {
    set({ inputSearchFocused })
  },
  setSearchString: (searchString) => set({ searchString }),
  setInputSearchFocused: (inputSearchFocused) => {
    set({ inputSearchFocused })
  },
  setModalIsOpen: (modalIsOpen) => {
    set({ modalIsOpen })
  },
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
  updateTodoToBoardAndDB: async (todo) => {
    const board = useBoardStore.getState().board
    const statusSrc = useEditModalStore.getState().columnIdSrc
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
    } else {
      // Delete image from storage if exists and no new image to upload
      const todoDB = await databases.getDocument(process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID, todo.$id)
      if (todoDB.image) {
        const imageId = await getImageIdByUrl(todoDB.image)
        // Delete image from storage
        await storage.deleteFile(process.env.NEXT_PUBLIC_TODOS_BUCKET_ID, imageId)
        // Delete imageUrl from todo
        todo.image = null
      }
    }

    // Handle ui update
    const indexSrc = columnSrc?.todos.findIndex((t) => t.$id === todo.$id)
    const indexDest = columnDest?.todos.findIndex((t) => t.$id === todo.$id)
    if (!columnSrc && columnDest) {
      columnDest.todos[indexDest].title = todo.title
      columnDest.todos[indexDest].image = file ? getUrl(file.bucketId, file.fileId) : null
      board.columns.get(todo.status).todos = columnDest.todos
      set({ board })
    } else {
      columnSrc.todos.splice(indexSrc, 1)
      columnDest.todos.push({
        ...todo,
        ...(file && { image: getUrl(file.bucketId, file.fileId) }),
      })
      board.columns.get(statusSrc).todos = columnSrc.todos
      board.columns.get(todo.status).todos = columnDest.todos
      set({ board })
    }

    // Update todo in DB
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID,
      todo.$id,
      {
        title: todo.title,
        status: todo.status,
        image: file ? getUrl(file.bucketId, file.fileId) : null,
      }
    )

    return { board }
  },
}))
