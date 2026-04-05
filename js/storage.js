const STORAGE_KEY = 'ai_coach_lite_history';
const SESSION_KEY = 'ai_coach_lite_session';
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
      idea,
      step,
      prompt,
      time: new Date().toISOString()
    };

    list.unshift(item);
    if (list.length > MAX_HISTORY) {
      list.pop();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return item;
  },

  remove(id) {
    const list = this.getAll().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  getById(id) {
    return this.getAll().find(item => item.id === id) || null;
  },

  saveSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  },

  clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }
};
