/**
 * 语音服务模块
 * 提供文本转语音功能，用于健身训练的语音指导
 */

class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.selectedVoice = null;
    this.volume = 1.0;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.isEnabled = true;
    this.lastSpeechTime = 0;
    this.speechCooldown = 3000; // 语音间隔时间（毫秒）
    
    // 初始化可用语音
    this.initVoices();
  }
  
  /**
   * 初始化语音列表
   */
  initVoices() {
    // 获取可用语音列表
    this.voices = this.synth.getVoices();
    
    // 选择默认中文语音
    this.selectedVoice = this.voices.find(voice => voice.lang.includes('zh-CN')) || this.voices[0];
    
    // 如果浏览器延迟加载语音，添加事件监听
    if (this.voices.length === 0) {
      this.synth.addEventListener('voiceschanged', () => {
        this.voices = this.synth.getVoices();
        this.selectedVoice = this.voices.find(voice => voice.lang.includes('zh-CN')) || this.voices[0];
      });
    }
  }
  
  /**
   * 播放语音
   * @param {string} text - 要播放的文本
   * @returns {boolean} - 是否成功播放
   */
  speak(text) {
    if (!this.isEnabled) return false;
    
    const now = Date.now();
    // 检查是否超过冷却时间
    if (now - this.lastSpeechTime < this.speechCooldown) return false;
    
    // 取消当前正在播放的语音
    this.synth.cancel();
    
    // 创建语音对象
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.selectedVoice;
    utterance.volume = this.volume;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    
    // 播放语音
    this.synth.speak(utterance);
    this.lastSpeechTime = now;
    
    return true;
  }
  
  /**
   * 启用语音
   */
  enable() { 
    this.isEnabled = true; 
  }
  
  /**
   * 禁用语音
   */
  disable() { 
    this.isEnabled = false; 
    this.synth.cancel(); // 取消当前语音
  }
  
  /**
   * 设置语音
   * @param {SpeechSynthesisVoice} voice - 语音对象
   */
  setVoice(voice) {
    this.selectedVoice = voice;
  }
  
  /**
   * 设置音量
   * @param {number} volume - 音量 (0.0 - 1.0)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
  
  /**
   * 设置语速
   * @param {number} rate - 语速 (0.1 - 10.0)
   */
  setRate(rate) {
    this.rate = Math.max(0.1, Math.min(10, rate));
  }
  
  /**
   * 设置音调
   * @param {number} pitch - 音调 (0.0 - 2.0)
   */
  setPitch(pitch) {
    this.pitch = Math.max(0, Math.min(2, pitch));
  }
  
  /**
   * 设置语音冷却时间
   * @param {number} cooldown - 冷却时间（毫秒）
   */
  setCooldown(cooldown) {
    this.speechCooldown = Math.max(0, cooldown);
  }
  
  /**
   * 获取可用语音列表
   * @returns {Array} - 语音列表
   */
  getVoices() {
    return this.voices;
  }
}

// 导出单例实例
export default new SpeechService();
