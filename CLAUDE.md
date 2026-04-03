# AI Coach Lite (小白版 · 起步)

## 项目概述
"起步 · AI项目设计书生成器" —— 用户输入一句话想法，AI 直接生成一份简单可用的设计书。
部署在 start.zhexueyuan.com，Cloudflare Pages 自动部署。

## 技术栈
- 纯 HTML + JS + CSS，不用任何框架或构建工具
- AI: DeepSeek API (https://api.deepseek.com/v1/chat/completions, model: deepseek-chat)
- 部署: Cloudflare Pages（GitHub 连接自动部署）
- 数据持久化: localStorage

## 技术约束（严格遵守）
- 不用 React / Vue / Next.js / 任何框架
- 不用 webpack / vite / 任何构建工具
- 不用 tailwind / bootstrap / 任何 CSS 框架
- 不创建 functions/ 目录（会触发 Cloudflare Pages 全栈模式）
- 不创建 wrangler.toml / wrangler.jsonc / wrangler.json
- 不用 Gemini API（大陆不可用）
- 不用 Vercel（大陆不可用）
- Markdown 渲染使用 marked.js（CDN 引入）

## 文件结构
```
ai-coach-lite/
├── index.html          # 唯一页面
├── css/
│   └── style.css       # 全部样式
├── js/
│   ├── app.js          # 主逻辑（UI 状态、事件绑定、流程控制）
│   ├── api.js          # DeepSeek API 调用 + 流式输出
│   ├── prompts.js      # Prompt 模板
│   └── storage.js      # localStorage 历史记录
├── CLAUDE.md
├── .gitignore
└── .env                # DeepSeek API Key（不上传 git）
```

## API Key 处理
API Key 写在 js/api.js 顶部常量中（前端可见，和进阶版一致）。
正式部署前替换为真实 key。占位值: `sk-placeholder-replace-me`

## 编码规范
- 文件编码: UTF-8
- 缩进: 2 空格
- 中文注释
- JS 使用 ES6+ 语法（const/let, 箭头函数, 模板字符串, async/await）
- CSS 使用 CSS 变量做主题色

## Git 规范
- commit 信息用中文
- 每个 task 完成后 commit 一次
