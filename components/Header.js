"use client"

import { useBoardStore } from '@/store/BoardStore.js'
import Image from 'next/image'
import { FaceFrownIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'
import { useEffect, useState } from 'react'
import fetchSuggestion from '@/utils/fetchSuggestion'

export default function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString
  ])
  const [aiIsEnabled, setAiIsEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState("Asistente de tareas ChatGPT")

  useEffect(() => {
    if (board.columns.size === 0) return
    setLoading(true)

    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board)

      if (suggestion === null) {
        setAiIsEnabled(false)
        setLoading(false)
      } else if (suggestion && suggestion.length) {
        setSuggestion(suggestion)
        setLoading(false)
      }
    }
    fetchSuggestionFunc()
  }, [board])

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        <div
          className="
            absolute
            top-0
            left-0
            w-full
            h-96
            bg-gradient-to-br
            from-pink-400
            to-blue-600/80
            filter
            blur-3xl
            opacity-50
            -z-50
          "
        ></div>

        <Image
          src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Trello_logo.svg/1280px-Trello_logo.svg.png"
          alt="Team work logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
          priority
        />

        <div className="w-full flex items-center space-x-4 flex-1 md:justify-end">
          {/* Searchbox */}
          <form className="flex space-x-4 items-center bg-white rounded-md shadow-md p-2 flex-1 md:flex-initial">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400"/>
            <input
              type="text"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="flex-1 p-1 outline-none"
            />
            <button type="submit" hidden>Search</button>
          </form>
          {/* Avatar */}
          <Avatar name="Mauricio Carrasco" size="50" round/>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-3 md:py-5">
        <p className={`flex items-center text-sm font-light italic shadow-xl rounded-xl px-5 py-3 w-fit md:min-w-[360px] ${
          aiIsEnabled ? "bg-white" : "bg-white/50 text-black/80"}`}>
          {
            aiIsEnabled ?
            <UserCircleIcon className={`inline-block w-9 h-9 text-blue-500 mr-1.5 ${
              loading ? "animate-spin" : ""
            }`}/> :
            <FaceFrownIcon className={`inline-block w-9 h-9 text-blue-500 mr-1.5`}/>
          }
          {(aiIsEnabled && loading) ?
          "ChatGPT está procesando tus tareas del día..." :
          (aiIsEnabled && !loading) ?
          suggestion :
          "ChatGPT no está disponible en este momento..."
          }
        </p>
      </div>
    </header>
  )
}