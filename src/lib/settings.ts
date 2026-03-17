const STORAGE_KEY = "xinyu-ai-settings";

export interface AISettings {
  apiKey: string;
  baseURL: string;
  model: string;
}

export const DEFAULT_SETTINGS: AISettings = {
  apiKey: "",
  baseURL: "https://api.deepseek.com",
  model: "deepseek-chat",
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

/** 常用服务商预设，models 有值时展示为下拉选择器 */
export const PROVIDER_PRESETS = [
  {
    label: "DeepSeek",
    baseURL: "https://api.deepseek.com",
    model: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"],
  },
  {
    label: "OpenAI",
    baseURL: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"],
  },
  {
    label: "月之暗面 (Kimi)",
    baseURL: "https://api.moonshot.cn/v1",
    model: "moonshot-v1-8k",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
  },
  {
    label: "智谱 AI",
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4",
    models: ["glm-4", "glm-4-flash", "glm-4-air"],
  },
];
