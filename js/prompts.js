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

// ========== 大模型（用于 Step 1、Step 2 的文本生成）==========
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

// ========== 代码 Agent（用于 Step 3、Step 4 的代码执行）==========
const CODE_AGENTS = [
  {
    name: 'TRAE',
    url: 'https://www.trae.com.cn/download',
    desc: '字节出品，免费，中文界面，零基础首选',
    icon: '⚡',
    highlight: true
  },
  {
    name: '通义灵码',
    url: 'https://tongyi.aliyun.com/lingma/',
    desc: '阿里出品，VS Code 插件',
    icon: '🧩',
    highlight: false
  }
];

// ========== Prompt 生成函数 ==========
function generatePrompt(step, userInput) {
  const templates = {
    1: PROMPT_STEP1,
    2: PROMPT_STEP2,
    3: PROMPT_STEP3,
    4: PROMPT_STEP4
  };
  return templates[step].replace('{{USER_INPUT}}', userInput.trim());
}
