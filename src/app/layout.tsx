import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "心语 · 心理疗愈 AI",
  description: "你的专属心理支持伙伴，随时倾听，温柔陪伴",
  keywords: ["心理咨询", "情绪支持", "心理健康", "AI咨询"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
