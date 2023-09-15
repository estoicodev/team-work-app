import openai from '@/openai.js'
import { NextResponse } from 'next/server'
 
export async function POST(request) {
  const response = await request.json()
  const { todos } = response

  // Communicate with OpenAI GPT-3
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      n: 1,
      messages: [
        {
          role: "system",
          content: "Al responder, dé la bienvenida al usuario siempre como Mr. Mau y déle la bienvenida a la aplicación Team Work. Limite la respuesta a 150 caracteres."
        },
        {
          role: "user",
          content: `Hola, proporciona un resumen de las siguientes tareas. Cuenta las tareas de cada categoría: todo, in progress y done. Luego dile al usuario una frase corta que le anime a seguir trabajando. Esta es la data de las tareas: ${
            JSON.stringify(todos)
          }`
        }
      ],
    })
    return NextResponse.json({
      ok: true, status: 200, message: chatCompletion.choices[0].message.content
    })
  } catch (err) {
    console.error(`OpenAI error ${err.status}: ${err.message}`)
    return NextResponse.json({
      ok: false, status: err.status, message: err.message
    })
  }
}