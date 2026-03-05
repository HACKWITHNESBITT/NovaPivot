import { useState, useRef, useEffect, FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import { Send, Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

function Chat() {
  const { messages, sendMessage, isLoading } = useApp()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input
    setInput('')
    await sendMessage(message)
  }

  return (
    <div className="glass rounded-xl border border-nova-border overflow-hidden flex flex-col h-[600px] sm:h-[500px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-nova-teal to-nova-teal-dark'
                : 'bg-nova-card border border-nova-border'
            }`}>
              {msg.role === 'assistant' ? (
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-nova-text-muted" />
              )}
            </div>
            
            {/* Message Bubble */}
            <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm ${
              msg.role === 'assistant'
                ? 'bg-nova-card/50 border border-nova-border text-nova-text whitespace-pre-wrap font-sans'
                : 'bg-gradient-to-r from-nova-teal/10 to-nova-teal/20 border border-nova-teal/30 text-nova-text'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="space-y-2">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-nova-teal to-nova-teal-dark flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="bg-nova-card/50 border border-nova-border rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-nova-text whitespace-pre-wrap font-sans">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-nova-teal rounded-full animate-pulse"></div>
                <span className="animate-pulse">Nova is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-nova-border bg-nova-card/30">
        <div className="relative flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about your career transition..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-nova-card border border-nova-border rounded-lg text-nova-text text-xs sm:text-sm placeholder:text-nova-text-muted focus:outline-none focus:border-nova-teal/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 sm:p-2.5 rounded-lg bg-gradient-to-r from-nova-teal to-nova-teal-dark text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default Chat
