document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.getElementById('heroSection');
  const pageActions = document.getElementById('pageActions');
  const homeBtn = document.getElementById('homeBtn');
  const prevBtn = document.getElementById('prevBtn');
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

  const step1 = document.getElementById('step1');
  const step1Input = document.getElementById('step1Input');
  const charCount = document.getElementById('charCount');
  const step1GenBtn = document.getElementById('step1GenBtn');
  const examplesGrid = document.getElementById('examplesGrid');

  const step2 = document.getElementById('step2');
  const step2Input = document.getElementById('step2Input');
  const step2GenBtn = document.getElementById('step2GenBtn');

  const step3 = document.getElementById('step3');
  const step3Input = document.getElementById('step3Input');
  const step3GenBtn = document.getElementById('step3GenBtn');

  const step4 = document.getElementById('step4');
  const step4Input = document.getElementById('step4Input');
  const step4GenBtn = document.getElementById('step4GenBtn');

  const stepElements = {
    1: step1,
    2: step2,
    3: step3,
    4: step4
  };

  const stepInputs = {
    1: step1Input,
    2: step2Input,
    3: step3Input,
    4: step4Input
  };

  const stepNames = {
    1: '设计书',
    2: '拆任务',
    3: '写代码',
    4: '部署'
  };

  let currentStep = 0;
  let currentPrompt = '';
  let currentIdea = '';
  let currentView = 'home';

  function getInputValues() {
    return {
      step1: step1Input.value,
      step2: step2Input.value,
      step3: step3Input.value,
      step4: step4Input.value
    };
  }

  function applyInputValues(inputs = {}) {
    step1Input.value = inputs.step1 || '';
    step2Input.value = inputs.step2 || '';
    step3Input.value = inputs.step3 || '';
    step4Input.value = inputs.step4 || '';
    charCount.textContent = step1Input.value.length;
  }

  function saveSession(extra = {}) {
    Storage.saveSession({
      currentStep,
      currentPrompt,
      currentIdea,
      currentView,
      inputs: getInputValues(),
      ...extra
    });
  }

  function updatePageActions() {
    const showActions = currentView !== 'home';
    pageActions.style.display = showActions ? 'flex' : 'none';

    if (!showActions) {
      return;
    }

    prevBtn.style.display = currentView === 'step1' ? 'none' : 'inline-flex';
  }

  function hideAllSections() {
    heroSection.style.display = 'none';
    step1.style.display = 'none';
    step2.style.display = 'none';
    step3.style.display = 'none';
    step4.style.display = 'none';
    outputSection.style.display = 'none';
    doneSection.style.display = 'none';
  }

  function updateProgressBar(activeStep) {
    document.querySelectorAll('.progress-step').forEach(el => {
      const step = Number(el.dataset.step);
      el.classList.remove('active', 'done');
      if (step < activeStep) {
        el.classList.add('done');
      }
      if (step === activeStep) {
        el.classList.add('active');
      }
    });
  }

  function renderStepContext(step) {
    if (step !== 2) {
      return;
    }

    let reminder = step2.querySelector('.context-reminder');
    if (!currentIdea) {
      if (reminder) {
        reminder.remove();
      }
      return;
    }

    if (!reminder) {
      reminder = document.createElement('div');
      reminder.className = 'context-reminder';
      step2.querySelector('.step-header').appendChild(reminder);
    }

    reminder.innerHTML = `你的想法是：“${currentIdea}”<br>把 AI 生成的设计书粘贴到下面，继续下一步。`;
  }

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
        { num: '②', text: '打开 TRAE，把它粘贴到 AI 对话框' },
        { num: '③', text: 'TRAE 会在你的电脑上自动创建文件并写代码' }
      ],
      4: [
        { num: '①', text: '复制 Prompt' },
        { num: '②', text: '在 TRAE 中粘贴执行' },
        { num: '③', text: 'AI 会帮你完成提交和部署准备' }
      ]
    };

    stepsHint.innerHTML = hints[step].map(item => (
      `<div class="step-item"><span class="step-num">${item.num}</span><span>${item.text}</span></div>`
    )).join('');
  }

  function renderTools(step) {
    const isCodeStep = step >= 3;
    const tools = isCodeStep ? CODE_AGENTS : AI_MODELS;
    const title = isCodeStep ? '推荐代码 Agent（可直接写代码）' : '推荐 AI 对话工具';

    toolsArea.innerHTML = `
      <p class="tools-title">${title}</p>
      <div class="tools-grid ${isCodeStep ? 'tools-grid-code' : ''}">
        ${tools.map(tool => `
          <a href="${tool.url}" target="_blank" class="tool-btn ${tool.highlight ? 'tool-highlight' : ''}">
            <span class="tool-icon">${tool.icon}</span>
            <span class="tool-name">${tool.name}</span>
            <span class="tool-desc">${tool.desc}</span>
            ${tool.highlight ? '<span class="tool-badge">首推</span>' : ''}
          </a>
        `).join('')}
      </div>
    `;
  }

  function renderOutput(step, options = {}) {
    const { showNextActions = true, scroll = true } = options;

    currentView = 'output';
    updatePageActions();
    outputSection.style.display = 'block';
    outputSection.classList.remove('fade-in');
    void outputSection.offsetWidth;
    outputSection.classList.add('fade-in');

    outputPrompt.textContent = currentPrompt;
    copyText.textContent = '一键复制 Prompt';
    copyBtn.classList.remove('copied');

    renderHint(step);
    renderTools(step);

    if (showNextActions) {
      nextStepArea.style.display = 'block';
      nextStepBtn.style.display = step < 4 ? 'block' : 'none';
      finishBtn.style.display = step < 4 ? 'none' : 'block';
    } else {
      nextStepArea.style.display = 'none';
    }

    if (scroll) {
      setTimeout(() => {
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  function goToStep(step, options = {}) {
    const { scroll = true } = options;

    currentStep = step;
    currentView = `step${step}`;
    hideAllSections();
    updatePageActions();

    progressBar.style.display = 'block';
    updateProgressBar(step);
    renderStepContext(step);

    const stepElement = stepElements[step];
    if (stepElement) {
      stepElement.style.display = 'block';
      if (scroll) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    saveSession({
      generatedStep: null,
      hasGeneratedPrompt: false,
      completed: false
    });
  }

  function restoreGeneratedState(state, options = {}) {
    const {
      scrollStep = false,
      scrollOutput = false,
      persist = true
    } = options;

    if (!state || !state.generatedStep || !state.currentPrompt) {
      return;
    }

    currentStep = state.currentStep || state.generatedStep;
    currentPrompt = state.currentPrompt;
    currentIdea = state.currentIdea || '';
    currentView = state.currentView || 'output';

    applyInputValues(state.inputs || {});

    hideAllSections();
    updatePageActions();
    progressBar.style.display = 'block';
    updateProgressBar(currentStep);
    renderStepContext(currentStep);

    const stepElement = stepElements[currentStep];
    if (stepElement) {
      stepElement.style.display = 'block';
      if (scrollStep) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    renderOutput(state.generatedStep, {
      showNextActions: true,
      scroll: scrollOutput
    });

    if (persist) {
      saveSession({
        generatedStep: state.generatedStep,
        hasGeneratedPrompt: true,
        completed: false
      });
    }
  }

  function resetFlow() {
    currentStep = 0;
    currentPrompt = '';
    currentIdea = '';
    currentView = 'home';
    applyInputValues({});
    hideAllSections();
    updatePageActions();
    progressBar.style.display = 'none';
    heroSection.style.display = 'block';
    Storage.clearSession();
    window.scrollTo(0, 0);
  }

  startBtn.addEventListener('click', () => {
    goToStep(1);
  });

  homeBtn.addEventListener('click', () => {
    resetFlow();
  });

  prevBtn.addEventListener('click', () => {
    if (currentView === 'output') {
      goToStep(currentStep);
      return;
    }

    if (currentView === 'done') {
      if (currentStep > 0 && currentPrompt) {
        restoreGeneratedState({
          currentStep,
          generatedStep: currentStep,
          currentPrompt,
          currentIdea,
          currentView: 'output',
          inputs: getInputValues()
        }, {
          scrollStep: false,
          scrollOutput: true,
          persist: true
        });
      } else {
        resetFlow();
      }
      return;
    }

    if (currentStep > 1) {
      goToStep(currentStep - 1);
      return;
    }

    resetFlow();
  });

  document.querySelectorAll('.progress-step').forEach(el => {
    el.addEventListener('click', () => {
      const targetStep = Number(el.dataset.step);
      if (targetStep <= currentStep) {
        goToStep(targetStep);
      }
    });
  });

  document.addEventListener('click', event => {
    const backBtn = event.target.closest('.btn-back');
    if (!backBtn) {
      return;
    }

    const targetStep = Number(backBtn.dataset.back);
    goToStep(targetStep);
  });

  step1Input.addEventListener('input', () => {
    charCount.textContent = step1Input.value.length;
    saveSession();
  });

  [step2Input, step3Input, step4Input].forEach(input => {
    input.addEventListener('input', () => {
      saveSession();
    });
  });

  step1Input.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      handleGenerate(1);
    }
  });

  [step2Input, step3Input, step4Input].forEach((input, index) => {
    input.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleGenerate(index + 2);
      }
    });
  });

  function renderExamples() {
    examplesGrid.innerHTML = EXAMPLES.map(example => `
      <div class="example-card" data-text="${example.text}">
        <span class="example-emoji">${example.emoji}</span>
        <span class="example-text">${example.text}</span>
        <span class="example-desc">${example.desc}</span>
      </div>
    `).join('');

    examplesGrid.addEventListener('click', event => {
      const card = event.target.closest('.example-card');
      if (!card) {
        return;
      }

      step1Input.value = card.dataset.text;
      charCount.textContent = card.dataset.text.length;
      step1Input.focus();
      saveSession({
        currentIdea: currentIdea || card.dataset.text
      });
    });
  }

  step1GenBtn.addEventListener('click', () => handleGenerate(1));
  step2GenBtn.addEventListener('click', () => handleGenerate(2));
  step3GenBtn.addEventListener('click', () => handleGenerate(3));
  step4GenBtn.addEventListener('click', () => handleGenerate(4));

  function handleGenerate(step) {
    const input = stepInputs[step];
    const value = input.value.trim();

    if (!value) {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 400);
      input.focus();
      return;
    }

    currentStep = step;
    if (step === 1) {
      currentIdea = value;
    }

    currentPrompt = generatePrompt(step, value);

    renderOutput(step);

    Storage.save(currentIdea || value, step, currentPrompt);
    saveSession({
      generatedStep: step,
      hasGeneratedPrompt: true,
      completed: false
    });
    renderHistory();
  }

  copyBtn.addEventListener('click', async () => {
    const onSuccess = () => {
      copyText.textContent = '已复制，去工具里粘贴吧';
      copyBtn.classList.add('copied');

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyText.textContent = '一键复制 Prompt';
      }, 3000);
    };

    try {
      await navigator.clipboard.writeText(currentPrompt);
      onSuccess();
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = currentPrompt;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      onSuccess();
    }
  });

  nextStepBtn.addEventListener('click', () => {
    if (currentStep < 4) {
      goToStep(currentStep + 1);
    }
  });

  finishBtn.addEventListener('click', () => {
    hideAllSections();
    currentView = 'done';
    updatePageActions();
    doneSection.style.display = 'block';
    Storage.clearSession();
    doneSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  restartBtn.addEventListener('click', () => {
    resetFlow();
  });

  function renderHistory() {
    const list = Storage.getAll();
    if (list.length === 0) {
      historySection.style.display = 'none';
      return;
    }

    historySection.style.display = 'block';
    historyList.innerHTML = list.map(item => {
      const date = new Date(item.time).toLocaleDateString('zh-CN');
      return `
        <div class="history-item" data-id="${item.id}">
          <span class="history-idea">${item.idea}</span>
          <span class="history-step">第 ${item.step} 步 · ${stepNames[item.step] || ''}</span>
          <span class="history-date">${date}</span>
          <button class="history-delete" data-delete-id="${item.id}" title="删除">×</button>
        </div>
      `;
    }).join('');
  }

  historyList.addEventListener('click', event => {
    const deleteBtn = event.target.closest('.history-delete');
    if (deleteBtn) {
      event.stopPropagation();
      Storage.remove(Number(deleteBtn.dataset.deleteId));
      renderHistory();
      return;
    }

    const historyItem = event.target.closest('.history-item');
    if (!historyItem) {
      return;
    }

    const item = Storage.getById(Number(historyItem.dataset.id));
    if (!item) {
      return;
    }

    const sessionState = {
      currentStep: item.step,
      generatedStep: item.step,
      currentPrompt: item.prompt,
      currentIdea: item.idea,
      inputs: {
        ...getInputValues(),
        [`step${item.step}`]: stepInputs[item.step].value || item.idea
      }
    };

    restoreGeneratedState(sessionState, {
      scrollStep: false,
      scrollOutput: true,
      persist: true
    });
  });

  function restoreSession() {
    const session = Storage.getSession();
    if (!session) {
      return;
    }

    currentStep = session.currentStep || 0;
    currentPrompt = session.currentPrompt || '';
    currentIdea = session.currentIdea || '';
    currentView = session.currentView || (currentStep ? `step${currentStep}` : 'home');
    applyInputValues(session.inputs || {});

    if (session.completed) {
      hideAllSections();
      updatePageActions();
      doneSection.style.display = 'block';
      return;
    }

    if (session.generatedStep && session.currentPrompt) {
      restoreGeneratedState(session, {
        scrollStep: false,
        scrollOutput: false,
        persist: false
      });
      return;
    }

    if (currentStep >= 1 && currentStep <= 4) {
      goToStep(currentStep, { scroll: false });
    }
  }

  renderExamples();
  renderHistory();
  updatePageActions();
  restoreSession();
});
