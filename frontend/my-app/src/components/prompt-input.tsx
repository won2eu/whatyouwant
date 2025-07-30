"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowUp, Paperclip } from "lucide-react"
import { useState } from "react"

export default function Component() {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      console.log("메시지 전송:", message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="bg-transparent backdrop-blur-sm">
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
              disabled={!message.trim()}
              className="shrink-0 h-10 w-10 rounded-xl bg-black hover:bg-black/60 disabled:bg-black/70"
            >
              <ArrowUp className="h-5 w-5" />
              <span className="sr-only">전송</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
