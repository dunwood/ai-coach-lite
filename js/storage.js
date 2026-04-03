// 历史记录管理
const STORAGE_KEY = 'ai_coach_lite_history';
const MAX_HISTORY = 20;

const Storage = {
  // 获取所有历史记录
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  // 保存一条记录
  save(idea, markdown) {
    const list = this.getAll();
    const item = {
      id: Date.now(),
      idea: idea,
      markdown: markdown,
      time: new Date().toISOString()
    };
    list.unshift(item);
    if (list.length > MAX_HISTORY) list.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return item;
  },

  // 删除一条记录
  remove(id) {
    const list = this.getAll().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  // 获取一条记录
  getById(id) {
    return this.getAll().find(item => item.id === id) || null;
  }
};
