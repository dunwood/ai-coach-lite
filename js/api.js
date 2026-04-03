// DeepSeek API 调用
const API_KEY = 'sk-placeholder-replace-me';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

const Api = {
  /**
   * 流式调用 DeepSeek，逐块回调
   * @param {string} userInput - 用户输入的一句话
   * @param {function} onChunk - 每收到一块文本时的回调 (text) => void
   * @param {function} onDone - 完成时的回调 (fullText) => void
   * @param {function} onError - 出错时的回调 (error) => void
   */
  async generate(userInput, onChunk, onDone, onError) {
    // task02 实现
    onError(new Error('API 功能将在 task02 中实现'));
  }
};
