import formatTodosForAI from "./formatTodosForAI.js"

const fetchSuggestion = async (board) => {
  const todos = await formatTodosForAI(board)

  const response = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ todos: todos })
  })
  
  const GPTdata = await response.json()
  if (!GPTdata.ok) {
    return null
  }
  const { message } = GPTdata
  return message
}

export default fetchSuggestion