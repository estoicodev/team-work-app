"use client"

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusIcon, PhotoIcon} from '@heroicons/react/24/solid'
import { useBoardStore } from '@/store/BoardStore'
import { useEditModalStore } from '@/store/EditModalStore'
import RadioGroupByColumnId from './RadioGroupByColumnId'
import { acceptedChars } from '@/consts'

export default function EditTodoModal() {
  const [updateTodoToBoardAndDB, image, setImage] = useBoardStore((state) => [
    state.updateTodoToBoardAndDB,
    state.image,
    state.setImage
  ])
  const [
    isOpen, closeModal, titleTodo, setTitleTodo, $idTodo, setIdTodo, statusTodo, setStatusTodo
  ] = useEditModalStore((state) => [
    state.isOpen,
    state.closeModal,
    state.titleTodo,
    state.setTitleTodo,
    state.$idTodo,
    state.setIdTodo,
    state.statusTodo,
    state.setStatusTodo
  ])
  const [blockInput, setBlockInput] = useState(false);

  const resetModal = () => {
    setTitleTodo("")
    setIdTodo("")
    setImage(null)
    // setStatusTodo("")
  }

  const handleSubmit = (e) => {
      e.preventDefault()
      if (!titleTodo) return

      updateTodoToBoardAndDB({
        $id: $idTodo,
        title: titleTodo,
        status: statusTodo,
        image: image
      })

      closeModal()
      resetModal()
    }

  const handleClose = () => {
    closeModal()
    resetModal()
  }

  const handleChangeInput = (e) => {
    if (blockInput) {
      e.preventDefault()
    } else {
      setTitleTodo(e.target.value)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="form"
        className="relative z-10"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit(e)
        }}
        onClose={handleClose}
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
                Actualiza tu tarea
              </Dialog.Title>
              <div className="w-full px-5">
                <input
                  type="text"
                  value={titleTodo}
                  onChange={handleChangeInput}
                  onKeyDown={(e) => {
                    if (e.altKey && (e.key === '1' || e.key === '2' || e.key === '3')) {
                      setBlockInput(true)
                    }
                    if (acceptedChars.includes(e.key)) {
                      setBlockInput(false)
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Alt' || acceptedChars.includes(e.key)) {
                      setBlockInput(false)
                    }
                  }}
                  onFocus={(e) => {
                    e.target.select()
                  }}
                  placeholder="Escribe la tarea aquí..."
                  className="w-full max-w-md h-14 outline-none border border-gray-300 rounded-md p-5"
                />
              </div>

              <RadioGroupByColumnId type="edit"/>

              <div className="relative w-full pb-8 px-4">
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
                    : "Sube una nueva imagen"
                  }
                </label>
              </div>

              <div className="flex flex-wrap gap-y-4 w-full justify-between items-center px-5 pb-3">
                <button
                  className="order-2 xs:order-1 flex-1 xs:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg inline-flex justify-center items-center"
                  onClick={(e) => {
                    e.preventDefault()
                    handleClose()
                  }}
                >
                  <XMarkIcon className="relative -left-2 w-5 h-5 mr-2" />
                  <span>Cancelar</span>
                </button>
                <button
                  type="submit"
                  disabled={!titleTodo}
                  className="order-1 xs:order-2 flex-1 xs:flex-none bg-blue-500 hover:bg-blue-600
                    text-white font-bold py-3 px-6 rounded-lg inline-flex justify-center items-center
                    disabled:bg-blue-300 disabled:text-white/80 disabled:cursor-not-allowed
                  "
                >
                  <PlusIcon className="relative -left-2 w-5 h-5 mr-1" />
                  <span>Actualizar</span>
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
