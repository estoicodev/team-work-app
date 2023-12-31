"use client"

import { useBoardStore } from "@/store/BoardStore"
import { useEditModalStore } from "@/store/EditModalStore"
import { PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/solid"
import Image from "next/image"

export default function TodoCard({
  id,
  index,
  todo,
  innerRef,
  draggableProps,
  dragHandleProps,
  isDraggingOver
}) {
  const [deleteTodoInBoardAndDB, setColumnIdSelected] = useBoardStore(state => [
    state.deleteTodoInBoardAndDB,
    state.setColumnIdSelected,
  ])
  const [openModal, setTitleTodo, setIdTodo, setStatusTodo, setColumnIdSrc] = useEditModalStore(state => [
    state.openModal,
    state.setTitleTodo,
    state.setIdTodo,
    state.setStatusTodo,
    state.setColumnIdSrc
  ])

  const handleEdit = (todo) => {
    setStatusTodo(id)
    setTitleTodo(todo.title)
    setIdTodo(todo.$id)
    setColumnIdSelected(todo.id)
    openModal()
    setColumnIdSrc("")
  }

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className={`rounded-md drop-shadow-md space-y-3 bg-white hover:bg-white/80 ${
        isDraggingOver ? 'bg-white/80' : 'bg-white'}`}
    >
      <div className="flex justify-between items-center pl-5 pr-4 py-4">
        <p className="text-base">{todo.title}</p>
        <div className="flex items-center space-x-2">
          <button onClick={() => handleEdit(todo)} className="p-1 group">
            <PencilSquareIcon
              className="w-[22px] h-[22px] inline-block relative -top-0.5 text-gray-500 group-hover:text-gray-600"
            />
          </button>
          <button onClick={() => deleteTodoInBoardAndDB(id, index)}>
            <XCircleIcon
              className="w-[30px] h-[30px] inline-block text-red-500 hover:text-red-600"
            />
          </button>
        </div>
      </div>
      {
        todo.image && (
          <Image
            width={200}
            height={200}
            className="w-full h-44 object-cover filter hover:grayscale hover:scale-95 cursor-not-allowed transition-all duration-150"
            alt={todo.title}
            src={todo.image}
          />
        )
      }
    </div>
  )
}
