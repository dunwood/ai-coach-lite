# Task 01: 项目重构 — Prompt 生成器 + 高级感 UI

## 任务目标
完全重写 ai-coach-lite 项目。从"AI API 调用"架构改为"Prompt 生成器"架构：用户输入一句话想法，系统用 JS 模板拼接生成一段专业 Prompt，用户复制后粘贴到免费大模型（豆包/DeepSeek/Kimi/通义）获取设计书。

**不调用任何 AI API，整个产品是纯静态页面。**

---

## 项目信息

| 项 | 值 |
|---|---|
| 本地目录 | `D:\AI Project\ai-coach-lite` |
| GitHub 仓库 | `dunwood/ai-coach-lite` |
| 子域名 | `start.zhexueyuan.com` |
| 技术栈 | 纯 HTML + JS + CSS，无框架、无构建工具、无 API 调用 |

---

## 架构说明

### 核心流程
```
用户输入一句话（或点示例）
       ↓
点击"生成 Prompt"
       ↓
JS 将用户输入嵌入预写好的 Prompt 模板（纯字符串拼接）
       ↓
页面展示生成的 Prompt 全文
       ↓
用户点"复制"，然后点某个大模型按钮
       ↓
跳转到大模型网页版，粘贴 Prompt，得到设计书
```

### 不需要的东西
- ❌ 不需要 .env 文件
- ❌ 不需要 API Key
- ❌ 不需要 api.js
- ❌ 不需要流式输出
- ❌ 不需要 marked.js

---

## 步骤 1：更新 CLAUDE.md

用以下内容**完全替换**现有 CLAUDE.md：

```markdown
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
```

---

## 步骤 2：更新 .gitignore

```
.DS_Store
Thumbs.db
*.log
node_modules/
```

（删掉 .env 相关行，本项目不需要）

---

## 步骤 3：创建 js/prompt.js

这是产品的核心——Prompt 模板和拼接逻辑。

```javascript
// ========== Prompt 模板 ==========
const PROMPT_TEMPLATE = `你是一个资深产品经理，擅长把模糊的想法变成清晰的产品方案。你同时也是 AI 辅助开发领域的专家，深知如何让零基础的人通过 AI 工具完成软件开发。

用户的想法是："{{USER_INPUT}}"

请根据这个想法，直接生成一份简洁实用的产品设计书。不要反问用户任何问题，所有细节你自己合理假设。

设计书必须包含以下 6 个部分：

# [你起的项目名称]

## 一句话定位
[这个产品是什么、给谁用、解决什么问题]

## 核心功能（3-5 个）
[每个功能一句话描述，标注优先级：必做 / 可选]

## 页面规划（2-4 个页面）
[每个页面的名称和包含的内容]

## 技术方案
[用大白话解释用什么技术实现，默认推荐纯网页(HTML+JS)方案，因为最适合零基础者用 AI 辅助开发]

## 执行路线图（3-5 步）
[告诉用户先做什么再做什么，每步给出具体行动]

要求：
- 全部用中文
- 语言通俗易懂，不用任何专业术语
- 总字数 500-800 字
- 语气友好鼓励，让完全没有技术背景的人觉得"我也能做到"
- 技术方案部分要具体到"你可以让 AI 帮你写代码"这种程度`;

// ========== 示例数据 ==========
const EXAMPLES = [
  { emoji: '💰', text: '记账 app', desc: '记录每天花了多少钱' },
  { emoji: '📖', text: '读书笔记', desc: '收藏喜欢的书摘' },
  { emoji: '💪', text: '健身打卡', desc: '每天记录运动量' },
  { emoji: '🐱', text: '宠物喂养提醒', desc: '定时提醒喂猫粮' },
  { emoji: '🍅', text: '番茄钟', desc: '25分钟专注计时' },
  { emoji: '🍳', text: '家常菜谱', desc: '收藏拿手菜做法' },
  { emoji: '📝', text: '心情日记', desc: '每天写几句心情' },
  { emoji: '🗓️', text: '习惯养成', desc: '21天养成好习惯' }
];

// ========== 大模型入口 ==========
const AI_PLATFORMS = [
  {
    name: '豆包',
    url: 'https://www.doubao.com/chat/',
    color: '#4F46E5',
    desc: '字节跳动出品，最多人用'
  },
  {
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    color: '#536DFE',
    desc: '技术强，代码能力出色'
  },
  {
    name: 'Kimi',
    url: 'https://kimi.moonshot.cn/',
    color: '#7C3AED',
    desc: '擅长处理长文本'
  },
  {
    name: '通义千问',
    url: 'https://tongyi.aliyun.com/qianwen/',
    color: '#FF6A00',
    desc: '阿里巴巴出品'
  }
];

// ========== Prompt 生成函数 ==========
function generatePrompt(userInput) {
  return PROMPT_TEMPLATE.replace('{{USER_INPUT}}', userInput.trim());
}
```

---

## 步骤 4：更新 js/storage.js

保持现有逻辑基本不变，但存储字段从 `markdown` 改为 `prompt`：

```javascript
const STORAGE_KEY = 'ai_coach_lite_history';
const MAX_HISTORY = 20;

const Storage = {
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  save(idea, prompt) {
    const list = this.getAll();
    const item = {
      id: Date.now(),
      idea: idea,
      prompt: prompt,
      time: new Date().toISOString()
    };
    list.unshift(item);
    if (list.length > MAX_HISTORY) list.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return item;
  },

  remove(id) {
    const list = this.getAll().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  getById(id) {
    return this.getAll().find(item => item.id === id) || null;
  }
};
```

---

## 步骤 5：删除不需要的文件

- 删除 `js/api.js`
- 删除 `.env`（如果存在）
- 删除 `js/prompts.js`（注意：旧文件叫 prompts.js 带 s，新文件叫 prompt.js 不带 s）

---

## 步骤 6：重写 index.html

完全替换 index.html。**不引入 marked.js，不引入 api.js**。

JS 引入顺序：`js/prompt.js` → `js/storage.js` → `js/app.js`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>起步 · 一句话生成项目设计书</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app">

    <!-- 头部 -->
    <header class="header">
      <div class="header-badge">AI 项目设计书助手</div>
      <h1 class="header-title">起步</h1>
      <p class="header-subtitle">一句话想法，一份专业设计书</p>
    </header>

    <!-- 输入区域 -->
    <section class="input-section">
      <div class="input-card">
        <textarea id="ideaInput"
          placeholder="描述你的想法，比如：我想做一个记账的 app..."
          rows="3"
          maxlength="500"></textarea>
        <div class="input-footer">
          <span class="char-count"><span id="charCount">0</span>/500</span>
          <button id="generateBtn" class="btn-primary">
            <span class="btn-icon">✨</span> 生成 Prompt
          </button>
        </div>
      </div>
    </section>

    <!-- 示例灵感墙 -->
    <section class="examples-section">
      <p class="section-label">💡 不知道做什么？试试这些</p>
      <div class="examples-grid" id="examplesGrid">
        <!-- 由 app.js 渲染 -->
      </div>
    </section>

    <!-- Prompt 输出区域（初始隐藏） -->
    <section class="output-section" id="outputSection" style="display:none;">
      <div class="output-card">
        <div class="output-header">
          <h2>🎯 你的专属 Prompt 已生成</h2>
          <p class="output-idea" id="outputIdea"></p>
        </div>
        <div class="output-prompt" id="outputPrompt">
          <!-- 生成的 Prompt 文本显示在这里 -->
        </div>
        <div class="output-actions">
          <button id="copyBtn" class="btn-copy">
            <span id="copyText">📋 一键复制 Prompt</span>
          </button>
        </div>

        <!-- 使用步骤提示 -->
        <div class="steps-hint">
          <div class="step-item">
            <span class="step-num">①</span>
            <span>点击上方按钮复制 Prompt</span>
          </div>
          <div class="step-item">
            <span class="step-num">②</span>
            <span>打开下方任意一个 AI 对话</span>
          </div>
          <div class="step-item">
            <span class="step-num">③</span>
            <span>粘贴 Prompt，发送，即可得到设计书</span>
          </div>
        </div>

        <!-- 大模型入口 -->
        <div class="ai-platforms" id="aiPlatforms">
          <!-- 由 app.js 渲染 -->
        </div>
      </div>
    </section>

    <!-- 历史记录区域 -->
    <section class="history-section" id="historySection" style="display:none;">
      <p class="section-label">📋 历史记录</p>
      <div class="history-list" id="historyList">
        <!-- 由 app.js 渲染 -->
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <p>哲学园出品</p>
      <p>想要更专业的设计书？试试 <a href="https://builder.zhexueyuan.com" target="_blank">进阶版 →</a></p>
    </footer>

  </div>

  <script src="js/prompt.js"></script>
  <script src="js/storage.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## 步骤 7：重写 js/app.js

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // DOM 引用
  const ideaInput = document.getElementById('ideaInput');
  const charCount = document.getElementById('charCount');
  const generateBtn = document.getElementById('generateBtn');
  const examplesGrid = document.getElementById('examplesGrid');
  const outputSection = document.getElementById('outputSection');
  const outputIdea = document.getElementById('outputIdea');
  const outputPrompt = document.getElementById('outputPrompt');
  const copyBtn = document.getElementById('copyBtn');
  const copyText = document.getElementById('copyText');
  const aiPlatforms = document.getElementById('aiPlatforms');
  const historySection = document.getElementById('historySection');
  const historyList = document.getElementById('historyList');

  let currentPrompt = '';

  // ========== 字数统计 ==========
  ideaInput.addEventListener('input', () => {
    charCount.textContent = ideaInput.value.length;
  });

  // ========== Ctrl+Enter 快捷键 ==========
  ideaInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  });

  // ========== 示例灵感墙 ==========
  function renderExamples() {
    examplesGrid.innerHTML = EXAMPLES.map(ex =>
      `<div class="example-card" data-text="${ex.text}">
        <span class="example-emoji">${ex.emoji}</span>
        <span class="example-text">${ex.text}</span>
        <span class="example-desc">${ex.desc}</span>
      </div>`
    ).join('');

    examplesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.example-card');
      if (card) {
        ideaInput.value = card.dataset.text;
        charCount.textContent = card.dataset.text.length;
        ideaInput.focus();
      }
    });
  }

  // ========== 大模型入口 ==========
  function renderPlatforms() {
    aiPlatforms.innerHTML = AI_PLATFORMS.map(p =>
      `<a href="${p.url}" target="_blank" class="platform-btn" style="--platform-color: ${p.color}">
        <span class="platform-name">${p.name}</span>
        <span class="platform-desc">${p.desc}</span>
      </a>`
    ).join('');
  }

  // ========== 生成 Prompt ==========
  generateBtn.addEventListener('click', handleGenerate);

  function handleGenerate() {
    const idea = ideaInput.value.trim();
    if (!idea) {
      ideaInput.classList.add('shake');
      setTimeout(() => ideaInput.classList.remove('shake'), 400);
      ideaInput.focus();
      return;
    }

    // 生成 Prompt（纯字符串拼接，瞬间完成）
    currentPrompt = generatePrompt(idea);

    // 显示输出区域
    outputSection.style.display = 'block';
    outputIdea.textContent = `💭 你的想法："${idea}"`;

    // 显示 Prompt 文本
    outputPrompt.textContent = currentPrompt;

    // 重置复制按钮状态
    copyText.textContent = '📋 一键复制 Prompt';

    // 滚动到输出区域
    setTimeout(() => {
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // 保存到历史记录
    Storage.save(idea, currentPrompt);
    renderHistory();
  }

  // ========== 复制功能 ==========
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt);
      copyText.textContent = '✅ 已复制！去 AI 对话粘贴吧';
      setTimeout(() => {
        copyText.textContent = '📋 一键复制 Prompt';
      }, 3000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = currentPrompt;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyText.textContent = '✅ 已复制！去 AI 对话粘贴吧';
      setTimeout(() => {
        copyText.textContent = '📋 一键复制 Prompt';
      }, 3000);
    }
  });

  // ========== 历史记录 ==========
  function renderHistory() {
    const list = Storage.getAll();
    if (list.length === 0) {
      historySection.style.display = 'none';
      return;
    }
    historySection.style.display = 'block';
    historyList.innerHTML = list.map(item => {
      const date = new Date(item.time).toLocaleDateString('zh-CN');
      return `<div class="history-item" data-id="${item.id}">
        <span class="history-idea">${item.idea}</span>
        <span class="history-date">${date}</span>
      </div>`;
    }).join('');
  }

  // 点击历史记录
  historyList.addEventListener('click', (e) => {
    const historyItem = e.target.closest('.history-item');
    if (!historyItem) return;
    const id = Number(historyItem.dataset.id);
    const item = Storage.getById(id);
    if (item) {
      currentPrompt = item.prompt;
      outputSection.style.display = 'block';
      outputIdea.textContent = `💭 你的想法："${item.idea}"`;
      outputPrompt.textContent = item.prompt;
      copyText.textContent = '📋 一键复制 Prompt';
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ========== 初始化 ==========
  renderExamples();
  renderPlatforms();
  renderHistory();
});
```

---

## 步骤 8：重写 css/style.css

### 设计风格：高级感、柔和渐变、毛玻璃质感

### CSS 变量：

```css
:root {
  --color-primary: #6366F1;
  --color-primary-light: #818CF8;
  --color-primary-dark: #4F46E5;
  --color-accent: #EC4899;
  --color-bg-start: #EEF2FF;
  --color-bg-end: #F5F3FF;
  --color-card: rgba(255, 255, 255, 0.72);
  --color-card-solid: #FFFFFF;
  --color-text: #1E1B4B;
  --color-text-secondary: #6B7280;
  --color-text-light: #9CA3AF;
  --color-border: rgba(99, 102, 241, 0.12);
  --color-success: #10B981;
  --shadow-sm: 0 1px 3px rgba(99, 102, 241, 0.08);
  --shadow-md: 0 8px 25px rgba(99, 102, 241, 0.1);
  --shadow-lg: 0 20px 50px rgba(99, 102, 241, 0.12);
  --blur: blur(20px);
  --radius: 16px;
  --radius-sm: 10px;
  --max-width: 700px;
  --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}
```

### 各区域样式详细要求：

**全局 & body**：
- `*, *::before, *::after { box-sizing: border-box; }`
- body: `margin: 0`，`background: linear-gradient(135deg, var(--color-bg-start) 0%, var(--color-bg-end) 50%, #FDF2F8 100%)`，`min-height: 100vh`，`font-family: var(--font-main)`，`color: var(--color-text)`，`line-height: 1.6`
- `#app`: `max-width: var(--max-width)`，`margin: 0 auto`，`padding: 24px 20px`

**header**：
- 居中对齐，`padding: 48px 0 32px`
- `header-badge`：`display: inline-block`，`background: linear-gradient(135deg, var(--color-primary), var(--color-accent))`，白色文字，`font-size: 12px`，`padding: 4px 14px`，`border-radius: 20px`，`letter-spacing: 1px`，`margin-bottom: 16px`，`font-weight: 500`
- `header-title`：`font-size: 2.8em`，`font-weight: 800`，`background: linear-gradient(135deg, var(--color-primary), var(--color-accent))`，`-webkit-background-clip: text`，`-webkit-text-fill-color: transparent`，`background-clip: text`，`margin: 0`，`line-height: 1.2`
- `header-subtitle`：`font-size: 1.15em`，`color: var(--color-text-secondary)`，`margin: 10px 0 0`，`font-weight: 400`

**input-section**：
- `input-card`：`background: var(--color-card)`，`backdrop-filter: var(--blur)`，`-webkit-backdrop-filter: var(--blur)`，`border: 1px solid var(--color-border)`，`border-radius: var(--radius)`，`padding: 20px`，`box-shadow: var(--shadow-md)`
- textarea：`width: 100%`，`border: none`，`outline: none`，`font-size: 16px`，`resize: none`，`background: transparent`，`font-family: var(--font-main)`，`color: var(--color-text)`，`line-height: 1.6`
- textarea `::placeholder`：`color: var(--color-text-light)`
- `input-footer`：`display: flex`，`justify-content: space-between`，`align-items: center`，`margin-top: 12px`
- `char-count`：`font-size: 13px`，`color: var(--color-text-light)`
- `btn-primary`：`background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))`，白色文字，`border: none`，`padding: 10px 24px`，`border-radius: var(--radius-sm)`，`font-size: 15px`，`font-weight: 600`，`cursor: pointer`，`transition: all 0.2s ease`，`box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3)`，`display: flex`，`align-items: center`，`gap: 4px`
- `btn-primary:hover`：`transform: translateY(-1px)`，`box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4)`
- `btn-primary:active`：`transform: translateY(0)`

**抖动动画**（空输入提示）：
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
.shake { animation: shake 0.4s ease; }
```

**examples-section**：
- `margin-top: 32px`
- `section-label`：`font-size: 14px`，`color: var(--color-text-secondary)`，`margin-bottom: 14px`，`font-weight: 500`
- `examples-grid`：`display: grid`，`grid-template-columns: repeat(4, 1fr)`，`gap: 10px`
- `example-card`：`background: var(--color-card)`，`backdrop-filter: var(--blur)`，`-webkit-backdrop-filter: var(--blur)`，`border: 1px solid var(--color-border)`，`border-radius: var(--radius-sm)`，`padding: 14px 10px`，`cursor: pointer`，`transition: all 0.2s ease`，`text-align: center`，`display: flex`，`flex-direction: column`，`gap: 4px`
- `example-card:hover`：`border-color: var(--color-primary-light)`，`transform: translateY(-2px)`，`box-shadow: var(--shadow-md)`
- `example-emoji`：`font-size: 24px`，`line-height: 1.2`
- `example-text`：`font-size: 14px`，`font-weight: 600`，`color: var(--color-text)`
- `example-desc`：`font-size: 12px`，`color: var(--color-text-light)`

**output-section**：
- `margin-top: 36px`
- `output-card`：`background: var(--color-card-solid)`，`border-radius: var(--radius)`，`padding: 28px 24px`，`box-shadow: var(--shadow-lg)`，`border: 1px solid var(--color-border)`
- `output-header h2`：`font-size: 1.2em`，`margin: 0 0 6px`，`font-weight: 700`
- `output-idea`：`font-size: 14px`，`color: var(--color-text-secondary)`，`font-style: italic`，`margin: 0 0 20px`
- `output-prompt`：`background: #F8FAFC`，`border: 1px solid #E2E8F0`，`border-radius: var(--radius-sm)`，`padding: 20px`，`font-size: 14px`，`line-height: 1.8`，`color: #334155`，`white-space: pre-wrap`，`word-break: break-word`，`max-height: 400px`，`overflow-y: auto`
- `output-actions`：`margin-top: 20px`，`text-align: center`
- `btn-copy`：`width: 100%`，`padding: 14px`，`background: linear-gradient(135deg, var(--color-primary), var(--color-accent))`，白色文字，`border: none`，`border-radius: var(--radius-sm)`，`font-size: 16px`，`font-weight: 600`，`cursor: pointer`，`transition: all 0.2s ease`，`box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35)`
- `btn-copy:hover`：`transform: translateY(-1px)`，`box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45)`

**steps-hint**：
- `margin-top: 24px`，`padding: 18px`，`background: linear-gradient(135deg, #EEF2FF, #FDF2F8)`，`border-radius: var(--radius-sm)`
- `step-item`：`display: flex`，`align-items: center`，`gap: 10px`，`padding: 6px 0`，`font-size: 14px`，`color: var(--color-text-secondary)`
- `step-num`：`font-weight: 700`，`color: var(--color-primary)`，`font-size: 16px`，`flex-shrink: 0`

**ai-platforms**：
- `margin-top: 20px`，`display: grid`，`grid-template-columns: repeat(2, 1fr)`，`gap: 10px`
- `platform-btn`：`display: flex`，`flex-direction: column`，`align-items: center`，`padding: 16px 12px`，`border-radius: var(--radius-sm)`，`border: 2px solid var(--color-border)`，`background: var(--color-card-solid)`，`text-decoration: none`，`color: var(--color-text)`，`transition: all 0.2s ease`，`cursor: pointer`
- `platform-btn:hover`：`border-color: var(--platform-color)`，`transform: translateY(-2px)`，`box-shadow: 0 8px 20px rgba(0,0,0,0.08)`
- `platform-name`：`font-size: 16px`，`font-weight: 700`
- `platform-desc`：`font-size: 12px`，`color: var(--color-text-light)`，`margin-top: 4px`

**history-section**：
- `margin-top: 40px`
- `history-item`：`display: flex`，`justify-content: space-between`，`align-items: center`，`padding: 14px 16px`，`background: var(--color-card)`，`backdrop-filter: var(--blur)`，`-webkit-backdrop-filter: var(--blur)`，`border: 1px solid var(--color-border)`，`border-radius: var(--radius-sm)`，`margin-bottom: 8px`，`cursor: pointer`，`transition: all 0.2s ease`
- `history-item:hover`：`transform: translateX(4px)`，`border-color: var(--color-primary-light)`
- `history-idea`：`font-size: 14px`，`font-weight: 500`，`overflow: hidden`，`text-overflow: ellipsis`，`white-space: nowrap`，`margin-right: 12px`
- `history-date`：`font-size: 12px`，`color: var(--color-text-light)`，`white-space: nowrap`，`flex-shrink: 0`

**footer**：
- `text-align: center`，`margin-top: 60px`，`padding: 24px 0`，`font-size: 13px`，`color: var(--color-text-light)`
- `footer p`：`margin: 6px 0`
- `footer a`：`color: var(--color-primary)`，`text-decoration: none`，`font-weight: 500`
- `footer a:hover`：`text-decoration: underline`

**响应式（max-width: 480px）**：
- `#app`：`padding: 16px`
- `.header`：`padding: 32px 0 24px`
- `.header-title`：`font-size: 2.2em`
- `.examples-grid`：`grid-template-columns: repeat(2, 1fr)`
- `.output-card`：`padding: 20px 16px`
- `.ai-platforms` 保持 2 列

---

## 验收标准

1. ✅ 页面有高级感（渐变背景、毛玻璃卡片、渐变按钮、微动画）
2. ✅ 输入"记账app"，点"生成 Prompt"，瞬间显示完整 Prompt
3. ✅ Prompt 内容包含用户输入的想法 + 6 个部分的要求
4. ✅ "一键复制 Prompt" 可用，复制后文字变为确认提示
5. ✅ 4 个大模型按钮显示正确，点击跳转到对应网页
6. ✅ ①②③ 使用步骤提示清晰可见
7. ✅ 8 个示例卡片可点击
8. ✅ 历史记录正常保存和回看
9. ✅ 空输入有抖动提示，Ctrl+Enter 可触发
10. ✅ 手机宽度（375px）下布局正常
11. ✅ 不存在 api.js、.env、prompts.js（带s的旧文件）
12. ✅ `git commit -m "task01: 重构为 Prompt 生成器 + 高级感 UI"`

## 不要做的事

- ❌ 不要调用任何 AI API
- ❌ 不要引入 marked.js 或任何外部 JS 库
- ❌ 不要创建 functions/ 目录
- ❌ 不要创建 wrangler 配置文件
- ❌ 不要 git push
