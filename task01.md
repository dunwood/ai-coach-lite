# Task 01: 小白版全面重构 — 深色主题 + 全流程 4 步 + Prompt 生成器

## 任务目标
完全重写 ai-coach-lite 项目。产品定位从"只生成设计书"升级为"从想法到上线的全流程引导"。UI 风格与进阶版统一（深色主题），每一步都为用户生成对应的专业 Prompt，用户复制到免费大模型或代码 Agent 中执行。

**不调用任何 AI API，整个产品是纯静态页面。**

---

## 项目信息

| 项 | 值 |
|---|---|
| 本地目录 | `D:\AI Project\ai-coach-lite` |
| GitHub 仓库 | `dunwood/ai-coach-lite` |
| 子域名 | `start.zhexueyuan.com` |
| 技术栈 | 纯 HTML + JS + CSS，无框架、无构建工具、无 API 调用 |
| 进阶版参考 | `builder.zhexueyuan.com`（深色主题风格参照） |

---

## 产品全流程（4 步）

```
Step 1：想法 → 设计书        工具：大模型（豆包/DeepSeek/Kimi/通义千问）
Step 2：设计书 → 任务拆分     工具：大模型（同上）
Step 3：执行任务 → 写代码     工具：代码 Agent（TRAE 首推）
Step 4：部署上线             工具：代码 Agent（TRAE）+ 简明教程
```

每一步的交互模式：
1. 页面告诉用户这一步要做什么
2. 用户输入/粘贴内容（第1步是想法，第2步是设计书，第3步是任务列表...）
3. 系统用 JS 模板拼接，瞬间生成一段专业 Prompt
4. 用户点"复制"，去对应工具粘贴执行
5. 得到结果后，进入下一步

---

## 文件结构

```
ai-coach-lite/
├── index.html          # 唯一页面（单页应用，4 步都在这里）
├── css/
│   └── style.css       # 全部样式（深色主题）
├── js/
│   ├── app.js          # 主逻辑（步骤流转、UI 状态、事件绑定）
│   ├── prompts.js      # 4 步的 Prompt 模板 + 拼接逻辑 + 示例数据 + 工具数据
│   └── storage.js      # localStorage 历史记录
├── CLAUDE.md
└── .gitignore
```

---

## 步骤 1：更新 CLAUDE.md

用以下内容**完全替换**现有 CLAUDE.md：

```markdown
# AI Coach Lite (起步 · 零基础 AI 项目导航)

## 项目概述
"起步" —— 零基础用户的 AI 项目全流程导航。从一句话想法到项目上线，分 4 步引导，每步生成专业 Prompt，用户复制到免费工具执行。
纯静态网站，不调用任何 AI API。

## 技术栈
- 纯 HTML + JS + CSS，深色主题
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
│   └── style.css       # 深色主题样式
├── js/
│   ├── app.js          # 主逻辑
│   ├── prompts.js      # Prompt 模板 + 工具数据
│   └── storage.js      # localStorage
├── CLAUDE.md
└── .gitignore

## 编码规范
- UTF-8 编码，2 空格缩进，中文注释
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

---

## 步骤 3：创建 js/prompts.js

### 3.1 四步 Prompt 模板

```javascript
// ========== Step 1: 想法 → 设计书 ==========
const PROMPT_STEP1 = `你是一个资深产品经理，擅长把模糊的想法变成清晰的产品方案。你同时也是 AI 辅助开发领域的专家，深知如何让零基础的人通过 AI 工具完成软件开发。

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

// ========== Step 2: 设计书 → 任务拆分 ==========
const PROMPT_STEP2 = `你是一个经验丰富的项目经理，擅长把产品设计书拆解成具体的开发任务。

以下是用户的产品设计书：
"""
{{USER_INPUT}}
"""

请把这份设计书拆解成可以逐个执行的任务列表。每个任务将由 AI 编程工具（如 TRAE）自动执行。

要求：
1. 按执行顺序排列，编号 task01、task02、task03...
2. 每个任务包含：
   - 任务标题（一句话说明做什么）
   - 具体要求（需要创建哪些文件、实现什么功能、验收标准）
   - 预计文件变动（新建/修改哪些文件）
3. 第一个任务必须是"项目初始化 + 基础页面骨架"
4. 最后一个任务必须是"测试 + 部署准备"
5. 总共不超过 8 个任务
6. 每个任务的粒度要适中：一个任务大约 30 分钟能完成
7. 技术栈默认用纯 HTML + JS + CSS，不用任何框架
8. 语言通俗，让不懂编程的人也能看懂每个任务在做什么`;

// ========== Step 3: 执行任务（给代码 Agent 的指令）==========
const PROMPT_STEP3 = `请读取以下任务描述，按照要求执行：

{{USER_INPUT}}

执行要求：
1. 严格按照任务描述创建或修改文件
2. 每个文件写完整代码，不要用省略号
3. 完成后列出所有创建/修改的文件清单
4. 如果遇到不明确的地方，按照最佳实践自行决定，不要反问`;

// ========== Step 4: 部署上线 ==========
const PROMPT_STEP4 = `我有一个纯静态网站项目（HTML + JS + CSS），需要部署上线让别人能访问。

项目情况：
{{USER_INPUT}}

请帮我完成以下操作：
1. 初始化 git 仓库（如果还没有）
2. 把所有代码提交到 git
3. 告诉我如何推送到 GitHub
4. 告诉我如何在 Cloudflare Pages 上免费部署（给出详细步骤）
5. 如果有自定义域名，告诉我怎么配置

要求：
- 每一步都给出具体命令或操作步骤
- 假设我完全不懂技术，请解释每个步骤在做什么
- 如果你能直接执行 git 命令，请直接执行`;
```

### 3.2 示例数据

```javascript
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
```

### 3.3 工具推荐数据

```javascript
// 大模型（用于 Step 1、Step 2 的文本生成）
const AI_MODELS = [
  {
    name: '豆包',
    url: 'https://www.doubao.com/chat/',
    desc: '字节跳动出品，最多人用',
    icon: '🫧'
  },
  {
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    desc: '技术强，代码能力出色',
    icon: '🔍'
  },
  {
    name: 'Kimi',
    url: 'https://kimi.moonshot.cn/',
    desc: '擅长处理长文本',
    icon: '🌙'
  },
  {
    name: '通义千问',
    url: 'https://tongyi.aliyun.com/qianwen/',
    desc: '阿里巴巴出品',
    icon: '🌐'
  }
];

// 代码 Agent（用于 Step 3、Step 4 的代码执行）
const CODE_AGENTS = [
  {
    name: 'TRAE',
    url: 'https://www.trae.com.cn/download',
    desc: '字节出品，免费，中文界面，零基础首选',
    icon: '⚡',
    highlight: true  // 首推标记
  },
  {
    name: '通义灵码',
    url: 'https://tongyi.aliyun.com/lingma/',
    desc: '阿里出品，VS Code 插件',
    icon: '🧩',
    highlight: false
  }
];
```

### 3.4 Prompt 生成函数

```javascript
function generatePrompt(step, userInput) {
  const templates = {
    1: PROMPT_STEP1,
    2: PROMPT_STEP2,
    3: PROMPT_STEP3,
    4: PROMPT_STEP4
  };
  return templates[step].replace('{{USER_INPUT}}', userInput.trim());
}
```

---

## 步骤 4：更新 js/storage.js

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

  save(idea, step, prompt) {
    const list = this.getAll();
    const item = {
      id: Date.now(),
      idea: idea,
      step: step,
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

- 删除 `js/api.js`（如果存在）
- 删除 `js/prompt.js`（旧的单数文件名，新文件叫 prompts.js 带 s）
- 删除 `.env`（如果存在）

---

## 步骤 6：重写 index.html

**注意**：不引入任何外部 JS 库。JS 引入顺序：`js/prompts.js` → `js/storage.js` → `js/app.js`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>起步 · 零基础 AI 项目导航</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app">

    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <span class="navbar-brand">起步 · 零基础版</span>
      <a href="https://builder.zhexueyuan.com" target="_blank" class="navbar-link">进阶版</a>
    </nav>

    <!-- Hero 区域（首页状态） -->
    <section class="hero" id="heroSection">
      <div class="hero-badge">零基础用户的 AI 项目导航</div>
      <h1 class="hero-title">把你的软件想法<br>一步步变成真正的产品</h1>
      <p class="hero-desc">不需要会写代码。这里手把手教你：如何把想法整理成设计书，如何用 AI 编程工具把设计书变成能运行的产品——每一步都有指导，所有操作在你自己的电脑和 AI 工具中完成。</p>
      <button id="startBtn" class="btn-hero">开始做项目</button>
    </section>

    <!-- 进度条（进入流程后显示） -->
    <section class="progress-bar" id="progressBar" style="display:none;">
      <div class="progress-steps">
        <div class="progress-step active" data-step="1">
          <span class="step-number">1</span>
          <span class="step-label">想法→设计书</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step" data-step="2">
          <span class="step-number">2</span>
          <span class="step-label">设计书→拆任务</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step" data-step="3">
          <span class="step-number">3</span>
          <span class="step-label">执行任务→写代码</span>
        </div>
        <div class="progress-line"></div>
        <div class="progress-step" data-step="4">
          <span class="step-number">4</span>
          <span class="step-label">部署上线</span>
        </div>
      </div>
    </section>

    <!-- Step 1：想法 → 设计书 -->
    <section class="step-section" id="step1" style="display:none;">
      <div class="step-card">
        <div class="step-header">
          <h2>第一步：把想法变成设计书</h2>
          <p class="step-desc">用一句话描述你想做的东西，我们帮你生成一段专业的 Prompt。你把它复制到 AI 对话工具里，就能得到一份完整的设计书。</p>
        </div>

        <textarea id="step1Input"
          placeholder="描述你的想法，比如：我想做一个记账的 app..."
          rows="3"
          maxlength="500"></textarea>
        <div class="input-footer">
          <span class="char-count"><span id="charCount">0</span>/500</span>
          <button id="step1GenBtn" class="btn-primary">✨ 生成 Prompt</button>
        </div>

        <!-- 示例灵感墙 -->
        <div class="examples-area">
          <p class="examples-title">💡 不知道做什么？试试这些：</p>
          <div class="examples-grid" id="examplesGrid"></div>
        </div>
      </div>
    </section>

    <!-- Step 2：设计书 → 任务拆分 -->
    <section class="step-section" id="step2" style="display:none;">
      <div class="step-card">
        <div class="step-header">
          <h2>第二步：把设计书拆成任务</h2>
          <p class="step-desc">把上一步在 AI 中得到的设计书粘贴到下面，我们生成"任务拆分 Prompt"，再复制到 AI 中执行。</p>
        </div>

        <textarea id="step2Input"
          placeholder="把 AI 生成的设计书粘贴到这里..."
          rows="8"></textarea>
        <div class="input-footer">
          <button id="step2GenBtn" class="btn-primary">✨ 生成任务拆分 Prompt</button>
        </div>
      </div>
    </section>

    <!-- Step 3：执行任务 → 写代码 -->
    <section class="step-section" id="step3" style="display:none;">
      <div class="step-card">
        <div class="step-header">
          <h2>第三步：让 AI 帮你写代码</h2>
          <p class="step-desc">把上一步得到的任务列表粘贴到下面。我们为每个任务生成"执行指令"，你复制到 <strong>TRAE</strong>（代码编辑器）中，AI 会自动帮你创建文件、写代码。</p>
          <div class="step-tip">
            <strong>⚡ 重要：</strong>这一步需要用<strong>代码 Agent</strong>（推荐 TRAE），不是大模型对话。代码 Agent 可以直接在你电脑上创建文件和运行代码。
          </div>
        </div>

        <textarea id="step3Input"
          placeholder="把 AI 生成的任务列表粘贴到这里...&#10;&#10;提示：你可以一次粘贴一个 task，也可以全部粘贴"
          rows="8"></textarea>
        <div class="input-footer">
          <button id="step3GenBtn" class="btn-primary">✨ 生成执行指令</button>
        </div>
      </div>
    </section>

    <!-- Step 4：部署上线 -->
    <section class="step-section" id="step4" style="display:none;">
      <div class="step-card">
        <div class="step-header">
          <h2>第四步：部署上线</h2>
          <p class="step-desc">代码写完了！现在把项目部署到网上，让别人也能访问。把你的项目情况告诉我们，生成部署指令。</p>
        </div>

        <textarea id="step4Input"
          placeholder="简单描述你的项目情况，比如：&#10;- 项目文件夹在 D:\my-project&#10;- 纯 HTML+JS 项目&#10;- 想部署到免费服务器上"
          rows="6"></textarea>
        <div class="input-footer">
          <button id="step4GenBtn" class="btn-primary">✨ 生成部署指令</button>
        </div>
      </div>
    </section>

    <!-- Prompt 输出区域（通用，每一步共用） -->
    <section class="output-section" id="outputSection" style="display:none;">
      <div class="output-card">
        <div class="output-header">
          <h3>🎯 Prompt 已生成</h3>
        </div>
        <div class="output-prompt" id="outputPrompt"></div>
        <div class="output-actions">
          <button id="copyBtn" class="btn-copy">
            <span id="copyText">📋 一键复制 Prompt</span>
          </button>
        </div>

        <!-- 使用步骤提示 -->
        <div class="steps-hint" id="stepsHint">
          <!-- 由 app.js 根据当前步骤动态填充 -->
        </div>

        <!-- 工具入口（由 app.js 根据当前步骤动态切换：大模型 or 代码 Agent） -->
        <div class="tools-area" id="toolsArea"></div>

        <!-- 下一步按钮 -->
        <div class="next-step-area" id="nextStepArea" style="display:none;">
          <button id="nextStepBtn" class="btn-next">完成这一步，进入下一步 →</button>
        </div>
      </div>
    </section>

    <!-- 完成页面 -->
    <section class="done-section" id="doneSection" style="display:none;">
      <div class="done-card">
        <div class="done-icon">🎉</div>
        <h2>恭喜！你的项目已经上线了</h2>
        <p>从一句话想法到真正运行的产品，你做到了！</p>
        <div class="done-actions">
          <button id="restartBtn" class="btn-primary">开始新项目</button>
          <a href="https://builder.zhexueyuan.com" target="_blank" class="btn-secondary-link">想深入学习？试试进阶版 →</a>
        </div>
      </div>
    </section>

    <!-- 历史记录 -->
    <section class="history-section" id="historySection" style="display:none;">
      <p class="section-label">📋 历史记录</p>
      <div class="history-list" id="historyList"></div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <p>哲学园出品</p>
      <p>想要更专业的全流程？试试 <a href="https://builder.zhexueyuan.com" target="_blank">进阶版 →</a></p>
    </footer>

  </div>

  <script src="js/prompts.js"></script>
  <script src="js/storage.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

---

## 步骤 7：重写 js/app.js

这是最复杂的文件，负责 4 步流程的流转。

### 核心逻辑：

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // ========== DOM 引用 ==========
  const heroSection = document.getElementById('heroSection');
  const progressBar = document.getElementById('progressBar');
  const startBtn = document.getElementById('startBtn');
  const outputSection = document.getElementById('outputSection');
  const outputPrompt = document.getElementById('outputPrompt');
  const copyBtn = document.getElementById('copyBtn');
  const copyText = document.getElementById('copyText');
  const stepsHint = document.getElementById('stepsHint');
  const toolsArea = document.getElementById('toolsArea');
  const nextStepArea = document.getElementById('nextStepArea');
  const nextStepBtn = document.getElementById('nextStepBtn');
  const doneSection = document.getElementById('doneSection');
  const restartBtn = document.getElementById('restartBtn');
  const historySection = document.getElementById('historySection');
  const historyList = document.getElementById('historyList');

  // Step 1
  const step1 = document.getElementById('step1');
  const step1Input = document.getElementById('step1Input');
  const charCount = document.getElementById('charCount');
  const step1GenBtn = document.getElementById('step1GenBtn');
  const examplesGrid = document.getElementById('examplesGrid');

  // Step 2
  const step2 = document.getElementById('step2');
  const step2Input = document.getElementById('step2Input');
  const step2GenBtn = document.getElementById('step2GenBtn');

  // Step 3
  const step3 = document.getElementById('step3');
  const step3Input = document.getElementById('step3Input');
  const step3GenBtn = document.getElementById('step3GenBtn');

  // Step 4
  const step4 = document.getElementById('step4');
  const step4Input = document.getElementById('step4Input');
  const step4GenBtn = document.getElementById('step4GenBtn');

  let currentStep = 0;
  let currentPrompt = '';
  let currentIdea = '';

  // ========== 进入流程 ==========
  startBtn.addEventListener('click', () => {
    goToStep(1);
  });

  // ========== 步骤流转 ==========
  function goToStep(step) {
    currentStep = step;

    // 隐藏所有区域
    heroSection.style.display = 'none';
    step1.style.display = 'none';
    step2.style.display = 'none';
    step3.style.display = 'none';
    step4.style.display = 'none';
    outputSection.style.display = 'none';
    doneSection.style.display = 'none';

    // 显示进度条
    progressBar.style.display = 'block';
    updateProgressBar(step);

    // 显示对应步骤
    const stepElements = { 1: step1, 2: step2, 3: step3, 4: step4 };
    if (stepElements[step]) {
      stepElements[step].style.display = 'block';
      stepElements[step].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function updateProgressBar(activeStep) {
    document.querySelectorAll('.progress-step').forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.remove('active', 'done');
      if (s < activeStep) el.classList.add('done');
      if (s === activeStep) el.classList.add('active');
    });
  }

  // ========== Step 1 逻辑 ==========
  step1Input.addEventListener('input', () => {
    charCount.textContent = step1Input.value.length;
  });

  // Ctrl+Enter 快捷键
  step1Input.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate(1);
    }
  });

  step1GenBtn.addEventListener('click', () => handleGenerate(1));

  // 示例灵感墙
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
        step1Input.value = card.dataset.text;
        charCount.textContent = card.dataset.text.length;
        step1Input.focus();
      }
    });
  }

  // ========== Step 2/3/4 逻辑 ==========
  step2GenBtn.addEventListener('click', () => handleGenerate(2));
  step3GenBtn.addEventListener('click', () => handleGenerate(3));
  step4GenBtn.addEventListener('click', () => handleGenerate(4));

  // ========== 通用生成逻辑 ==========
  function handleGenerate(step) {
    const inputs = {
      1: step1Input,
      2: step2Input,
      3: step3Input,
      4: step4Input
    };
    const input = inputs[step];
    const value = input.value.trim();

    if (!value) {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 400);
      input.focus();
      return;
    }

    if (step === 1) currentIdea = value;

    // 生成 Prompt
    currentPrompt = generatePrompt(step, value);

    // 显示输出
    outputSection.style.display = 'block';
    outputPrompt.textContent = currentPrompt;
    copyText.textContent = '📋 一键复制 Prompt';

    // 根据步骤显示不同的提示和工具
    renderHint(step);
    renderTools(step);

    // 显示/隐藏下一步按钮
    if (step < 4) {
      nextStepArea.style.display = 'block';
    } else {
      nextStepArea.style.display = 'none';
      // Step 4 的"下一步"变成"完成"
      const doneBtn = document.createElement('button');
      doneBtn.className = 'btn-next';
      doneBtn.textContent = '🎉 我已经部署上线了！';
      doneBtn.addEventListener('click', () => {
        outputSection.style.display = 'none';
        doneSection.style.display = 'block';
        progressBar.style.display = 'none';
        doneSection.scrollIntoView({ behavior: 'smooth' });
      });
      nextStepArea.innerHTML = '';
      nextStepArea.appendChild(doneBtn);
      nextStepArea.style.display = 'block';
    }

    // 滚动到输出
    setTimeout(() => {
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // 保存历史
    Storage.save(currentIdea || value, step, currentPrompt);
    renderHistory();
  }

  // ========== 提示文案 ==========
  function renderHint(step) {
    const hints = {
      1: [
        { num: '①', text: '点击上方按钮复制 Prompt' },
        { num: '②', text: '打开下方任意一个 AI 对话工具' },
        { num: '③', text: '粘贴 Prompt 并发送，即可得到设计书' }
      ],
      2: [
        { num: '①', text: '复制 Prompt' },
        { num: '②', text: '打开 AI 对话工具，粘贴发送' },
        { num: '③', text: '得到任务列表后，进入下一步' }
      ],
      3: [
        { num: '①', text: '复制下方 Prompt' },
        { num: '②', text: '打开 TRAE（代码编辑器），粘贴到 AI 对话框' },
        { num: '③', text: 'TRAE 会自动在你电脑上创建文件、写代码' }
      ],
      4: [
        { num: '①', text: '复制 Prompt' },
        { num: '②', text: '在 TRAE 中粘贴执行' },
        { num: '③', text: 'AI 会帮你完成 git 提交和部署指引' }
      ]
    };
    stepsHint.innerHTML = hints[step].map(h =>
      `<div class="step-item"><span class="step-num">${h.num}</span><span>${h.text}</span></div>`
    ).join('');
  }

  // ========== 工具入口 ==========
  function renderTools(step) {
    const isCodeStep = step >= 3;
    const tools = isCodeStep ? CODE_AGENTS : AI_MODELS;
    const title = isCodeStep ? '推荐代码 Agent（可直接写代码）' : '推荐 AI 对话工具';

    toolsArea.innerHTML = `
      <p class="tools-title">${title}</p>
      <div class="tools-grid ${isCodeStep ? 'tools-grid-code' : ''}">
        ${tools.map(t => `
          <a href="${t.url}" target="_blank" class="tool-btn ${t.highlight ? 'tool-highlight' : ''}">
            <span class="tool-icon">${t.icon}</span>
            <span class="tool-name">${t.name}</span>
            <span class="tool-desc">${t.desc}</span>
            ${t.highlight ? '<span class="tool-badge">首推</span>' : ''}
          </a>
        `).join('')}
      </div>
    `;
  }

  // ========== 复制 ==========
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(currentPrompt);
      copyText.textContent = '✅ 已复制！去工具里粘贴吧';
      setTimeout(() => { copyText.textContent = '📋 一键复制 Prompt'; }, 3000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = currentPrompt;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyText.textContent = '✅ 已复制！去工具里粘贴吧';
      setTimeout(() => { copyText.textContent = '📋 一键复制 Prompt'; }, 3000);
    }
  });

  // ========== 下一步 ==========
  nextStepBtn.addEventListener('click', () => {
    if (currentStep < 4) {
      goToStep(currentStep + 1);
    }
  });

  // ========== 重新开始 ==========
  restartBtn.addEventListener('click', () => {
    currentStep = 0;
    currentPrompt = '';
    currentIdea = '';
    step1Input.value = '';
    step2Input.value = '';
    step3Input.value = '';
    step4Input.value = '';
    charCount.textContent = '0';
    doneSection.style.display = 'none';
    progressBar.style.display = 'none';
    heroSection.style.display = 'block';
    outputSection.style.display = 'none';
    window.scrollTo(0, 0);
  });

  // ========== 历史记录 ==========
  function renderHistory() {
    const list = Storage.getAll();
    if (list.length === 0) {
      historySection.style.display = 'none';
      return;
    }
    historySection.style.display = 'block';
    const stepNames = { 1: '设计书', 2: '拆任务', 3: '写代码', 4: '部署' };
    historyList.innerHTML = list.map(item => {
      const date = new Date(item.time).toLocaleDateString('zh-CN');
      return `<div class="history-item" data-id="${item.id}">
        <span class="history-idea">${item.idea}</span>
        <span class="history-step">第${item.step}步·${stepNames[item.step] || ''}</span>
        <span class="history-date">${date}</span>
      </div>`;
    }).join('');
  }

  historyList.addEventListener('click', (e) => {
    const historyItem = e.target.closest('.history-item');
    if (!historyItem) return;
    const id = Number(historyItem.dataset.id);
    const item = Storage.getById(id);
    if (item) {
      currentPrompt = item.prompt;
      outputSection.style.display = 'block';
      outputPrompt.textContent = item.prompt;
      copyText.textContent = '📋 一键复制 Prompt';
      renderHint(item.step);
      renderTools(item.step);
      nextStepArea.style.display = 'none';
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // ========== 初始化 ==========
  renderExamples();
  renderHistory();
});
```

---

## 步骤 8：重写 css/style.css

### 设计风格：深色主题，与进阶版统一

### CSS 变量：

```css
:root {
  --color-bg: #0A0A0F;
  --color-bg-card: #141419;
  --color-bg-input: #1A1A22;
  --color-bg-hover: #1E1E28;
  --color-primary: #00E5C8;
  --color-primary-hover: #00FFE0;
  --color-primary-dim: rgba(0, 229, 200, 0.15);
  --color-text: #E8E8ED;
  --color-text-secondary: #8A8A9A;
  --color-text-dim: #5A5A6A;
  --color-border: #2A2A35;
  --color-border-light: #3A3A48;
  --color-accent: #7B61FF;
  --color-success: #00E676;
  --color-warning: #FFB800;
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 30px rgba(0, 229, 200, 0.1);
  --radius: 14px;
  --radius-sm: 8px;
  --max-width: 760px;
  --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}
```

### 各区域样式详细要求：

**全局 & body**：
- `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`
- body：`background: var(--color-bg)`，`color: var(--color-text)`，`font-family: var(--font-main)`，`line-height: 1.6`，`min-height: 100vh`
- `#app`：`max-width: var(--max-width)`，`margin: 0 auto`，`padding: 0 20px`

**navbar**：
- `display: flex`，`justify-content: space-between`，`align-items: center`，`padding: 20px 0`，`border-bottom: 1px solid var(--color-border)`
- `navbar-brand`：`font-weight: 700`，`font-size: 15px`，`color: var(--color-text)`
- `navbar-link`：`color: var(--color-text-secondary)`，`text-decoration: none`，`font-size: 14px`
- `navbar-link:hover`：`color: var(--color-primary)`

**hero**：
- `text-align: center`，`padding: 80px 0 60px`
- `hero-badge`：`display: inline-block`，`border: 1px solid var(--color-primary)`，`color: var(--color-primary)`，`font-size: 13px`，`padding: 6px 18px`，`border-radius: 20px`，`margin-bottom: 24px`，`letter-spacing: 1px`
- `hero-title`：`font-size: 2.6em`，`font-weight: 800`，`line-height: 1.3`，`margin-bottom: 20px`，`color: var(--color-text)`
- `hero-desc`：`font-size: 16px`，`color: var(--color-text-secondary)`，`line-height: 1.8`，`max-width: 600px`，`margin: 0 auto 36px`
- `btn-hero`：`display: inline-block`，`background: var(--color-primary)`，`color: var(--color-bg)`，`font-size: 18px`，`font-weight: 700`，`padding: 16px 48px`，`border: none`，`border-radius: var(--radius)`，`cursor: pointer`，`transition: all 0.2s`
- `btn-hero:hover`：`background: var(--color-primary-hover)`，`transform: translateY(-2px)`，`box-shadow: var(--shadow-glow)`

**progress-bar**：
- `padding: 24px 0`，`margin-bottom: 12px`
- `progress-steps`：`display: flex`，`align-items: center`，`justify-content: center`，`gap: 0`
- `progress-step`：`display: flex`，`flex-direction: column`，`align-items: center`，`gap: 6px`，`min-width: 80px`
- `step-number`：`width: 32px`，`height: 32px`，`border-radius: 50%`，`background: var(--color-bg-card)`，`border: 2px solid var(--color-border)`，`display: flex`，`align-items: center`，`justify-content: center`，`font-size: 14px`，`font-weight: 700`，`color: var(--color-text-dim)`
- `progress-step.active .step-number`：`border-color: var(--color-primary)`，`color: var(--color-primary)`，`background: var(--color-primary-dim)`
- `progress-step.done .step-number`：`border-color: var(--color-success)`，`color: var(--color-bg)`，`background: var(--color-success)`
- `step-label`：`font-size: 12px`，`color: var(--color-text-dim)`，`white-space: nowrap`
- `progress-step.active .step-label`：`color: var(--color-primary)`
- `progress-line`：`width: 40px`，`height: 2px`，`background: var(--color-border)`，`margin-bottom: 20px`

**step-card（通用步骤卡片）**：
- `background: var(--color-bg-card)`，`border: 1px solid var(--color-border)`，`border-radius: var(--radius)`，`padding: 28px 24px`，`box-shadow: var(--shadow-card)`
- `step-header h2`：`font-size: 1.3em`，`margin-bottom: 8px`，`color: var(--color-text)`
- `step-desc`：`font-size: 14px`，`color: var(--color-text-secondary)`，`line-height: 1.7`，`margin-bottom: 20px`
- `step-tip`：`background: var(--color-primary-dim)`，`border: 1px solid rgba(0,229,200,0.2)`，`border-radius: var(--radius-sm)`，`padding: 12px 16px`，`font-size: 13px`，`color: var(--color-primary)`，`margin-bottom: 16px`，`line-height: 1.6`

**textarea（通用输入框）**：
- `width: 100%`，`background: var(--color-bg-input)`，`border: 1px solid var(--color-border)`，`border-radius: var(--radius-sm)`，`padding: 16px`，`color: var(--color-text)`，`font-size: 15px`，`font-family: var(--font-main)`，`resize: vertical`，`outline: none`，`line-height: 1.6`
- `textarea:focus`：`border-color: var(--color-primary)`
- `textarea::placeholder`：`color: var(--color-text-dim)`

**input-footer**：
- `display: flex`，`justify-content: space-between`，`align-items: center`，`margin-top: 12px`
- `char-count`：`font-size: 13px`，`color: var(--color-text-dim)`

**btn-primary**：
- `background: var(--color-primary)`，`color: var(--color-bg)`，`border: none`，`padding: 10px 24px`，`border-radius: var(--radius-sm)`，`font-size: 15px`，`font-weight: 600`，`cursor: pointer`，`transition: all 0.2s`
- `btn-primary:hover`：`background: var(--color-primary-hover)`

**抖动动画**：
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

**examples-area**：
- `margin-top: 24px`，`padding-top: 20px`，`border-top: 1px solid var(--color-border)`
- `examples-title`：`font-size: 13px`，`color: var(--color-text-secondary)`，`margin-bottom: 12px`
- `examples-grid`：`display: grid`，`grid-template-columns: repeat(4, 1fr)`，`gap: 8px`
- `example-card`：`background: var(--color-bg-input)`，`border: 1px solid var(--color-border)`，`border-radius: var(--radius-sm)`，`padding: 12px 8px`，`cursor: pointer`，`text-align: center`，`transition: all 0.2s`，`display: flex`，`flex-direction: column`，`gap: 4px`
- `example-card:hover`：`border-color: var(--color-primary)`，`transform: translateY(-2px)`
- `example-emoji`：`font-size: 22px`
- `example-text`：`font-size: 13px`，`font-weight: 600`，`color: var(--color-text)`
- `example-desc`：`font-size: 11px`，`color: var(--color-text-dim)`

**output-card**：
- `background: var(--color-bg-card)`，`border: 1px solid var(--color-border)`，`border-radius: var(--radius)`，`padding: 28px 24px`，`box-shadow: var(--shadow-card)`，`margin-top: 20px`
- `output-header h3`：`font-size: 1.1em`，`margin-bottom: 16px`
- `output-prompt`：`background: var(--color-bg-input)`，`border: 1px solid var(--color-border)`，`border-radius: var(--radius-sm)`，`padding: 20px`，`font-size: 13px`，`line-height: 1.8`，`color: var(--color-text-secondary)`，`white-space: pre-wrap`，`word-break: break-word`，`max-height: 400px`，`overflow-y: auto`

**btn-copy**：
- `width: 100%`，`padding: 14px`，`background: var(--color-primary)`，`color: var(--color-bg)`，`border: none`，`border-radius: var(--radius-sm)`，`font-size: 16px`，`font-weight: 700`，`cursor: pointer`，`transition: all 0.2s`，`margin-top: 16px`
- `btn-copy:hover`：`background: var(--color-primary-hover)`

**steps-hint**：
- `margin-top: 20px`，`padding: 16px`，`background: rgba(0,229,200,0.05)`，`border-radius: var(--radius-sm)`，`border: 1px solid rgba(0,229,200,0.1)`
- `step-item`：`display: flex`，`align-items: center`，`gap: 10px`，`padding: 5px 0`，`font-size: 14px`，`color: var(--color-text-secondary)`
- `step-num`：`color: var(--color-primary)`，`font-weight: 700`，`font-size: 15px`

**tools-area**：
- `margin-top: 20px`
- `tools-title`：`font-size: 13px`，`color: var(--color-text-secondary)`，`margin-bottom: 10px`
- `tools-grid`：`display: grid`，`grid-template-columns: repeat(2, 1fr)`，`gap: 10px`
- `tool-btn`：`display: flex`，`flex-direction: column`，`align-items: center`，`padding: 16px 12px`，`border-radius: var(--radius-sm)`，`border: 1px solid var(--color-border)`，`background: var(--color-bg-input)`，`text-decoration: none`，`color: var(--color-text)`，`transition: all 0.2s`，`cursor: pointer`，`position: relative`
- `tool-btn:hover`：`border-color: var(--color-primary)`，`transform: translateY(-2px)`
- `tool-highlight`：`border-color: var(--color-primary)`，`background: var(--color-primary-dim)`
- `tool-icon`：`font-size: 24px`，`margin-bottom: 4px`
- `tool-name`：`font-size: 15px`，`font-weight: 700`
- `tool-desc`：`font-size: 11px`，`color: var(--color-text-dim)`，`margin-top: 2px`，`text-align: center`
- `tool-badge`：`position: absolute`，`top: -8px`，`right: -8px`，`background: var(--color-primary)`，`color: var(--color-bg)`，`font-size: 11px`，`font-weight: 700`，`padding: 2px 8px`，`border-radius: 10px`

**btn-next**：
- `width: 100%`，`padding: 14px`，`background: transparent`，`color: var(--color-primary)`，`border: 2px solid var(--color-primary)`，`border-radius: var(--radius-sm)`，`font-size: 15px`，`font-weight: 600`，`cursor: pointer`，`transition: all 0.2s`，`margin-top: 16px`
- `btn-next:hover`：`background: var(--color-primary-dim)`

**done-section**：
- `text-align: center`，`padding: 60px 0`
- `done-card`：`background: var(--color-bg-card)`，`border: 1px solid var(--color-border)`，`border-radius: var(--radius)`，`padding: 48px 32px`
- `done-icon`：`font-size: 64px`，`margin-bottom: 20px`
- `done-card h2`：`font-size: 1.5em`，`margin-bottom: 12px`
- `done-card p`：`color: var(--color-text-secondary)`，`margin-bottom: 28px`
- `done-actions`：`display: flex`，`flex-direction: column`，`gap: 12px`，`align-items: center`
- `btn-secondary-link`：`color: var(--color-text-secondary)`，`text-decoration: none`，`font-size: 14px`
- `btn-secondary-link:hover`：`color: var(--color-primary)`

**history-section**：
- `margin-top: 40px`
- `section-label`：`font-size: 14px`，`color: var(--color-text-secondary)`，`margin-bottom: 12px`
- `history-item`：`display: flex`，`align-items: center`，`gap: 12px`，`padding: 12px 16px`，`background: var(--color-bg-card)`，`border: 1px solid var(--color-border)`，`border-radius: var(--radius-sm)`，`margin-bottom: 6px`，`cursor: pointer`，`transition: all 0.2s`
- `history-item:hover`：`border-color: var(--color-primary)`
- `history-idea`：`flex: 1`，`font-size: 14px`，`overflow: hidden`，`text-overflow: ellipsis`，`white-space: nowrap`
- `history-step`：`font-size: 12px`，`color: var(--color-primary)`，`white-space: nowrap`
- `history-date`：`font-size: 12px`，`color: var(--color-text-dim)`，`white-space: nowrap`

**footer**：
- `text-align: center`，`margin-top: 60px`，`padding: 24px 0`，`border-top: 1px solid var(--color-border)`，`font-size: 13px`，`color: var(--color-text-dim)`
- `footer p`：`margin: 6px 0`
- `footer a`：`color: var(--color-primary)`，`text-decoration: none`
- `footer a:hover`：`text-decoration: underline`

**响应式（max-width: 480px）**：
- `#app`：`padding: 0 16px`
- `.hero`：`padding: 48px 0 36px`
- `.hero-title`：`font-size: 1.8em`
- `.btn-hero`：`padding: 14px 36px`，`font-size: 16px`
- `.examples-grid`：`grid-template-columns: repeat(2, 1fr)`
- `.step-card`：`padding: 20px 16px`
- `.output-card`：`padding: 20px 16px`
- `.progress-step`：`min-width: 60px`
- `.step-label`：`font-size: 10px`
- `.progress-line`：`width: 20px`

---

## 验收标准

1. ✅ 页面深色主题，与进阶版（builder.zhexueyuan.com）风格统一
2. ✅ 顶部导航栏显示"起步 · 零基础版"和"进阶版"链接
3. ✅ Hero 区域显示正确（标题、描述、"开始做项目"按钮）
4. ✅ 点击"开始做项目"进入 Step 1，显示进度条
5. ✅ 进度条 4 步显示正确，当前步骤高亮
6. ✅ Step 1：输入想法 → 生成 Prompt → 显示复制按钮 + 大模型工具入口（4个）
7. ✅ 示例灵感墙 8 个卡片可点击
8. ✅ 点"完成这一步，进入下一步"进入 Step 2
9. ✅ Step 2：粘贴设计书 → 生成拆任务 Prompt → 大模型工具入口
10. ✅ Step 3：粘贴任务列表 → 生成执行指令 → 显示**代码 Agent** 工具入口（TRAE 首推 + 通义灵码），TRAE 有"首推"标记
11. ✅ Step 4：输入项目情况 → 生成部署指令 → 代码 Agent 工具入口
12. ✅ Step 4 完成后显示"恭喜"页面
13. ✅ "开始新项目"按钮回到首页
14. ✅ 复制按钮可用，复制后文字变确认提示
15. ✅ 历史记录正常保存，显示步骤标记
16. ✅ 空输入有抖动提示，Ctrl+Enter 可触发
17. ✅ 手机宽度（375px）下布局正常
18. ✅ 不存在 api.js、.env、prompt.js（不带s的旧文件）
19. ✅ `git add -A && git commit -m "task01: 全面重构 — 深色主题 + 全流程 4 步"`

## 不要做的事

- ❌ 不要调用任何 AI API
- ❌ 不要引入任何外部 JS 库
- ❌ 不要创建 functions/ 目录
- ❌ 不要创建 wrangler 配置文件
- ❌ 不要 git push
