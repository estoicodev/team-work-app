"use client"

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusIcon, PhotoIcon} from '@heroicons/react/24/solid'
import { useBoardStore } from '@/store/BoardStore'
import { useAddModalStore } from '@/store/AddModalStore'
import RadioGroupByColumnId from './RadioGroupByColumnId'

export default function AddTodoModal() {
  const [
    newTaskInput, setNewTaskInput, columnIdSelected, image, setImage, addTodoToBoardAndDB
  ] = useBoardStore((state) => [
    state.newTaskInput,
    state.setNewTaskInput,
    state.columnIdSelected,
    state.image,
    state.setImage,
    state.addTodoToBoardAndDB
  ])
  const [isOpen, closeModal] = useAddModalStore((state) => [
    state.isOpen,
    state.closeModal
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newTaskInput) return

    addTodoToBoardAndDB({
      title: newTaskInput,
      status: columnIdSelected,
      image: image
    })

    closeModal()
    setImage(null)
    setNewTaskInput("")
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="form"
        className="relative z-10"
        onClose={closeModal}
        onSubmit={(e) => handleSubmit(e)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <Dialog.Title as="h3"
                className="text-lg font-medium leading-6 text-gray-900 pb-5"
              >
                Añade una nueva tarea
              </Dialog.Title>
              <div className="w-full px-5">
                <input
                  type="text"
                  value={newTaskInput}
                  onChange={(e) => {
                    setNewTaskInput(e.target.value)
                  }}
                  placeholder="Escribe la tarea aquí..."
                  className="w-full max-w-md h-14 outline-none border border-gray-300 rounded-md p-5"
                />
              </div>

              <RadioGroupByColumnId type="add" />

              <div className="relative w-full flex justify-center items-center pb-8 px-4">
                <input
                  id="file-image"
                  type="file"
                  accept="image/*"
                  className="w-1 h-1 absolute -z-10 opacity-0 overflow-hidden"
                  onChange={(e) => {
                    if (!e.target.files[0].type.startsWith("image/")) return

                    const file = e.target.files[0]
                    if (file) setImage(file)
                  }}
                />
                <label
                  htmlFor="file-image"
                  className="flex items-center justify-center w-full h-full text-sm font-medium text-gray-800 bg-transparent hover:bg-gray-200 border border-gray-300 rounded-md px-5 py-7 shadow-sm cursor-pointer"
                >
                  <PhotoIcon className="w-6 h-6 text-gray-800 mr-2" />
                  {image ?
                    <span>{image.name}</span>
                    : "Sube una imagen"
                  }
                </label>
              </div>

              <div className="flex flex-wrap gap-y-4 gap-x-3 w-full justify-between items-center px-5 pb-3">
                <button
                  className="order-2 xs:order-1 flex-1 xs:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg inline-flex justify-center items-center"
                  onClick={(e) => {
                    e.preventDefault()
                    closeModal()
                    setNewTaskInput("")
                    setImage(null)
                  }}
                >
                  <XMarkIcon className="relative -left-2 w-5 h-5 mr-2" />
                  <span>Cancelar</span>
                </button>
                <button
                  type="submit"
                  disabled={!newTaskInput}
                  className="order-1 xs:order-2 flex-1 xs:flex-none
                  bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg
                    inline-flex justify-center items-center
                    disabled:bg-blue-300 disabled:text-white/80 disabled:cursor-not-allowed
                  "
                >
                  <PlusIcon className="relative -left-2 w-5 h-5 mr-1" />
                  <span>Crear</span>
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
        </div>
      </Dialog>
    </Transition>
  )
}
