const StorageManager = {
  PREFIX: 'pinyin_app_',

  keys: {
    LEARNED_CHARS: 'learned_chars',
    CHECKIN_DATES: 'checkin_dates',
    EXAM_HISTORY: 'exam_history',
    SETTINGS: 'settings'
  },

  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(this.PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(this.PREFIX + key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e);
      return false;
    }
  },

  getLearnedChars() {
    return this.get(this.keys.LEARNED_CHARS, []);
  },

  isCharLearned(char) {
    const learned = this.getLearnedChars();
    return learned.includes(char);
  },

  addLearnedChar(char) {
    const learned = this.getLearnedChars();
    if (!learned.includes(char)) {
      learned.push(char);
      this.set(this.keys.LEARNED_CHARS, learned);
    }
    return learned;
  },

  removeLearnedChar(char) {
    let learned = this.getLearnedChars();
    learned = learned.filter(c => c !== char);
    this.set(this.keys.LEARNED_CHARS, learned);
    return learned;
  },

  getCheckinDates() {
    return this.get(this.keys.CHECKIN_DATES, []);
  },

  getTodayDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  },

  isCheckedToday() {
    const dates = this.getCheckinDates();
    const today = this.getTodayDate();
    return dates.includes(today);
  },

  checkin() {
    const dates = this.getCheckinDates();
    const today = this.getTodayDate();
    if (!dates.includes(today)) {
      dates.push(today);
      this.set(this.keys.CHECKIN_DATES, dates);
    }
    return dates;
  },

  getCheckinStreak() {
    const dates = this.getCheckinDates();
    if (dates.length === 0) return 0;

    dates.sort((a, b) => new Date(b) - new Date(a));
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let checkDate = new Date(today);

    for (let i = 0; i < dates.length; i++) {
      const dateStr = dates[i];
      const storedDate = new Date(dateStr);
      storedDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((checkDate - storedDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        streak++;
        checkDate = storedDate;
      } else if (diffDays > 1) {
        break;
      }
    }

    return streak;
  },

  getExamHistory() {
    return this.get(this.keys.EXAM_HISTORY, []);
  },

  addExamResult(result) {
    const history = this.getExamHistory();
    history.unshift({
      ...result,
      date: new Date().toISOString(),
      id: Date.now()
    });
    if (history.length > 20) {
      history.pop();
    }
    this.set(this.keys.EXAM_HISTORY, history);
    return history;
  },

  getLevelProgress(level) {
    const learned = this.getLearnedChars();
    const levelChars = getCharsByLevel(level);
    let count = 0;
    levelChars.forEach(char => {
      if (learned.includes(char.char)) {
        count++;
      }
    });
    return {
      learned: count,
      total: levelChars.length,
      percentage: levelChars.length > 0 ? Math.round((count / levelChars.length) * 100) : 0
    };
  },

  getTotalProgress() {
    const learned = this.getLearnedChars();
    let totalChars = 0;
    let learnedCount = 0;

    for (let i = 1; i <= 5; i++) {
      const levelChars = getCharsByLevel(i);
      totalChars += levelChars.length;
      levelChars.forEach(char => {
        if (learned.includes(char.char)) {
          learnedCount++;
        }
      });
    }

    return {
      learned: learnedCount,
      total: totalChars,
      percentage: totalChars > 0 ? Math.round((learnedCount / totalChars) * 100) : 0
    };
  },

  isGroupLearned(level, groupIndex) {
    const groups = getCharsGroupedByLevel(level);
    if (groupIndex >= groups.length) return false;

    const group = groups[groupIndex];
    const learned = this.getLearnedChars();

    return group.every(char => learned.includes(char.char));
  },

  isGroupCheckedToday(level, groupIndex) {
    const dates = this.getCheckinDates();
    const today = this.getTodayDate();
    
    const groupKey = `${level}-${groupIndex}`;
    const settings = this.get(this.keys.SETTINGS, {});
    const groupCheckins = settings.groupCheckins || {};
    
    return groupCheckins[groupKey] === today;
  },

  setGroupCheckin(level, groupIndex) {
    const settings = this.get(this.keys.SETTINGS, {});
    if (!settings.groupCheckins) {
      settings.groupCheckins = {};
    }
    
    const groupKey = `${level}-${groupIndex}`;
    settings.groupCheckins[groupKey] = this.getTodayDate();
    this.set(this.keys.SETTINGS, settings);
  }
};
