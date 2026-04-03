# 接续 Prompt：AI 项目教练（小白版）

请粘贴到新对话的第一条消息中：

---

## 项目背景

我是哲学园（zhexueyuan.com）的运营者，61岁，非程序员，通过 AI 辅助开发了多个产品。我的开发方式是：Claude.ai 负责 Think/设计/出 task 文件，Claude Code 负责执行。

我已经完成了一个叫"AI 项目教练"的产品（进阶版），部署在 builder.zhexueyuan.com，GitHub 仓库 dunwood/ai-project-coach，本地目录 C:\Users\Admin\ai-project-coach。纯 HTML+JS+CSS 静态网站，部署在 Cloudflare Pages，通过 Git 连接自动部署。项目共 5237 行代码。

## 用户反馈的问题

进阶版的流程是：想法输入 → AI 需求澄清（多轮对话提问） → 三阶段设计书（快速版/标准版/完整版）→ 下一步操作指南。

用户反馈：**设计书的提问太繁琐，三个阶段的设计书会把小白吓跑。** 小白用户可能只会给出一个模糊的描述，比如"我想做一个记账的app"，然后就不知道怎么回答那些专业问题了。

## 我的决策

1. **已完成的版本保留不动**，作为"进阶版"
2. **另做一个全新项目**，叫"小白版"或你建议的名字
3. 小白版的核心思路：用户只需要输入一句模糊的想法，AI 直接生成一份简单可用的设计书，不分阶段，不问一堆问题
4. 让小白有一个好的第一体验，然后再引导他们去进阶版深入学习

## 新项目基本信息

- 本地目录：`D:\AI Project\`（文件夹名称你来建议）
- GitHub 仓库：`dunwood/` + 你建议的仓库名
- 域名：你来建议一个 zhexueyuan.com 的子域名
- 技术栈：纯 HTML+JS+CSS，DeepSeek API，Cloudflare Pages（和进阶版完全一样）
- 部署方式：GitHub 连接 Cloudflare Pages 自动部署（git push 即自动上线）
- DeepSeek API endpoint: `https://api.deepseek.com/v1/chat/completions`，model: `deepseek-chat`

## 我的技术栈约束（非常重要）

- 面向中国大陆用户，Vercel 不可用，必须用 Cloudflare Pages
- 不用任何框架（React/Vue/Next.js 都不用）
- 不用任何构建工具（webpack/vite 都不用）
- 不用任何 CSS 框架（tailwind/bootstrap 都不用）
- 不创建 functions/ 目录（会导致 Cloudflare Pages 切换到全栈模式出问题）
- 不创建 wrangler.toml/wrangler.jsonc/wrangler.json
- AI 用 DeepSeek，不用 Gemini（大陆不可用）
- 数据持久化用 localStorage

## 工作方式

1. 你（Claude.ai）负责 Think 阶段：产品设计、架构讨论、出完整 task 文件（taskXX.md）
2. 我下载 task 文件到项目文件夹
3. 我让 Claude Code 执行：`请读取 taskXX.md 文件，按照里面的要求执行任务`
4. 结果反馈给你，进入下一个循环

## 请你做的事

1. **先完成 Think 阶段**：分析小白版应该怎么设计，核心流程是什么，怎么做到"一句话进去，设计书出来"
2. 建议项目名称、文件夹名、仓库名、子域名
3. 讨论清楚后出设计方案
4. 设计方案确认后再出 task01

**请先做完 Think，不要跳到 Plan 或 Execute。**

## 参考：进阶版的流程（供你理解差异）

```
进阶版流程（已完成，保留不动）：
首页 → 想法输入（textarea + 示例选择）
    → AI 需求澄清（多轮对话，15个维度提问）
    → 设计书生成（快速版/标准版/完整版三个阶段）
    → 下一步操作指南（建文件夹/下载设计书/选路线装工具/拆任务/执行）

小白版流程（待设计）：
首页 → 用户输入一句话想法 → AI 直接输出一份简单设计书 → ???
```

请开始 Think。
