"use client";

import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Square } from "lucide-react";
import { clsx } from "clsx";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  onStop,
  isLoading,
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* 自适应高度 */
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = 160;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="relative px-4 pb-5 pt-3">
      {/* 输入框容器 */}
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px rgba(94, 177, 146, 0.25), 0 4px 24px rgba(0,0,0,0.06)"
            : "0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        }}
        transition={{ duration: 0.2 }}
        className={clsx(
          "flex items-end gap-3 px-4 py-3 rounded-2xl glass border transition-colors duration-200",
          isFocused ? "border-sage-200/80" : "border-white/60"
        )}
      >
        {/* 文本输入区 */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isLoading ? "心语正在回复…" : "说说你的心里话…"}
          rows={1}
          disabled={disabled}
          className={clsx(
            "flex-1 resize-none bg-transparent text-[14.5px] text-slate-700 placeholder-slate-400",
            "focus:outline-none leading-relaxed",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "max-h-40 overflow-y-auto"
          )}
          style={{ minHeight: "24px" }}
        />

        {/* 发送 / 停止按钮 */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.button
              key="stop"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={onStop}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-100 flex items-center justify-center transition-colors duration-200 group"
              title="停止生成"
            >
              <Square className="w-3.5 h-3.5 text-rose-400 group-hover:text-rose-500 fill-rose-300 group-hover:fill-rose-400" />
            </motion.button>
          ) : (
            <motion.button
              key="send"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={handleSend}
              disabled={!canSend}
              className={clsx(
                "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                canSend
                  ? "bg-gradient-to-br from-sage-400 to-sage-500 hover:from-sage-500 hover:to-sage-600 shadow-soft hover:shadow-glow text-white"
                  : "bg-sage-50 text-slate-300 cursor-not-allowed"
              )}
              title="发送 (Enter)"
            >
              <Send className="w-4 h-4" strokeWidth={2} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 底部提示 */}
      <p className="text-center text-[11px] text-slate-300 mt-2">
        心语是 AI，无法替代专业心理诊疗。如有紧急情况请拨打
        <span className="text-sage-400"> 400-161-9995</span>
      </p>
    </div>
  );
}
