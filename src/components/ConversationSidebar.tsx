"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, MessageCircle, Clock } from "lucide-react";
import { Conversation, relativeTime } from "@/lib/history";

interface ConversationSidebarProps {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function ConversationSidebar({
  open,
  onClose,
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ConversationSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩 */}
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 抽屉 */}
          <motion.aside
            key="sidebar-panel"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col bg-white/95 backdrop-blur-xl shadow-soft-lg border-r border-white/60"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-sage-400" />
                <h2 className="text-[14px] font-semibold text-slate-700">
                  历史对话
                </h2>
                {conversations.length > 0 && (
                  <span className="text-[11px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                    {conversations.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>

            {/* 新建对话按钮 */}
            <div className="px-3 py-3 border-b border-slate-50">
              <button
                onClick={() => {
                  onNew();
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-sage-400 to-sage-500 hover:from-sage-500 hover:to-sage-600 text-white text-sm font-medium transition-all shadow-soft hover:shadow-glow"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                新建对话
              </button>
            </div>

            {/* 对话列表 */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-sage-50 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-sage-300" />
                  </div>
                  <p className="text-sm text-slate-400">还没有对话记录</p>
                  <p className="text-xs text-slate-300">开始聊天后会自动保存在这里</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={conv.id === activeId}
                    onSelect={() => {
                      onSelect(conv.id);
                      onClose();
                    }}
                    onDelete={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                  />
                ))
              )}
            </div>

            {/* 底部提示 */}
            <div className="px-4 py-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                对话记录保存在本地浏览器
                <br />
                清除浏览器数据后将丢失
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* 单条对话列表项 */
function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const messageCount = conversation.messages.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
        isActive
          ? "bg-sage-50 border border-sage-100"
          : "hover:bg-slate-50 border border-transparent"
      }`}
      onClick={onSelect}
    >
      {/* 图标 */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 ${
          isActive ? "bg-sage-100" : "bg-slate-100 group-hover:bg-sage-50"
        }`}
      >
        <MessageCircle
          className={`w-3.5 h-3.5 ${isActive ? "text-sage-500" : "text-slate-400"}`}
        />
      </div>

      {/* 文字区 */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[13px] font-medium truncate leading-snug ${
            isActive ? "text-sage-700" : "text-slate-600"
          }`}
        >
          {conversation.title || "新对话"}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Clock className="w-2.5 h-2.5 text-slate-300 flex-shrink-0" />
          <span className="text-[11px] text-slate-400 truncate">
            {relativeTime(conversation.updatedAt)}
          </span>
          {messageCount > 0 && (
            <>
              <span className="text-slate-200">·</span>
              <span className="text-[11px] text-slate-400">
                {Math.floor(messageCount / 2)} 轮对话
              </span>
            </>
          )}
        </div>
      </div>

      {/* 删除按钮（hover 时显示） */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 w-6 h-6 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-300 hover:text-rose-400 hover:bg-rose-50 transition-all duration-150"
        title="删除对话"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
