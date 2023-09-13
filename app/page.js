import Board from '@/components/Board'
import Header from '@/components/Header'
import dotenv from 'dotenv'
dotenv.config()

export default function Home() {  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Board />
    </main>
  )
}
