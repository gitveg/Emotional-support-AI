# 心语 · Emotional Support AI

> 你的专属心理支持伙伴，随时倾听，温柔陪伴。

项目直达：https://gitveg.github.io/Emotional-support-AI/

## 功能特色

- **温柔专业的 AI 咨询师** —— "心语"以同理心为核心，擅长情绪支持与认知行为疗法
- **沉浸式对话体验** —— 精心设计的提示词，让对话自然流畅、真实温暖
- **流式实时响应** —— 打字机效果，仿佛真人在倾听并思考后回复
- **治愈系 UI** —— 柔和的薄荷绿与暖粉渐变，让用户感到放松与安全
- **话题引导** —— 新用户可点击预设话题快速开始
- **安全边界** —— 危机情况下自动提供专业求助热线

## 快速开始

### 1. 配置 API 密钥

复制示例配置文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 API 信息：

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1   # 可换为其他兼容 OpenAI 格式的服务
AI_MODEL=gpt-4o-mini                         # 可选其他模型
```

### 支持的 AI 服务商

| 服务商 | BASE_URL | 模型示例 |
|--------|----------|----------|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o`, `gpt-4o-mini` |
| DeepSeek | `https://api.deepseek.com` | `deepseek-chat` |
| 月之暗面 (Kimi) | `https://api.moonshot.cn/v1` | `moonshot-v1-8k` |
| 智谱 AI | `https://open.bigmodel.cn/api/paas/v4` | `glm-4` |

### 2. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 3. 生产部署

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── app/
│   ├── api/chat/route.ts   # 后端 API（流式响应）
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页面
├── components/
│   ├── Header.tsx           # 顶部咨询师信息栏
│   ├── ChatWindow.tsx       # 消息列表区域
│   ├── ChatMessage.tsx      # 消息气泡 & 打字指示器
│   └── ChatInput.tsx        # 输入框组件
├── lib/
│   └── prompts.ts           # 系统提示词（核心）
└── types/
    └── index.ts             # TypeScript 类型定义
```

## 提示词设计理念

心语的系统提示词遵循以下咨询框架：

1. **情绪优先** —— 先认可感受，再探索原因，最后提供支持
2. **开放性引导** —— 用问题帮助用户自我探索，而非直接给答案
3. **安全边界** —— 遇到危机信号时，立即引导专业资源

## 免责声明

本产品为 AI 心理支持工具，**不能替代专业心理诊疗**。如有紧急情况，请拨打：

- 全国心理援助热线：**400-161-9995**
- 北京心理危机研究与干预中心：**010-82951332**
- 生命热线：**400-821-1215**
