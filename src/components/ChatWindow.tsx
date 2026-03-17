"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Message } from "@/types";
import ChatMessage, { TypingIndicator } from "./ChatMessage";
import { Heart } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  streamingContent?: string;
}

export default function ChatWindow({
  messages,
  isLoading,
  streamingContent,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, streamingContent]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scroll-smooth">
      {isEmpty ? (
        /* 空状态引导 */
        <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sage-200 via-sage-300 to-lavender-200 flex items-center justify-center shadow-soft-lg float-1">
              <span className="text-3xl font-light text-white select-none">
                心
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-blush-100 rounded-full flex items-center justify-center animate-pulse-soft">
              <Heart className="w-3.5 h-3.5 text-blush-400 fill-blush-300" />
            </div>
          </div>

          <div className="space-y-2 max-w-xs">
            <h2 className="text-lg font-semibold text-slate-600">
              你好，我是心语
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              不管你今天带着什么心情，我都在这里。
              <br />
              随时可以和我聊聊。
            </p>
          </div>

          {/* 话题建议 */}
          <div className="grid grid-cols-1 gap-2 w-full max-w-sm mt-2">
            {[
              "最近感觉有点焦虑，想聊聊",
              "睡眠不太好，心里有很多事",
              "和身边的人关系有些紧张",
              "只是想找人说说心里话",
            ].map((suggestion, i) => (
              <button
                key={i}
                className="text-left px-4 py-2.5 rounded-xl bg-white/70 hover:bg-white/90 border border-sage-100 hover:border-sage-200 text-sm text-slate-500 hover:text-slate-700 transition-all duration-200 shadow-soft hover:shadow-soft-lg"
                onClick={() => {
                  const event = new CustomEvent("suggestion-click", {
                    detail: suggestion,
                  });
                  window.dispatchEvent(event);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1 && message.role === "assistant"}
              />
            ))}
          </AnimatePresence>

          {/* 流式输出中的 AI 消息 */}
          <AnimatePresence>
            {isLoading && !streamingContent && <TypingIndicator />}
          </AnimatePresence>

          {/* 流式文字实时渲染 */}
          {streamingContent && (
            <div className="flex items-end gap-2.5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sage-300 to-lavender-300 flex items-center justify-center text-white text-sm font-medium shadow-soft">
                心
              </div>
              <div className="max-w-[82%] sm:max-w-[70%]">
                <div className="bg-white/90 border border-sage-50 px-4 py-3 rounded-2xl rounded-bl-md shadow-soft ring-1 ring-sage-100">
                  <p className="message-content text-[14.5px] leading-relaxed text-slate-700">
                    {streamingContent}
                    <span className="inline-block w-0.5 h-4 bg-sage-400 ml-0.5 animate-pulse align-text-bottom" />
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
