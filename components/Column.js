import { Draggable, Droppable } from "react-beautiful-dnd"
import TodoCard from "./TodoCard"
import { PlusCircleIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { useBoardStore } from "@/store/BoardStore"
import { useAddModalStore } from "@/store/AddModalStore"

const idToColumnText = {
  'todo': 'To Do',
  'inprogress': 'In Progress',
  'done': 'Done'
}

export default function Column({ id, todos, index }) {
  const [filteredTodos, setFilteredTodos] = useState(todos)
  const [searchString, setColumnIdSelected, columnIdSelected] = useBoardStore((state) => [
    state.searchString,
    state.setColumnIdSelected,
    state.columnIdSelected
  ])
  const openModal = useAddModalStore((state) => state.openModal)

  useEffect(() => {
    if (searchString.length > 0) {
      const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchString.toLowerCase())
      )
      setFilteredTodos(filteredTodos)
    } else {
      setFilteredTodos(todos)
    }
  }, [searchString, todos])

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* Render droppable todos in the column */}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? 'bg-green-200' : 'bg-white/50'
                }`}
              >
                <h2 className="w-full flex justify-between items-center text-lg font-bold px-2 pt-2 pb-3">
                  {idToColumnText[id]}
                  <span className="flex justify-center items-center px-2 py-1 bg-gray-300/60 text-gray-500 text-xs md:text-sm font-semibold rounded-full">
                    {filteredTodos.length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {filteredTodos.map((todo, index) => (
                    <Draggable
                      key={todo.$id}
                      draggableId={todo.$id}
                      index={index}
                    >
                      {(provided) => (
                        <TodoCard
                          id={id}
                          index={index}
                          todo={todo}
                          innerRef={provided.innerRef}
                          draggableProps={provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          isDraggingOver={snapshot.isDraggingOver}
                        />
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}

                  <div className="flex justify-end items-end p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setColumnIdSelected(id)
                        openModal()
                      }}
                      className="text-green-500/80 hover:text-green-600/80"
                    >
                      <PlusCircleIcon className="w-10 h-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}