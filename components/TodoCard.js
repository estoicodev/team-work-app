"use client"

import { XCircleIcon } from "@heroicons/react/24/solid"
import Image from "next/image"

export default function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps
}) {
  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className="rounded-md drop-shadow-md space-y-3 bg-white"
    >
      <div className="flex justify-between items-center px-5 py-4">
        <p className="text-base">{todo.title}</p>
        <button>
          <XCircleIcon className="w-8 h-8 inline-block text-red-500 hover:text-red-600" />
        </button>
      </div>
      {todo.image !== undefined &&
        <Image
          width={250} height={200}
          alt={todo.title} src={todo.image}
          className="w-full h-48 object-cover rounded-b-md "
        />
      }
    </div>
  )
}
