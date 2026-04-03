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
