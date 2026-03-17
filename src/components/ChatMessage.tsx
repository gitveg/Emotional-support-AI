"use client";

import { motion } from "framer-motion";
import { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatMessage({
  message,
  isLatest = false,
}: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex items-end gap-2.5 max-w-[82%] sm:max-w-[70%] ${
          isAssistant ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {/* AI 头像 */}
        {isAssistant && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sage-300 to-lavender-300 flex items-center justify-center text-white text-sm font-medium shadow-soft self-end mb-1">
            心
          </div>
        )}

        {/* 消息气泡 */}
        <div className={`flex flex-col ${isAssistant ? "items-start" : "items-end"} gap-1`}>
          <div
            className={`
              message-bubble px-4 py-3 rounded-2xl shadow-soft
              ${
                isAssistant
                  ? "bg-white/90 text-slate-700 rounded-bl-md border border-sage-50"
                  : "bg-gradient-to-br from-sage-400 to-sage-500 text-white rounded-br-md"
              }
              ${isLatest && isAssistant ? "ring-1 ring-sage-100" : ""}
            `}
          >
            <p className="message-content text-[14.5px] leading-relaxed">
              {message.content}
            </p>
          </div>

          {/* 时间戳 */}
          <span className="text-[11px] text-slate-400 px-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* 打字中占位组件 */
export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="flex items-end gap-2.5"
    >
      {/* AI 头像 */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sage-300 to-lavender-300 flex items-center justify-center text-white text-sm font-medium shadow-soft">
        心
      </div>

      {/* 打字气泡 */}
      <div className="bg-white/90 border border-sage-50 px-4 py-3.5 rounded-2xl rounded-bl-md shadow-soft">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="typing-dot w-2 h-2 rounded-full bg-sage-300 inline-block"
              style={{
                animation: `typingDot 1.4s infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
