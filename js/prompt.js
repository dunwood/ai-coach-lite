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
