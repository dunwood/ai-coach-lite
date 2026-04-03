# AI Coach Lite (起步 · AI项目设计书助手)

## 项目概述
"起步" —— 用户输入一句话想法，系统生成专业级 Prompt，用户复制到免费大模型即可获得设计书。
纯静态网站，不调用任何 AI API。

## 技术栈
- 纯 HTML + JS + CSS
- 无框架、无构建工具、无 CSS 框架
- 部署: Cloudflare Pages（GitHub 自动部署）
- 数据持久化: localStorage

## 技术约束（严格遵守）
- 不用 React / Vue / Next.js / 任何框架
- 不用 webpack / vite / 任何构建工具
- 不用 tailwind / bootstrap / 任何 CSS 框架
- 不创建 functions/ 目录
- 不创建 wrangler.toml / wrangler.jsonc / wrangler.json
- 不调用任何 AI API
- 无 .env 文件

## 文件结构
ai-coach-lite/
├── index.html          # 唯一页面
├── css/
│   └── style.css       # 全部样式
├── js/
│   ├── app.js          # 主逻辑（UI 状态、事件绑定、流程控制）
│   ├── prompt.js       # Prompt 模板 + 拼接逻辑
│   └── storage.js      # localStorage 历史记录
├── CLAUDE.md
└── .gitignore

## 编码规范
- UTF-8 编码，2 空格缩进
- 中文注释
- ES6+ 语法（const/let, 箭头函数, 模板字符串）
- CSS 使用 CSS 变量做主题
