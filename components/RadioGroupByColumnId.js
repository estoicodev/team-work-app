import { useCallback, useEffect, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { useBoardStore } from '@/store/BoardStore'
import { useEditModalStore } from '@/store/EditModalStore'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const types = [
  {
    id: "todo",
    name: 'Por hacer',
    description: 'Una nueva tarea para completar',
    color: 'bg-red-500',
    ringOffsetColor: 'ring-offset-red-300'
  },
  {
    id: "inprogress",
    name: 'En progreso',
    description: 'Una tarea en progreso',
    color: 'bg-yellow-500',
    ringOffsetColor: 'ring-offset-yellow-300'
  },
  {
    id: "done",
    name: 'Hecho',
    description: 'Una tarea completada',
    color: 'bg-green-500',
    ringOffsetColor: 'ring-offset-green-300'
  },
]

export default function RadioGroupByColumnId({ type = "add"}) {
  const [columnIdSelected, setColumnIdSelected] = useBoardStore((state) => [
    state.columnIdSelected,
    state.setColumnIdSelected,
  ])
  const [statusTodo, setStatusTodo, setColumnIdSrc] = useEditModalStore((state) => [
    state.statusTodo,
    state.setStatusTodo,
    state.setColumnIdSrc
  ])
  const columnId = type === "edit" ? statusTodo : columnIdSelected
  const selectedType = types.find(type => type.id === columnId)
  const [selected, setSelected] = useState(selectedType)

  const handleSelectRadio = useCallback((t) => {
    setSelected(t)
    if (type === "edit") {
      setColumnIdSrc(columnId)
      setStatusTodo(t.id)
    } else {
      // setColumnIdSrc(t.id)
      setColumnIdSelected(t.id)
    }
  }, [columnId, setColumnIdSelected, setColumnIdSrc, setStatusTodo, type])

  useEffect(() => {
    const handleKeyPressModal = (e) => {
      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault()
          handleSelectRadio(types[0])
        } else if (e.key === '2') {
          e.preventDefault()
          handleSelectRadio(types[1])
        } else if (e.key === '3') {
          e.preventDefault()
          handleSelectRadio(types[2])
        }
      }
    }
    document.addEventListener('keydown', handleKeyPressModal)
    return () => {
      document.removeEventListener('keydown', handleKeyPressModal)
    }
  }, [handleSelectRadio])

  return (
    <div className="w-full px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected} onChange={handleSelectRadio}>
          <RadioGroup.Label className="sr-only">Estado de tarea</RadioGroup.Label>
          <div className="space-y-2">
            {types.map((type) => (
              <RadioGroup.Option
                key={type.name}
                value={type}
                className={({ active, checked }) =>
                  `${
                    active
                      ? `ring-2 ring-white ring-opacity-60 ring-offset-2 ${type.ringOffsetColor}`
                      : ''
                  }
                  ${
                    checked ? `${type.color} bg-opacity-75 text-white` : 'bg-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm text-start">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium text-start text-base pb-0.5 ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {type.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-white/90' : 'text-gray-500'
                            }`}
                          >
                            <span>
                              {type.description}
                            </span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      <div className="shrink-0 text-white">
                        <CheckCircleIcon className="h-[26px] w-[26px] fill-white/70" />
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
