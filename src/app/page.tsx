"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCcw, X, KeyRound } from "lucide-react";
import OpenAI from "openai";
import Header from "@/components/Header";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import SettingsPanel from "@/components/SettingsPanel";
import { Message } from "@/types";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import {
  AISettings,
  loadSettings,
  isConfigured,
} from "@/lib/settings";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/* 背景装饰 */
function BackgroundDecorations() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-white to-blush-50" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-lavender-100/40 blur-[80px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-sage-100/50 blur-[80px]" />
      <div className="absolute top-[40%] left-[10%] w-[200px] h-[200px] rounded-full bg-blush-100/30 blur-[60px]" />
      <div className="float-1 absolute top-[8%] left-[6%] w-3 h-3 rounded-full bg-sage-200/60" />
      <div className="float-2 absolute top-[20%] right-[8%] w-2 h-2 rounded-full bg-lavender-200/70" />
      <div className="float-3 absolute bottom-[25%] right-[12%] w-4 h-4 rounded-full bg-blush-200/50" />
      <div className="float-1 absolute bottom-[15%] left-[15%] w-2.5 h-2.5 rounded-full bg-sage-300/40" />
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-[0.025]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#5eb192" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AISettings>({
    apiKey: "",
    baseURL: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingContentRef = useRef("");

  /* 初始化：从 localStorage 读取设置 */
  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
    /* 首次未配置时自动打开设置面板 */
    if (!isConfigured(stored)) {
      setSettingsOpen(true);
    }
  }, []);

  /* 监听话题建议点击 */
  useEffect(() => {
    const handler = (e: CustomEvent<string>) => {
      if (!isLoading) sendMessage(e.detail);
    };
    window.addEventListener("suggestion-click", handler as EventListener);
    return () =>
      window.removeEventListener("suggestion-click", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, settings]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isLoading) return;

      if (!isConfigured(settings)) {
        setSettingsOpen(true);
        return;
      }

      setError(null);

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);
      setStreamingContent("");
      streamingContentRef.current = "";

      abortControllerRef.current = new AbortController();

      try {
        const client = new OpenAI({
          apiKey: settings.apiKey,
          baseURL: settings.baseURL || "https://api.openai.com/v1",
          dangerouslyAllowBrowser: true,
        });

        const stream = await client.chat.completions.create(
          {
            model: settings.model || "gpt-4o-mini",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...updatedMessages.map((m) => ({
                role: m.role as "user" | "assistant",
                content: m.content,
              })),
            ],
            stream: true,
            temperature: 0.8,
            max_tokens: 1000,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
          },
          { signal: abortControllerRef.current.signal }
        );

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || "";
          if (delta) {
            streamingContentRef.current += delta;
            setStreamingContent(streamingContentRef.current);
          }
        }

        /* 流式结束，写入消息列表 */
        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: streamingContentRef.current,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingContent("");
        streamingContentRef.current = "";
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          if (streamingContentRef.current) {
            const assistantMessage: Message = {
              id: generateId(),
              role: "assistant",
              content: streamingContentRef.current,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
          }
          setStreamingContent("");
          streamingContentRef.current = "";
        } else {
          const msg = (err as Error).message || "";
          if (msg.includes("401") || msg.toLowerCase().includes("api key")) {
            setError("API 密钥无效或已过期，请在设置中更新你的 API Key。");
          } else if (msg.includes("429")) {
            setError("请求过于频繁，请稍后再试。");
          } else if (msg.includes("network") || msg.includes("fetch")) {
            setError("网络连接失败。如使用 OpenAI，请确认能访问 api.openai.com。");
          } else {
            setError(msg || "连接 AI 服务时出现问题，请稍后再试。");
          }
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, messages, settings]
  );

  const handleStop = () => abortControllerRef.current?.abort();

  const handleSettingsSave = (newSettings: AISettings) => {
    setSettings(newSettings);
  };

  const configured = isConfigured(settings);

  return (
    <>
      <BackgroundDecorations />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSettingsSave}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-2xl flex flex-col glass rounded-3xl shadow-soft-lg border border-white/70 overflow-hidden"
          style={{ height: "min(88vh, 760px)" }}
        >
          <Header
            isTyping={isLoading}
            isConfigured={configured}
            onSettingsClick={() => setSettingsOpen(true)}
          />

          {/* 未配置时的引导提示条 */}
          <AnimatePresence>
            {!configured && !settingsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 mt-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2.5"
              >
                <KeyRound className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-700 flex-1">
                  请先配置 API 密钥才能开始对话
                </p>
                <button
                  onClick={() => setSettingsOpen(true)}
                  className="text-xs text-amber-600 font-medium hover:text-amber-800 underline transition-colors"
                >
                  去设置
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            streamingContent={streamingContent}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mx-4 mb-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-600 flex-1 leading-snug">
                  {error}
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      const lastUser = [...messages]
                        .reverse()
                        .find((m) => m.role === "user");
                      if (lastUser) {
                        setMessages((prev) =>
                          prev.filter((m) => m.id !== lastUser.id)
                        );
                        setError(null);
                        sendMessage(lastUser.content);
                      } else {
                        setError(null);
                      }
                    }}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    重试
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="text-rose-300 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ChatInput
            onSend={sendMessage}
            onStop={handleStop}
            isLoading={isLoading}
            disabled={!configured}
          />
        </motion.div>

        <p className="mt-4 text-xs text-slate-400">
          Emotional Support AI · 心语陪伴计划
        </p>
      </div>
    </>
  );
}
