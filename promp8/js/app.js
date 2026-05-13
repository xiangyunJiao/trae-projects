const App = {
  currentPage: 'home',
  pageHistory: [],
  currentLevel: 1,
  currentGroup: 0,
  selectedExamType: null,
  selectedDifficulty: 'MEDIUM',
  currentGroupChars: [],
  confirmCallback: null,
  isRecording: false,

  init() {
    SpeechManager.init();
    this.renderShengmu();
    this.renderYunmu('dan');
    this.renderZhengti();
    this.renderCombine('liangpin');
    this.renderLevelCards();
    this.renderStats();

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });

    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.onvoiceschanged = () => {
        SpeechManager.init();
      };
    }
  },

  navigateTo(pageName) {
    if (this.currentPage !== pageName) {
      this.pageHistory.push(this.currentPage);
    }
    this.showPage(pageName);
  },

  goBack() {
    if (this.pageHistory.length > 0) {
      const prevPage = this.pageHistory.pop();
      this.showPage(prevPage);
    } else {
      this.showPage('home');
    }
  },

  showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageName;
    }

    this.updateNav(pageName);

    if (pageName === 'chars') {
      this.renderLevelCards();
    } else if (pageName === 'stats') {
      this.renderStats();
    }
  },

  switchNav(pageName) {
    this.pageHistory = [];
    this.showPage(pageName);
  },

  updateNav(pageName) {
    document.querySelectorAll('.nav-item').forEach((item, index) => {
      item.classList.remove('active');
      const navPages = ['home', 'chars', 'exam-select', 'stats'];
      if (navPages[index] === pageName) {
        item.classList.add('active');
      }
    });
  },

  renderShengmu() {
    const grid = document.getElementById('shengmu-grid');
    if (!grid) return;

    grid.innerHTML = PinyinData.shengmu.map(item => `
      <div class="pinyin-item" onclick="App.speakPinyin('${item.pinyin}', this)">
        <span class="pinyin-text">${item.pinyin}</span>
        <span class="pinyin-name">${item.name}</span>
      </div>
    `).join('');
  },

  renderYunmu(category) {
    const grid = document.getElementById('yunmu-grid');
    if (!grid) return;

    const tabs = document.querySelectorAll('#yunmu-tabs .tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = document.querySelector(`#yunmu-tabs button[onclick*="'${category}'"]`);
    if (activeTab) activeTab.classList.add('active');

    const data = PinyinData.yunmu[category] || [];
    grid.innerHTML = data.map(item => `
      <div class="pinyin-item" onclick="App.speakPinyin('${item.pinyin}', this)">
        <span class="pinyin-text">${item.pinyin}</span>
        <span class="pinyin-name">${item.name}</span>
      </div>
    `).join('');
  },

  switchYunmuTab(category) {
    this.renderYunmu(category);
  },

  renderZhengti() {
    const grid = document.getElementById('zhengti-grid');
    if (!grid) return;

    grid.innerHTML = PinyinData.zhengti.map(item => `
      <div class="pinyin-item" onclick="App.speakPinyin('${item.pinyin}', this)">
        <span class="pinyin-text">${item.pinyin}</span>
        <span class="pinyin-name">${item.name}</span>
      </div>
    `).join('');
  },

  renderCombine(type) {
    const grid = document.getElementById('combine-grid');
    if (!grid) return;

    const tabs = document.querySelectorAll('#combine-tabs .tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = document.querySelector(`#combine-tabs button[onclick*="'${type}'"]`);
    if (activeTab) activeTab.classList.add('active');

    const data = PinyinData[type] || [];
    grid.innerHTML = data.map(item => `
      <div class="pinyin-item" onclick="App.speakCombine('${item.pinyin}', '${item.name}', this)">
        <span class="pinyin-text">${item.pinyin}</span>
        <span class="pinyin-name">${item.name}</span>
        <span style="font-size: 11px; color: var(--text-gray); display: block; margin-top: 3px;">${item.example}</span>
      </div>
    `).join('');
  },

  switchCombineTab(type) {
    this.renderCombine(type);
  },

  async speakPinyin(pinyin, element) {
    if (element) {
      element.classList.add('playing');
      setTimeout(() => element.classList.remove('playing'), 1000);
    }
    try {
      await SpeechManager.speakPinyin(pinyin);
    } catch (e) {
      console.error('发音失败:', e);
    }
  },

  async speakCombine(pinyin, exampleChar, element) {
    if (element) {
      element.classList.add('playing');
      setTimeout(() => element.classList.remove('playing'), 1000);
    }
    try {
      await SpeechManager.speakCombinePinyin(pinyin, exampleChar);
    } catch (e) {
      console.error('发音失败:', e);
    }
  },

  async speakChar(char, element) {
    if (element) {
      element.classList.add('playing');
      setTimeout(() => element.classList.remove('playing'), 1000);
    }
    try {
      await SpeechManager.speakChar(char);
    } catch (e) {
      console.error('发音失败:', e);
    }
  },

  renderLevelCards() {
    const container = document.getElementById('level-cards');
    if (!container) return;

    const levelNames = [
      { name: '入门级', desc: '简单独体字、常用数字', icon: '🌱' },
      { name: '基础级', desc: '日常事物、人体部位', icon: '🌿' },
      { name: '进阶级', desc: '自然现象、动作动词', icon: '🌳' },
      { name: '提高级', desc: '形容词、情感表达', icon: '🌺' },
      { name: '拓展级', desc: '抽象概念、时间词汇', icon: '🌻' }
    ];

    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const progress = StorageManager.getLevelProgress(i);
      const info = levelNames[i - 1];
      
      container.innerHTML += `
        <div class="level-card level-${i}" onclick="App.selectLevel(${i})">
          <div class="level-icon">${info.icon}</div>
          <div class="level-info">
            <div class="level-title">Level ${i} - ${info.name}</div>
            <div class="level-desc">${info.desc} · ${progress.total}个字</div>
          </div>
          <div class="level-progress">
            <div class="level-progress-num">${progress.learned}/${progress.total}</div>
            <div class="level-progress-text">${progress.percentage}%</div>
          </div>
        </div>
      `;
    }
  },

  selectLevel(level) {
    this.currentLevel = level;
    this.renderGroups();
    this.navigateTo('groups');
  },

  renderGroups() {
    const title = document.getElementById('group-title');
    const grid = document.getElementById('groups-grid');
    if (!title || !grid) return;

    const levelNames = ['入门级', '基础级', '进阶级', '提高级', '拓展级'];
    title.textContent = `Level ${this.currentLevel} - ${levelNames[this.currentLevel - 1]}`;

    const groups = getCharsGroupedByLevel(this.currentLevel);
    grid.innerHTML = '';

    groups.forEach((group, index) => {
      const isLearned = StorageManager.isGroupLearned(this.currentLevel, index);
      const isCheckedToday = StorageManager.isGroupCheckedToday(this.currentLevel, index);
      
      let badge = '';
      let cardClass = 'group-card';
      if (isLearned) {
        cardClass += ' learned';
        badge = '<span class="group-badge">✅</span>';
      } else if (isCheckedToday) {
        cardClass += ' checked-today';
        badge = '<span class="group-badge">📅</span>';
      }

      grid.innerHTML += `
        <div class="${cardClass}" onclick="App.selectGroup(${index})">
          ${badge}
          <div class="group-number">第${index + 1}组</div>
          <div class="group-label">${group.length}个字</div>
        </div>
      `;
    });
  },

  selectGroup(groupIndex) {
    this.currentGroup = groupIndex;
    const groups = getCharsGroupedByLevel(this.currentLevel);
    this.currentGroupChars = groups[groupIndex] || [];
    this.renderCharStudy();
    this.navigateTo('char-study');
  },

  backToGroups() {
    this.renderGroups();
    this.navigateTo('groups');
  },

  renderCharStudy() {
    const title = document.getElementById('study-title');
    const grid = document.getElementById('chars-grid');
    if (!title || !grid) return;

    title.textContent = `第${this.currentGroup + 1}组学习`;

    grid.innerHTML = this.currentGroupChars.map(char => {
      const isLearned = StorageManager.isCharLearned(char.char);
      return `
        <div class="char-card ${isLearned ? 'learned' : ''}" onclick="App.toggleCharLearned('${char.char}', this)">
          ${isLearned ? '<span class="learned-badge">✅</span>' : ''}
          <div class="char-main" onclick="event.stopPropagation(); App.speakChar('${char.char}', this.parentElement)">${char.char}</div>
          <div class="char-pinyin">${char.pinyin}</div>
          <div class="char-meaning">${char.meaning}</div>
          <div style="font-size: 11px; color: var(--text-gray); margin-top: 5px;">
            ${isLearned ? '已学会' : '点击标记学会'}
          </div>
        </div>
      `;
    }).join('');
  },

  toggleCharLearned(char, element) {
    const isLearned = StorageManager.isCharLearned(char);
    
    if (isLearned) {
      this.showConfirm(
        '📚',
        '取消标记？',
        `确定要取消"${char}"的已学会标记吗？`,
        (confirmed) => {
          if (confirmed) {
            StorageManager.removeLearnedChar(char);
            this.renderCharStudy();
          }
        }
      );
    } else {
      StorageManager.addLearnedChar(char);
      this.renderCharStudy();
    }
  },

  async playAllChars() {
    for (const char of this.currentGroupChars) {
      await SpeechManager.speakChar(char.char);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  },

  checkinGroup() {
    StorageManager.setGroupCheckin(this.currentLevel, this.currentGroup);
    StorageManager.checkin();
    this.showFeedback('✅', '打卡成功！', '继续加油学习哦~');
  },

  selectExamType(type) {
    this.selectedExamType = type;
    document.querySelectorAll('.exam-type-card').forEach(card => {
      card.classList.remove('selected');
      if (card.dataset.type === type) {
        card.classList.add('selected');
      }
    });
  },

  selectDifficulty(difficulty) {
    this.selectedDifficulty = difficulty;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.classList.remove('selected');
      if (btn.dataset.difficulty === difficulty) {
        btn.classList.add('selected');
      }
    });
  },

  startExam() {
    if (!this.selectedExamType) {
      this.showFeedback('⚠️', '请选择考试类型', '请先选择要考试的类型');
      return;
    }

    ExamManager.startExam(this.selectedExamType, this.selectedDifficulty);
    this.renderExamQuestion();
    this.navigateTo('exam');
  },

  renderExamQuestion() {
    if (ExamManager.isFinished()) {
      this.showExamResult();
      return;
    }

    const question = ExamManager.getCurrentQuestion();
    const progress = ExamManager.getProgress();

    const questionEl = document.getElementById('exam-question');
    const hintEl = document.getElementById('exam-hint');
    const progressEl = document.getElementById('exam-progress');
    const recordBtn = document.getElementById('record-btn');

    if (questionEl) questionEl.textContent = question.display;
    if (hintEl) {
      if (question.type === 'char') {
        hintEl.textContent = `点击下方按钮，念出这个汉字：${question.pinyin}`;
      } else {
        hintEl.textContent = '点击下方按钮，念出这个拼音';
      }
    }

    if (progressEl) {
      let dotsHtml = '';
      for (let i = 0; i < progress.total; i++) {
        let dotClass = 'progress-dot';
        if (i < progress.current - 1) {
          const answer = ExamManager.currentExam.answers[i];
          dotClass += answer.isCorrect ? ' correct' : ' wrong';
        } else if (i === progress.current - 1) {
          dotClass += ' current';
        }
        dotsHtml += `<div class="${dotClass}"></div>`;
      }
      progressEl.innerHTML = dotsHtml;
    }

    if (recordBtn) {
      recordBtn.classList.remove('recording', 'processing');
      recordBtn.innerHTML = '🎤';
    }
    const recordHint = document.getElementById('record-hint');
    if (recordHint) recordHint.textContent = '点击开始录音';
  },

  async playQuestion() {
    const question = ExamManager.getCurrentQuestion();
    if (!question) return;

    if (question.type === 'char') {
      await SpeechManager.speakChar(question.display);
    } else {
      await SpeechManager.speakPinyin(question.pinyin);
    }
  },

  async recordAnswer() {
    if (this.isRecording) {
      return;
    }

    const recordBtn = document.getElementById('record-btn');
    const recordHint = document.getElementById('record-hint');

    if (!SpeechManager.recognitionSupported) {
      this.showFeedback('⚠️', '不支持语音识别', '请使用Chrome浏览器进行考试');
      return;
    }

    this.isRecording = true;
    if (recordBtn) {
      recordBtn.classList.remove('processing');
      recordBtn.classList.add('recording');
      recordBtn.innerHTML = '🔴';
    }
    if (recordHint) recordHint.textContent = '正在录音，请发音...（8秒内）';

    try {
      const result = await SpeechManager.startRecognition(8000);
      
      if (recordBtn) {
        recordBtn.classList.remove('recording');
        recordBtn.classList.add('processing');
        recordBtn.innerHTML = '⏳';
      }
      if (recordHint) recordHint.textContent = '正在识别...';

      const answer = await ExamManager.answerQuestion(result.text);

      if (answer.isCorrect) {
        this.showFeedback('🎉', '回答正确！太棒了！', '', () => {
          this.isRecording = false;
          this.nextQuestion();
        });
      } else {
        const question = ExamManager.currentExam.questions[ExamManager.currentExam.currentIndex - 1];
        this.showFeedback('😢', '回答错误', `正确答案是：${question.answer}（${question.pinyin}）`, () => {
          this.isRecording = false;
          this.nextQuestion();
        });
      }
    } catch (e) {
      console.error('录音错误:', e);
      
      this.isRecording = false;
      
      if (recordBtn) {
        recordBtn.classList.remove('recording', 'processing');
        recordBtn.innerHTML = '🎤';
      }
      if (recordHint) recordHint.textContent = '点击开始录音';
      
      const answer = await ExamManager.answerQuestion('');
      const question = ExamManager.currentExam.questions[ExamManager.currentExam.currentIndex - 1];
      
      this.showFeedback('😅', '未检测到语音或超时', `正确答案是：${question.answer}（${question.pinyin}）`, () => {
        this.nextQuestion();
      });
    }
  },

  skipQuestion() {
    ExamManager.answerQuestion('');
    const question = ExamManager.currentExam.questions[ExamManager.currentExam.currentIndex - 1];
    this.showFeedback('⏭️', '跳过此题', `正确答案是：${question.answer}（${question.pinyin}）`, () => {
      this.nextQuestion();
    });
  },

  nextQuestion() {
    if (ExamManager.isFinished()) {
      this.showExamResult();
    } else {
      this.renderExamQuestion();
    }
  },

  showExamResult() {
    const result = ExamManager.getResult();
    const scoreEl = document.getElementById('result-score');
    const gradeEl = document.getElementById('result-grade');
    const correctEl = document.getElementById('result-correct');
    const wrongEl = document.getElementById('result-wrong');
    const wrongListEl = document.getElementById('result-wrong-list');

    if (scoreEl) {
      scoreEl.textContent = result.score;
      scoreEl.className = `result-score ${result.isPass ? 'pass' : ''}`;
    }
    if (gradeEl) {
      gradeEl.textContent = result.isPass ? '🎉 及格！' : '😢 不及格';
      gradeEl.className = `result-grade ${result.isPass ? 'pass' : 'fail'}`;
    }
    if (correctEl) correctEl.textContent = result.correctCount;
    if (wrongEl) correctEl.textContent = result.wrongCount;

    if (wrongListEl) {
      if (result.wrongAnswers.length > 0) {
        wrongListEl.innerHTML = `
          <h3 style="font-size: 16px; color: var(--text-dark); margin-bottom: 15px;">📝 错题回顾</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            ${result.wrongAnswers.map(a => `
              <div style="background: #FEF2F2; padding: 10px; border-radius: 10px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold;">${a.display}</div>
                <div style="font-size: 12px; color: var(--primary);">${a.pinyin}</div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        wrongListEl.innerHTML = `<div style="font-size: 16px; color: var(--green);">🎊 全部答对！太棒了！</div>`;
      }
    }

    this.navigateTo('exam-result');
  },

  retryExam() {
    ExamManager.startExam(this.selectedExamType, this.selectedDifficulty);
    this.renderExamQuestion();
    this.navigateTo('exam');
  },

  showFeedback(icon, text, answer = '', callback = null) {
    const overlay = document.getElementById('feedback-overlay');
    const iconEl = document.getElementById('feedback-icon');
    const textEl = document.getElementById('feedback-text');
    const answerEl = document.getElementById('feedback-answer');

    if (iconEl) iconEl.textContent = icon;
    if (textEl) {
      textEl.textContent = text;
      textEl.className = `feedback-text ${icon.includes('🎉') || icon.includes('✅') ? 'correct' : 'wrong'}`;
    }
    if (answerEl) answerEl.textContent = answer;

    if (overlay) overlay.classList.remove('hidden');

    if (callback) {
      setTimeout(() => {
        if (overlay) overlay.classList.add('hidden');
        callback();
      }, 1500);
    } else {
      setTimeout(() => {
        if (overlay) overlay.classList.add('hidden');
      }, 1500);
    }
  },

  showConfirm(icon, title, text, callback) {
    const dialog = document.getElementById('confirm-dialog');
    const iconEl = document.getElementById('confirm-icon');
    const titleEl = document.getElementById('confirm-title');
    const textEl = document.getElementById('confirm-text');

    if (iconEl) iconEl.textContent = icon;
    if (titleEl) titleEl.textContent = title;
    if (textEl) textEl.textContent = text;

    this.confirmCallback = callback;
    if (dialog) dialog.classList.remove('hidden');
  },

  closeConfirm(confirmed) {
    const dialog = document.getElementById('confirm-dialog');
    if (dialog) dialog.classList.add('hidden');

    if (this.confirmCallback) {
      this.confirmCallback(confirmed);
      this.confirmCallback = null;
    }
  },

  renderStats() {
    const progress = StorageManager.getTotalProgress();
    const examHistory = StorageManager.getExamHistory();
    const streak = StorageManager.getCheckinStreak();
    const isCheckedToday = StorageManager.isCheckedToday();
    const learnedChars = StorageManager.getLearnedChars();

    const learnedEl = document.getElementById('stat-learned');
    const totalEl = document.getElementById('stat-total');
    const percentageEl = document.getElementById('stat-percentage');
    const examsEl = document.getElementById('stat-exams');
    const streakEl = document.getElementById('streak-num');
    const checkinBtn = document.getElementById('checkin-btn');

    if (learnedEl) learnedEl.textContent = progress.learned;
    if (totalEl) totalEl.textContent = progress.total;
    if (percentageEl) percentageEl.textContent = progress.percentage + '%';
    if (examsEl) examsEl.textContent = examHistory.length;
    if (streakEl) streakEl.textContent = streak + ' 天';
    if (checkinBtn) {
      if (isCheckedToday) {
        checkinBtn.textContent = '已打卡 ✓';
        checkinBtn.disabled = true;
        checkinBtn.style.opacity = '0.6';
      } else {
        checkinBtn.textContent = '立即打卡';
        checkinBtn.disabled = false;
        checkinBtn.style.opacity = '1';
      }
    }

    this.renderLearnedChars();
    this.renderExamHistory();
  },

  renderLearnedChars() {
    const grid = document.getElementById('learned-chars-grid');
    if (!grid) return;

    const learned = StorageManager.getLearnedChars();
    
    if (learned.length === 0) {
      grid.innerHTML = '<div style="grid-column: span 5; text-align: center; padding: 20px; color: var(--text-gray);">还没有学会的字哦~</div>';
      return;
    }

    const charsData = [];
    for (let i = 1; i <= 5; i++) {
      const levelChars = getCharsByLevel(i);
      levelChars.forEach(char => {
        if (learned.includes(char.char)) {
          charsData.push(char);
        }
      });
    }

    const last20 = charsData.slice(-20).reverse();
    grid.innerHTML = last20.map(char => `
      <div class="learned-char" onclick="App.speakChar('${char.char}')">
        <div class="learned-char-text">${char.char}</div>
        <div class="learned-char-pinyin">${char.pinyin}</div>
      </div>
    `).join('');
  },

  renderExamHistory() {
    const list = document.getElementById('exam-history-list');
    if (!list) return;

    const history = StorageManager.getExamHistory();
    
    if (history.length === 0) {
      list.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-gray);">还没有考试记录~</div>';
      return;
    }

    const typeIcons = {
      'shengmu': '🅰️',
      'yunmu': '🔤',
      'combine': '🔗',
      'chars': '📖'
    };

    list.innerHTML = history.slice(0, 10).map(record => {
      const date = new Date(record.date);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      
      return `
        <div class="history-item">
          <span class="history-type">${typeIcons[record.type] || '📝'}</span>
          <div class="history-info">
            <div class="history-name">${ExamManager.getExamTypeName(record.type)} · ${ExamManager.difficulties[record.difficulty]?.name || ''}</div>
            <div class="history-date">${dateStr}</div>
          </div>
          <div class="history-score ${record.isPass ? 'pass' : 'fail'}">${record.score}分</div>
        </div>
      `;
    }).join('');
  },

  doCheckin() {
    StorageManager.checkin();
    this.renderStats();
    this.showFeedback('🎉', '打卡成功！', '坚持学习，你真棒！');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
