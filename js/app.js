// 主应用逻辑
document.addEventListener('DOMContentLoaded', () => {
  // DOM 引用
  const ideaInput = document.getElementById('ideaInput');
  const charCount = document.getElementById('charCount');
  const generateBtn = document.getElementById('generateBtn');
  const examplesGrid = document.getElementById('examplesGrid');
  const outputSection = document.getElementById('outputSection');
  const outputIdea = document.getElementById('outputIdea');
  const outputContent = document.getElementById('outputContent');
  const outputActions = document.getElementById('outputActions');
  const copyBtn = document.getElementById('copyBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const historySection = document.getElementById('historySection');
  const historyList = document.getElementById('historyList');

  let currentMarkdown = ''; // 当前生成的 Markdown 原文

  // ========== 字数统计 ==========
  ideaInput.addEventListener('input', () => {
    charCount.textContent = ideaInput.value.length;
  });

  // ========== 示例灵感墙 ==========
  function renderExamples() {
    examplesGrid.innerHTML = EXAMPLES.map(ex =>
      `<div class="example-card" data-text="${ex.text}">${ex.emoji} ${ex.text}</div>`
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

  // ========== 生成设计书 ==========
  generateBtn.addEventListener('click', () => {
    const idea = ideaInput.value.trim();
    if (!idea) {
      ideaInput.focus();
      return;
    }
    startGeneration(idea);
  });

  function startGeneration(idea) {
    // 显示输出区域
    outputSection.style.display = 'block';
    outputIdea.textContent = `💭 "${idea}"`;
    outputContent.innerHTML = '<p class="typing-cursor">正在生成...</p>';
    outputActions.style.display = 'none';
    currentMarkdown = '';

    // 禁用按钮
    generateBtn.disabled = true;
    generateBtn.textContent = '生成中...';
    generateBtn.classList.add('loading');

    // 滚动到输出区域
    outputSection.scrollIntoView({ behavior: 'smooth' });

    // 调用 API（task02 实现真实调用）
    Api.generate(
      idea,
      // onChunk
      (text) => {
        currentMarkdown += text;
        outputContent.innerHTML = marked.parse(currentMarkdown);
        // 保持滚动在底部
        window.scrollTo(0, document.body.scrollHeight);
      },
      // onDone
      (fullText) => {
        currentMarkdown = fullText;
        outputContent.innerHTML = marked.parse(fullText);
        outputActions.style.display = 'flex';
        resetButton();
        // 保存到历史记录
        Storage.save(idea, fullText);
        renderHistory();
      },
      // onError
      (error) => {
        outputContent.innerHTML = `<p style="color: red;">生成失败：${error.message}</p><p>请稍后重试。</p>`;
        resetButton();
      }
    );
  }

  function resetButton() {
    generateBtn.disabled = false;
    generateBtn.textContent = '生成设计书';
    generateBtn.classList.remove('loading');
  }

  // ========== 复制功能 ==========
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(currentMarkdown);
      copyBtn.textContent = '已复制 ✓';
      setTimeout(() => { copyBtn.textContent = '复制'; }, 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = currentMarkdown;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyBtn.textContent = '已复制 ✓';
      setTimeout(() => { copyBtn.textContent = '复制'; }, 2000);
    }
  });

  // ========== 下载功能 ==========
  downloadBtn.addEventListener('click', () => {
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '设计书.md';
    a.click();
    URL.revokeObjectURL(url);
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

  // 点击历史记录，显示之前的设计书
  historyList.addEventListener('click', (e) => {
    const historyItem = e.target.closest('.history-item');
    if (!historyItem) return;
    const id = Number(historyItem.dataset.id);
    const item = Storage.getById(id);
    if (item) {
      outputSection.style.display = 'block';
      outputIdea.textContent = `💭 "${item.idea}"`;
      outputContent.innerHTML = marked.parse(item.markdown);
      currentMarkdown = item.markdown;
      outputActions.style.display = 'flex';
      outputSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // ========== 初始化 ==========
  renderExamples();
  renderHistory();
});
