"use client"

import Board from '@/components/Board'
import Header from '@/components/Header'
import { useBoardStore } from '@/store/BoardStore'
import { useAddModalStore } from '@/store/AddModalStore'
import dotenv from 'dotenv'
import { useEffect } from 'react'
dotenv.config()

export default function Home() {
  const [
    setColumnIdSelected, inputSearchFocused, setInputSearchFocused,
    modalIsOpen, setModalIsOpen
  ] = useBoardStore((state) => [
    state.setColumnIdSelected,
    state.inputSearchFocused,
    state.setInputSearchFocused,
    state.modalIsOpen,
    state.setModalIsOpen
  ])
  const [openModal] = useAddModalStore((state) => [state.openModal])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!inputSearchFocused && !modalIsOpen) {
        if (e.key === 'q') {
          if (modalIsOpen) return
          setColumnIdSelected("todo")
          openModal()
        } else if (e.key === 'w') {
          if (modalIsOpen) return
          setColumnIdSelected("inprogress")
          openModal()
        } else if (e.key === 'e') {
          if (modalIsOpen) return
          setColumnIdSelected("done")
          openModal()
        } else if (e.key === '/') {
          e.preventDefault()
          if (modalIsOpen) return
          const searchInput = document.getElementById('search-input')
          searchInput.value = ""
          searchInput.focus()
          setInputSearchFocused(true)
        }
      }
    }
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [openModal, setColumnIdSelected, inputSearchFocused, setInputSearchFocused, setModalIsOpen, modalIsOpen])
  
  return (
    <main className="flex flex-col">
      <Header />
      <Board />
    </main>
  )
}
