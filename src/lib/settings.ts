const STORAGE_KEY = "xinyu-ai-settings";

export interface AISettings {
  apiKey: string;
  baseURL: string;
  model: string;
}

export const DEFAULT_SETTINGS: AISettings = {
  apiKey: "",
  baseURL: "https://api.openai.com/v1",
  model: "gpt-4o-mini",
};

export function loadSettings(): AISettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AISettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function clearSettings(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function isConfigured(settings: AISettings): boolean {
  return settings.apiKey.trim().length > 0;
}

/** 常用服务商预设 */
export const PROVIDER_PRESETS = [
  {
    label: "OpenAI",
    baseURL: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
  },
  {
    label: "DeepSeek",
    baseURL: "https://api.deepseek.com",
    model: "deepseek-chat",
  },
  {
    label: "月之暗面 (Kimi)",
    baseURL: "https://api.moonshot.cn/v1",
    model: "moonshot-v1-8k",
  },
  {
    label: "智谱 AI",
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4",
  },
] as const;
