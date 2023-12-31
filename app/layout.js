import AddTodoModal from '@/components/AddTodoModal'
import EditTodoModal from '@/components/EditTodoModal'
import './globals.css'

export const metadata = {
  title: 'Team Work App',
  description: 'Created by estoicodev',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-300/10">
        {children}
        <AddTodoModal />
        <EditTodoModal />
      </body>
    </html>
  )
}
