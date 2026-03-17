import { Message } from "@/types";

const CONVERSATIONS_KEY = "xinyu-conversations";
const ACTIVE_ID_KEY = "xinyu-active-id";

/** 单条对话会话 */
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string; // ISO string，方便 JSON 序列化
  updatedAt: string;
}

/** 最多保留的对话数量，防止 localStorage 超出 5MB */
const MAX_CONVERSATIONS = 60;

// ─── 标题生成 ────────────────────────────────────────────

export function generateTitle(firstUserMessage: string): string {
  const clean = firstUserMessage.replace(/\s+/g, " ").trim();
  return clean.length > 24 ? clean.slice(0, 24) + "…" : clean;
}

// ─── 读写 ────────────────────────────────────────────────

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (!raw) return [];
    const parsed: Conversation[] = JSON.parse(raw);
    // 按最近更新排序
    return parsed.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  // 超出限制时删除最旧的
  const trimmed = conversations
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, MAX_CONVERSATIONS);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(trimmed));
}

/** 新建或更新一条对话（按 id 匹配） */
export function upsertConversation(
  conversations: Conversation[],
  updated: Conversation
): Conversation[] {
  const idx = conversations.findIndex((c) => c.id === updated.id);
  if (idx >= 0) {
    const copy = [...conversations];
    copy[idx] = updated;
    return copy;
  }
  return [updated, ...conversations];
}

/** 删除一条对话 */
export function deleteConversation(
  conversations: Conversation[],
  id: string
): Conversation[] {
  return conversations.filter((c) => c.id !== id);
}

// ─── 活跃 ID ─────────────────────────────────────────────

export function loadActiveId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_ID_KEY);
}

export function saveActiveId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_ID_KEY, id);
}

// ─── 工具 ────────────────────────────────────────────────

export function newConversationId(): string {
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** 返回用于展示的相对时间描述 */
export function relativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return new Date(isoString).toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
  });
}
