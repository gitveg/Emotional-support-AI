"use client";

import { motion } from "framer-motion";
import { Settings, Sparkles, AlertTriangle } from "lucide-react";

interface HeaderProps {
  isTyping?: boolean;
  isConfigured?: boolean;
  onSettingsClick?: () => void;
}

export default function Header({
  isTyping = false,
  isConfigured = false,
  onSettingsClick,
}: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 flex items-center justify-between px-6 py-4 glass border-b border-white/60"
    >
      {/* 左侧：咨询师信息 */}
      <div className="flex items-center gap-3">
        {/* 头像 */}
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sage-300 via-sage-400 to-lavender-300 flex items-center justify-center shadow-soft text-white text-lg font-medium select-none">
            心
          </div>
          {/* 在线状态 */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-sage-400 border-2 border-white rounded-full" />
        </div>

        {/* 名称与状态 */}
        <div>
          <h1 className="text-[15px] font-semibold text-slate-700 leading-tight">
            心语
          </h1>
          <div className="flex items-center gap-1 mt-0.5">
            {isTyping ? (
              <motion.span
                className="text-xs text-sage-500 flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="inline-flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="typing-dot w-1 h-1 rounded-full bg-sage-400 inline-block"
                      style={{
                        animation: `typingDot 1.4s infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </span>
                正在输入…
              </motion.span>
            ) : (
              <span className="text-xs text-sage-500">随时陪伴你</span>
            )}
          </div>
        </div>
      </div>

      {/* 右侧 */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage-50/80 border border-sage-100">
          <Sparkles className="w-3.5 h-3.5 text-sage-400" />
          <span className="text-xs text-sage-600 font-medium">心理疗愈 AI</span>
        </div>

        {/* 设置按钮 */}
        <button
          onClick={onSettingsClick}
          title="API 设置"
          className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
            isConfigured
              ? "bg-sage-50 hover:bg-sage-100 border border-sage-100 text-sage-500 hover:text-sage-700"
              : "bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-500 hover:text-amber-700"
          }`}
        >
          <Settings className="w-4 h-4" />
          {/* 未配置时的警告红点 */}
          {!isConfigured && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
            </span>
          )}
        </button>
      </div>
    </motion.header>
  );
}
