"use client"

import { useBoardStore } from '@/store/BoardStore'
import { useEditModalStore } from '@/store/EditModalStore'
import Column from '@/components/Column.js'
import { useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

export default function Board() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
    state.updateTodoInDB
  ])
  const [setStatusTodo] = useEditModalStore(state => [
    state.setStatusTodo
  ])

  useEffect(() => {
    getBoard()
  }, [getBoard])

  const handleOnDragEnd = (result) => {
    const { destination, source, type } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && 
      destination.index === source.index) return

    const entries = Array.from(board.columns.entries())
    if (type === "column") {
      const [movedTodo] = entries.splice(source.index, 1)
      entries.splice(destination.index, 0, movedTodo)
    } else if (type === "card") {
      const destColId = entries[+destination.droppableId][0]
      let updatedTodo
      if (source.droppableId === destination.droppableId) {
        const { todos } = entries[+source.droppableId][1]

        const [movedTodo] = todos.splice(source.index, 1)
        todos.splice(destination.index, 0, movedTodo)
        updatedTodo = movedTodo
      } else {
        const { todos: sourceTodos } = entries[+source.droppableId][1]
        const { todos: destTodos } = entries[+destination.droppableId][1]
        const [movedTodo] = sourceTodos.splice(source.index, 1)
        destTodos.splice(destination.index, 0, movedTodo)
        updatedTodo = movedTodo
        setStatusTodo(destColId)
        }
      // Update todo in DB
      updateTodoInDB(updatedTodo, destColId)
    }

    const newColumns = new Map(entries)
    setBoardState(newColumns)

  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto p-5 flex-1"
          >
            {
              Array.from(board.columns.entries()).map(([id, column], index) => (
                <Column
                  key={id}
                  id={id}
                  todos={column.todos}
                  index={index}
                />
              ))
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}