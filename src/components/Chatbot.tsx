'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

type Message = {
  id: number
  text: string
  sender: 'user' | 'bot'
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: 'bot' }
  ])
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (input.trim() === '') return

    const newMessage: Message = { id: messages.length + 1, text: input, sender: 'user' }
    setMessages([...messages, newMessage])
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuestion: input }),
      });

      const data = await response.json();
      const botResponse: Message = { id: messages.length + 2, text: data.answer, sender: 'bot' }
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch {
      const errorMessage: Message = { id: messages.length + 2, text: "Sorry, I couldn't process your request.", sender: 'bot' }
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto h-[600px] border rounded-lg flex flex-col">
      <ScrollArea className="flex-grow p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex space-x-2"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}