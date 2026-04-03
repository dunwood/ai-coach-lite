# Task 02: 体验打磨 + Bug 修复 + 交互优化

## 任务目标
在 task01 的基础上进行细节打磨，修复已知 bug，提升用户体验。重点是让 4 步流程更顺畅、更有引导感。

---

## Bug 修复

### Bug 1：Step 4 完成按钮重复创建
在 `app.js` 的 `handleGenerate` 函数中，当 `step === 4` 时，每次点击都会 `createElement` 创建新按钮追加到 `nextStepArea`，导致重复点击会出现多个按钮。

**修复方案**：不要动态创建按钮，改为在 HTML 中预置两个按钮（`nextStepBtn` 和 `finishBtn`），根据步骤切换显示/隐藏。

具体改动：
1. 在 `index.html` 的 `nextStepArea` 中添加第二个按钮：
```html
<div class="next-step-area" id="nextStepArea" style="display:none;">
  <button id="nextStepBtn" class="btn-next">完成这一步，进入下一步 →</button>
  <button id="finishBtn" class="btn-next btn-finish" style="display:none;">🎉 我已经部署上线了！</button>
</div>
```

2. 在 `app.js` 中：
   - 获取 `finishBtn` 的 DOM 引用
   - 给 `finishBtn` 绑定点击事件（显示完成页面）
   - `handleGenerate` 中 step < 4 时：显示 `nextStepBtn`，隐藏 `finishBtn`
   - step === 4 时：隐藏 `nextStepBtn`，显示 `finishBtn`
   - 删除原来 `createElement` 的全部代码

### Bug 2：Ctrl+Enter 只在 Step 1 生效
其他步骤的 textarea 也应该支持 Ctrl+Enter 快捷键。

**修复方案**：给 step2Input、step3Input、step4Input 都添加 keydown 监听：
```javascript
[step2Input, step3Input, step4Input].forEach((input, i) => {
  input.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate(i + 2);
    }
  });
});
```

---

## 体验优化

### 优化 1：添加"返回上一步"按钮
用户可能需要回到上一步修改内容。在 Step 2/3/4 的 step-header 最前面添加返回按钮。

在 `index.html` 中：
- Step 2 的 `<div class="step-header">` 内最前面添加：`<button class="btn-back" data-back="1">← 返回上一步</button>`
- Step 3 的 `<div class="step-header">` 内最前面添加：`<button class="btn-back" data-back="2">← 返回上一步</button>`
- Step 4 的 `<div class="step-header">` 内最前面添加：`<button class="btn-back" data-back="3">← 返回上一步</button>`

在 `app.js` 中添加事件委托：
```javascript
document.addEventListener('click', (e) => {
  const backBtn = e.target.closest('.btn-back');
  if (backBtn) {
    const targetStep = parseInt(backBtn.dataset.back);
    goToStep(targetStep);
  }
});
```

CSS：
```css
.btn-back {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 16px;
  display: inline-block;
}
.btn-back:hover {
  color: var(--color-primary);
}
```

### 优化 2：步骤间显示上下文提示
进入 Step 2 时，如果用户在 Step 1 有输入，显示提示"你的想法是：xxx"。

在 `goToStep` 函数中，进入 step 2 时：
```javascript
if (step === 2 && currentIdea) {
  let reminder = step2.querySelector('.context-reminder');
  if (!reminder) {
    reminder = document.createElement('div');
    reminder.className = 'context-reminder';
    step2.querySelector('.step-header').appendChild(reminder);
  }
  reminder.innerHTML = `💭 你的想法是："${currentIdea}"<br>把 AI 生成的设计书粘贴到下方，继续下一步。`;
}
```

CSS：
```css
.context-reminder {
  background: var(--color-primary-dim);
  border: 1px solid rgba(0,229,200,0.15);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 12px;
  line-height: 1.6;
}
```

### 优化 3：复制成功视觉反馈增强
复制成功后按钮短暂变绿。

CSS：
```css
.btn-copy.copied {
  background: var(--color-success);
}
```

JS 复制成功后添加：
```javascript
copyBtn.classList.add('copied');
setTimeout(() => {
  copyBtn.classList.remove('copied');
  copyText.textContent = '📋 一键复制 Prompt';
}, 3000);
```

### 优化 4：输出区域渐入动画
显示输出时添加 fadeIn 效果。

CSS：
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in {
  animation: fadeIn 0.3s ease;
}
```

JS 中 `handleGenerate` 显示输出时：
```javascript
outputSection.style.display = 'block';
outputSection.classList.remove('fade-in');
void outputSection.offsetWidth; // 强制 reflow 重新触发动画
outputSection.classList.add('fade-in');
```

### 优化 5：已完成的进度条步骤可点击跳转

JS：
```javascript
document.querySelectorAll('.progress-step').forEach(el => {
  el.addEventListener('click', () => {
    const targetStep = parseInt(el.dataset.step);
    if (targetStep <= currentStep) {
      goToStep(targetStep);
    }
  });
});
```

CSS：
```css
.progress-step.done {
  cursor: pointer;
}
.progress-step.done:hover .step-number {
  box-shadow: 0 0 10px rgba(0, 230, 118, 0.3);
}
```

### 优化 6：Hero 区域增加 4 步流程预览
在 `hero-desc` 和 `btn-hero` 之间插入流程标签，让用户第一眼看到全流程。

HTML（插入到 `hero-desc` 后、`btn-hero` 前）：
```html
<div class="hero-flow">
  <span class="flow-tag">① 想法→设计书</span>
  <span class="flow-arrow">→</span>
  <span class="flow-tag">② 拆任务</span>
  <span class="flow-arrow">→</span>
  <span class="flow-tag">③ AI写代码</span>
  <span class="flow-arrow">→</span>
  <span class="flow-tag">④ 部署上线</span>
</div>
```

CSS：
```css
.hero-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.flow-tag {
  background: var(--color-primary-dim);
  color: var(--color-primary);
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(0,229,200,0.2);
  white-space: nowrap;
}
.flow-arrow {
  color: var(--color-text-dim);
  font-size: 14px;
}
```

移动端（max-width: 480px）：
```css
.hero-flow { gap: 6px; }
.flow-tag { font-size: 11px; padding: 4px 10px; }
.flow-arrow { font-size: 12px; }
```

### 优化 7：历史记录支持删除
每条右侧添加 × 按钮。

修改 `renderHistory` 的 HTML 模板，在 `history-date` 后添加：
```html
<button class="history-delete" data-delete-id="${item.id}" title="删除">×</button>
```

在 historyList 的 click 事件中，判断是否点击了删除按钮：
```javascript
const deleteBtn = e.target.closest('.history-delete');
if (deleteBtn) {
  e.stopPropagation();
  Storage.remove(Number(deleteBtn.dataset.deleteId));
  renderHistory();
  return;
}
```

CSS：
```css
.history-delete {
  background: none;
  border: none;
  color: var(--color-text-dim);
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  flex-shrink: 0;
}
.history-delete:hover {
  color: #FF5252;
}
```

### 优化 8：Prompt 区域美化滚动条和选中效果

CSS：
```css
.output-prompt::-webkit-scrollbar {
  width: 6px;
}
.output-prompt::-webkit-scrollbar-track {
  background: transparent;
}
.output-prompt::-webkit-scrollbar-thumb {
  background: var(--color-border-light);
  border-radius: 3px;
}
.output-prompt::selection {
  background: var(--color-primary-dim);
  color: var(--color-primary);
}
```

---

## 验收标准

1. ✅ Step 4 完成按钮不再重复创建，反复点击"生成部署指令"不会出现多个按钮
2. ✅ Step 2/3/4 的 textarea 都支持 Ctrl+Enter
3. ✅ Step 2/3/4 左上角有"← 返回上一步"，点击可回退
4. ✅ 进入 Step 2 时如果 Step 1 有输入，显示"你的想法是：xxx"提示
5. ✅ 复制成功后按钮变绿色 3 秒
6. ✅ 输出区域显示时有渐入动画
7. ✅ 已完成的进度条步骤可点击跳转，hover 有发光效果
8. ✅ Hero 区域显示 ①②③④ 流程预览标签
9. ✅ 历史记录右侧有 × 删除按钮，可删除
10. ✅ Prompt 区域滚动条细窄美观
11. ✅ 手机端（375px）所有新增内容布局正常
12. ✅ `git add -A && git commit -m "task02: 体验打磨 + Bug 修复 + 交互优化"`

## 不要做的事

- ❌ 不要修改 prompts.js 中的 Prompt 模板文案
- ❌ 不要调用任何 AI API
- ❌ 不要引入任何外部 JS 库
- ❌ 不要创建新文件（所有改动在现有文件中完成）
- ❌ 不要 git push
