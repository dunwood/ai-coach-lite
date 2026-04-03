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
  const finishBtn = document.getElementById('finishBtn');
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

    // Step 2 显示上下文提示
    if (step === 2 && currentIdea) {
      let reminder = step2.querySelector('.context-reminder');
      if (!reminder) {
        reminder = document.createElement('div');
        reminder.className = 'context-reminder';
        step2.querySelector('.step-header').appendChild(reminder);
      }
      reminder.innerHTML = `💭 你的想法是："${currentIdea}"<br>把 AI 生成的设计书粘贴到下方，继续下一步。`;
    }

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

  // ========== 进度条点击跳转 ==========
  document.querySelectorAll('.progress-step').forEach(el => {
    el.addEventListener('click', () => {
      const targetStep = parseInt(el.dataset.step);
      if (targetStep <= currentStep) {
        goToStep(targetStep);
      }
    });
  });

  // ========== 返回上一步（事件委托） ==========
  document.addEventListener('click', (e) => {
    const backBtn = e.target.closest('.btn-back');
    if (backBtn) {
      const targetStep = parseInt(backBtn.dataset.back);
      goToStep(targetStep);
    }
  });

  // ========== Step 1 逻辑 ==========
  step1Input.addEventListener('input', () => {
    charCount.textContent = step1Input.value.length;
  });

  // Ctrl+Enter 快捷键（Step 1）
  step1Input.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate(1);
    }
  });

  step1GenBtn.addEventListener('click', () => handleGenerate(1));

  // Ctrl+Enter 快捷键（Step 2/3/4）
  [step2Input, step3Input, step4Input].forEach((input, i) => {
    input.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGenerate(i + 2);
      }
    });
  });

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

  // ========== Step 2/3/4 生成按钮 ==========
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

    // 显示输出（带渐入动画）
    outputSection.style.display = 'block';
    outputSection.classList.remove('fade-in');
    void outputSection.offsetWidth; // 强制 reflow 重新触发动画
    outputSection.classList.add('fade-in');
    outputPrompt.textContent = currentPrompt;
    copyText.textContent = '📋 一键复制 Prompt';
    copyBtn.classList.remove('copied');

    // 根据步骤显示不同的提示和工具
    renderHint(step);
    renderTools(step);

    // 显示/隐藏下一步 or 完成按钮（Bug 1 修复：不再动态创建）
    nextStepArea.style.display = 'block';
    if (step < 4) {
      nextStepBtn.style.display = 'block';
      finishBtn.style.display = 'none';
    } else {
      nextStepBtn.style.display = 'none';
      finishBtn.style.display = 'block';
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
    const onSuccess = () => {
      copyText.textContent = '✅ 已复制！去工具里粘贴吧';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyText.textContent = '📋 一键复制 Prompt';
      }, 3000);
    };

    try {
      await navigator.clipboard.writeText(currentPrompt);
      onSuccess();
    } catch {
      const ta = document.createElement('textarea');
      ta.value = currentPrompt;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onSuccess();
    }
  });

  // ========== 下一步 ==========
  nextStepBtn.addEventListener('click', () => {
    if (currentStep < 4) {
      goToStep(currentStep + 1);
    }
  });

  // ========== 完成（Step 4）==========
  finishBtn.addEventListener('click', () => {
    outputSection.style.display = 'none';
    doneSection.style.display = 'block';
    progressBar.style.display = 'none';
    doneSection.scrollIntoView({ behavior: 'smooth' });
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
        <button class="history-delete" data-delete-id="${item.id}" title="删除">×</button>
      </div>`;
    }).join('');
  }

  historyList.addEventListener('click', (e) => {
    // 删除按钮
    const deleteBtn = e.target.closest('.history-delete');
    if (deleteBtn) {
      e.stopPropagation();
      Storage.remove(Number(deleteBtn.dataset.deleteId));
      renderHistory();
      return;
    }

    // 点击历史记录条目
    const historyItem = e.target.closest('.history-item');
    if (!historyItem) return;
    const id = Number(historyItem.dataset.id);
    const item = Storage.getById(id);
    if (item) {
      currentPrompt = item.prompt;
      outputSection.style.display = 'block';
      outputPrompt.textContent = item.prompt;
      copyText.textContent = '📋 一键复制 Prompt';
      copyBtn.classList.remove('copied');
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
