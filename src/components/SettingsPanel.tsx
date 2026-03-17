"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import {
  AISettings,
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  PROVIDER_PRESETS,
} from "@/lib/settings";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  onSave: (settings: AISettings) => void;
}

export default function SettingsPanel({
  open,
  onClose,
  onSave,
}: SettingsPanelProps) {
  const [form, setForm] = useState<AISettings>(DEFAULT_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(loadSettings());
      setSaved(false);
    }
  }, [open]);

  const handleSave = () => {
    saveSettings(form);
    onSave(form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };

  const applyPreset = (preset: (typeof PROVIDER_PRESETS)[number]) => {
    setForm((prev) => ({
      ...prev,
      baseURL: preset.baseURL,
      model: preset.model,
    }));
    setShowPresets(false);
  };

  const isValid = form.apiKey.trim().length > 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩 */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 面板 */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-x-0 top-[64px] z-50 mx-auto w-[calc(100%-24px)] max-w-md"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-soft-lg border border-white/80 overflow-hidden">
              {/* 头部 */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-[15px] font-semibold text-slate-700">
                    API 设置
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    设置保存在本地浏览器，不会上传
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                {/* API Key */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    API 密钥 <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? "text" : "password"}
                      value={form.apiKey}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, apiKey: e.target.value }))
                      }
                      placeholder="sk-..."
                      className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-sage-300 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 服务商预设 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    服务商 / API 地址
                  </label>

                  {/* 预设选择器 */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowPresets((v) => !v)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 hover:border-sage-200 hover:bg-white transition-colors"
                    >
                      <span>
                        {PROVIDER_PRESETS.find(
                          (p) => p.baseURL === form.baseURL
                        )?.label ?? "自定义"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${showPresets ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {showPresets && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-100 shadow-soft-lg z-10 overflow-hidden"
                        >
                          {PROVIDER_PRESETS.map((preset) => (
                            <button
                              key={preset.label}
                              onClick={() => applyPreset(preset)}
                              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-sage-50 text-left transition-colors"
                            >
                              <span className="text-sm text-slate-700">
                                {preset.label}
                              </span>
                              <span className="text-xs text-slate-400">
                                {preset.model}
                              </span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Base URL 输入 */}
                  <input
                    type="text"
                    value={form.baseURL}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, baseURL: e.target.value }))
                    }
                    placeholder="https://api.openai.com/v1"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-sage-300 focus:bg-white transition-colors"
                  />
                </div>

                {/* 模型 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-600">
                    模型名称
                  </label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, model: e.target.value }))
                    }
                    placeholder="gpt-4o-mini"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:border-sage-300 focus:bg-white transition-colors"
                  />
                </div>

                {/* 提示 */}
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-sage-50/60 border border-sage-100">
                  <AlertCircle className="w-3.5 h-3.5 text-sage-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-sage-600 leading-relaxed">
                    API 密钥仅存储在你的浏览器本地（localStorage），不会传输到任何服务器。
                  </p>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="px-5 pb-5 flex gap-2.5">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isValid || saved}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-sage-400 to-sage-500 hover:from-sage-500 hover:to-sage-600 disabled:from-slate-200 disabled:to-slate-200 text-white disabled:text-slate-400 text-sm font-medium transition-all flex items-center justify-center gap-1.5"
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      已保存
                    </>
                  ) : (
                    "保存设置"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
