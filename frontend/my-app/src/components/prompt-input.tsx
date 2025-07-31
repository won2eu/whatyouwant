"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowUp, Paperclip } from "lucide-react"
import { useState } from "react"

interface ChatResponse {
  response: string
  model: string
}

interface ComponentProps {
  onResponse?: (response: string | null) => void
  onPrompt?: (prompt: string) => void
}

export default function Component({ onResponse, onPrompt }: ComponentProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      setIsLoading(true)
      
      // 프롬프트에 따라 애니메이션 설정
      onPrompt?.(message.trim())
      
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: message.trim() })
        })
        
        if (response.ok) {
          const data: ChatResponse = await response.json()
          onResponse?.(data.response)
          
          // 5초 후 응답 사라지게 하기
          setTimeout(() => {
            onResponse?.(null)
          }, 5000)
        } else {
          console.error('API 오류:', response.status)
        }
      } catch (error) {
        console.error('요청 오류:', error)
      } finally {
        setIsLoading(false)
        setMessage("")
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="bg-transparent">
      <div className="max-w-4xl mx-auto p-10">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center gap-2 bg-white rounded-4xl border border-black shadow-lg p-2 min-h-[80px]">

            <div className="flex-1 flex items-center">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                className="w-full min-h-[40px] max-h-32 resize-none border-0 bg-transparent px-2 py-2 text-base placeholder:text-gray-500 focus:outline-none"
                rows={1}
              />
            </div>

            {/* 전송 버튼 */}
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isLoading}
              className="shrink-0 h-10 w-10 rounded-xl bg-black hover:bg-black/60 disabled:bg-black/70"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
              <span className="sr-only">전송</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
