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
      nextStepArea.innerHTML = '';
      nextStepArea.appendChild(nextStepBtn);
      nextStepArea.style.display = 'block';
    } else {
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
