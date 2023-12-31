"use client"

import { useBoardStore } from '@/store/BoardStore.js'
import Image from 'next/image'
import { FaceFrownIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import fetchSuggestion from '@/utils/fetchSuggestion'
import HeaderAvatar from './HeaderAvatar'

export default function Header() {
  const [board, searchString, setSearchString, setInputSearchFocused] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
    state.setInputSearchFocused
  ])
  const [aiIsEnabled, setAiIsEnabled] = useState(false) // TODO: Change to true when get credits for ChatGPT
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
    // Call ChatGPT API (disabled for now)
    // fetchSuggestionFunc()
  }, [board])

  return (
    <header>
      {/* Header */}
      <div className="w-full bg-gray-500/10 rounded-b-2xl">
        <div className="flex flex-col md:flex-row items-center px-5 max-w-7xl mx-auto">
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

          <div className="w-full xs:w-fit relative -left-4 md:-left-0 flex items-center justify-between xs:justify-center pb-6 md:pb-0">
            <Image
              src="https://i.imgur.com/rd0pRME.png"
              alt="Team work logo"
              width={200}
              height={100}
              className="w-24 md:32 object-contain"
              priority
            />
            <HeaderAvatar
              className="cursor-pointer select-none shadow xs:absolute xs:opacity-0 xs:-top-32 xs:-right-32 xs:cursor-none"
              name="Mauricio Carrasco"
              size="50"
              round
            />
            <span className="absolute xs:relative opacity-0 xs:opacity-100 top-1 md:top-0 text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 italic select-none">Team Work</span>
          </div>

          <div className="w-full flex items-center space-x-4 justify-center flex-1 md:justify-end pb-8 md:pb-0">
            {/* Searchbox */}
            <form className="flex space-x-4 items-center bg-white rounded-md shadow-md p-2 flex-1 md:flex-initial">
              <MagnifyingGlassIcon className="w-6 h-6 text-gray-400"/>
              <input
                type="search"
                placeholder="Buscar tareas"
                value={searchString}
                id="search-input"
                onChange={(e) => setSearchString(e.target.value)}
                onFocus={() => setInputSearchFocused(true)}
                onBlur={() => setInputSearchFocused(false)}
                className="flex-1 p-1 outline-none"
              />
              <button type="submit" hidden>Search</button>
            </form>
            {/* Avatar */}
            <HeaderAvatar
              className="absolute opacity-0 -top-32 -right-32 xs:static xs:opacity-100 shadow xs:cursor-pointer select-none"
              name="Mauricio Carrasco"
              size="50"
              round
            />
          </div>
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="flex items-center justify-center p-5 pt-">
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