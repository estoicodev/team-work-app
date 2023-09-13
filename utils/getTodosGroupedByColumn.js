import { databases } from "@/appwrite.js"

export const getTodosGroupedByColumn = async () => {
  const data = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID
  )
  const { documents: todos } = data

  const columns = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: []
      })      
    }
    acc.get(todo.status)?.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) })
    })

    return acc
  }, new Map())

  const columnTypes = ["todo", "inprogress", "done"]
  for (const colType of columnTypes) {
    if (!columns.get(colType)) {
      columns.set(colType, {
        id: colType,
        todos: []
      })
    }
  }

  const sortedColumns = new Map(
    Array.from(columns.entries()).sort((a, b) => (
    columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
  )))

  const board = {
    columns: sortedColumns
  }

  return board
}
