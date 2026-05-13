const SpeechManager = {
  synthesis: null,
  recognition: null,
  isSupported: false,
  recognitionSupported: false,
  _recognitionState: 'idle',
  _recognitionResolve: null,
  _recognitionReject: null,
  _recognitionTimer: null,

  init() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.isSupported = true;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'zh-CN';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
      this.recognition.continuous = false;
      this.recognitionSupported = true;
      
      this._setupRecognitionEvents();
    }

    return this.isSupported;
  },

  _setupRecognitionEvents() {
    if (!this.recognition) return;

    this.recognition.onresult = (event) => {
      if (this._recognitionState !== 'listening') return;
      
      this._recognitionState = 'idle';
      this._clearRecognitionTimer();
      
      const result = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      if (this._recognitionResolve) {
        this._recognitionResolve({ text: result, confidence });
        this._recognitionResolve = null;
        this._recognitionReject = null;
      }
    };

    this.recognition.onerror = (event) => {
      if (this._recognitionState !== 'listening') return;
      
      this._recognitionState = 'idle';
      this._clearRecognitionTimer();
      
      if (this._recognitionReject) {
        this._recognitionReject(new Error(`语音识别错误: ${event.error}`));
        this._recognitionResolve = null;
        this._recognitionReject = null;
      }
    };

    this.recognition.onend = () => {
      if (this._recognitionState !== 'listening') return;
      
      this._recognitionState = 'idle';
      this._clearRecognitionTimer();
      
      if (this._recognitionReject) {
        this._recognitionReject(new Error('语音识别结束，未检测到语音'));
        this._recognitionResolve = null;
        this._recognitionReject = null;
      }
    };
  },

  _clearRecognitionTimer() {
    if (this._recognitionTimer) {
      clearTimeout(this._recognitionTimer);
      this._recognitionTimer = null;
    }
  },

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('语音合成不支持'));
        return;
      }

      if (this.synthesis.speaking) {
        this.synthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'zh-CN';
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      const voices = this.synthesis.getVoices();
      const chineseVoice = voices.find(voice => 
        voice.lang.includes('zh') || voice.lang.includes('CN')
      );
      if (chineseVoice) {
        utterance.voice = chineseVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (e) => reject(e);

      this.synthesis.speak(utterance);
    });
  },

  speakPinyin(pinyin, options = {}) {
    const shengmuMap = {
      'b': 'bō', 'p': 'pō', 'm': 'mō', 'f': 'fó',
      'd': 'dé', 't': 'tè', 'n': 'nè', 'l': 'lè',
      'g': 'gē', 'k': 'kē', 'h': 'hē',
      'j': 'jī', 'q': 'qī', 'x': 'xī',
      'zh': 'zhī', 'ch': 'chī', 'sh': 'shī', 'r': 'rì',
      'z': 'zī', 'c': 'cī', 's': 'sī',
      'y': 'yī', 'w': 'wū'
    };

    const yunmuMap = {
      'a': 'ā', 'o': 'ō', 'e': 'ē', 'i': 'yī', 'u': 'wū', 'ü': 'yū', 'v': 'yū',
      'ai': 'āi', 'ei': 'ēi', 'ui': 'wēi',
      'ao': 'āo', 'ou': 'ōu', 'iu': 'yōu',
      'ie': 'yē', 'üe': 'yuē', 'ue': 'yuē', 'er': 'ér',
      'an': 'ān', 'en': 'ēn', 'in': 'yīn', 'un': 'wēn', 'ün': 'yūn', 'vn': 'yūn',
      'ang': 'āng', 'eng': 'ēng', 'ing': 'yīng', 'ong': 'hōng'
    };

    const zhengtiMap = {
      'zhi': 'zhī', 'chi': 'chī', 'shi': 'shī', 'ri': 'rì',
      'zi': 'zī', 'ci': 'cī', 'si': 'sī',
      'yi': 'yī', 'wu': 'wū', 'yu': 'yū',
      'ye': 'yē', 'yue': 'yuē', 'yuan': 'yuān',
      'yin': 'yīn', 'yun': 'yūn', 'ying': 'yīng'
    };

    let textToSpeak = null;
    
    if (zhengtiMap[pinyin]) {
      textToSpeak = zhengtiMap[pinyin];
    } else if (shengmuMap[pinyin]) {
      textToSpeak = shengmuMap[pinyin];
    } else if (yunmuMap[pinyin]) {
      textToSpeak = yunmuMap[pinyin];
    }

    if (textToSpeak) {
      return this.speak(textToSpeak, options);
    }

    return this.speak(pinyin, options);
  },

  speakCombinePinyin(pinyin, exampleChar, options = {}) {
    if (exampleChar) {
      return this.speak(exampleChar, options);
    }
    return this.speak(pinyin, options);
  },

  speakChar(char, options = {}) {
    return this.speak(char, options);
  },

  startRecognition(timeout = 8000) {
    return new Promise((resolve, reject) => {
      if (!this.recognitionSupported) {
        reject(new Error('语音识别不支持，请使用Chrome浏览器'));
        return;
      }

      if (this._recognitionState === 'listening') {
        reject(new Error('语音识别正在进行中，请稍候'));
        return;
      }

      this._recognitionState = 'listening';
      this._recognitionResolve = resolve;
      this._recognitionReject = reject;

      try {
        this.recognition.start();
        
        this._recognitionTimer = setTimeout(() => {
          if (this._recognitionState === 'listening') {
            this._recognitionState = 'idle';
            try {
              this.recognition.stop();
            } catch (e) {}
            
            if (this._recognitionReject) {
              this._recognitionReject(new Error('语音识别超时，请重试'));
              this._recognitionResolve = null;
              this._recognitionReject = null;
            }
          }
        }, timeout);
      } catch (e) {
        this._recognitionState = 'idle';
        this._clearRecognitionTimer();
        reject(e);
      }
    });
  },

  stopRecognition() {
    if (this._recognitionState === 'listening') {
      this._recognitionState = 'idle';
      this._clearRecognitionTimer();
      try {
        this.recognition.stop();
      } catch (e) {}
      
      if (this._recognitionReject) {
        this._recognitionReject(new Error('语音识别已停止'));
        this._recognitionResolve = null;
        this._recognitionReject = null;
      }
    }
  },

  checkPronunciation(recognizedText, targetText, targetPinyin = null) {
    if (!recognizedText || !targetText) return false;

    const normalized = recognizedText.replace(/\s+/g, '').toLowerCase();
    const target = targetText.replace(/\s+/g, '').toLowerCase();

    if (normalized.includes(target)) {
      return true;
    }

    if (targetPinyin) {
      const pinyinNormalized = targetPinyin.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (m) => {
        const map = {
          'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
          'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
          'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
          'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
          'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
          'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v'
        };
        return map[m] || m;
      }).toLowerCase();

      if (normalized.includes(pinyinNormalized)) {
        return true;
      }
    }

    const similarity = this.calculateSimilarity(normalized, target);
    return similarity >= 0.6;
  },

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const cost = this.levenshteinDistance(longer, shorter);
    return (longer.length - cost) / longer.length;
  },

  levenshteinDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;
    const dp = [];

    for (let i = 0; i <= len1; i++) {
      dp[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      dp[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }

    return dp[len1][len2];
  },

  stopSpeaking() {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  }
};
