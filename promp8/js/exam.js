const ExamManager = {
  currentExam: null,

  examTypes: {
    SHENGMU: 'shengmu',
    YUNMU: 'yunmu',
    ZHENTI: 'zhengti',
    COMBINE: 'combine',
    CHARS: 'chars'
  },

  difficulties: {
    EASY: { name: '简单', numQuestions: 10 },
    MEDIUM: { name: '中等', numQuestions: 15 },
    HARD: { name: '困难', numQuestions: 20 }
  },

  startExam(examType, difficulty = 'EASY') {
    const difficultyConfig = this.difficulties[difficulty];
    const questions = this.generateQuestions(examType, difficultyConfig.numQuestions);

    this.currentExam = {
      type: examType,
      difficulty: difficulty,
      questions: questions,
      currentIndex: 0,
      answers: [],
      startTime: Date.now()
    };

    return this.currentExam;
  },

  generateQuestions(examType, numQuestions) {
    let pool = [];

    switch (examType) {
      case this.examTypes.SHENGMU:
        pool = PinyinData.shengmu.map(item => ({
          type: 'pinyin',
          display: item.pinyin,
          answer: item.name,
          pinyin: item.pinyin
        }));
        break;

      case this.examTypes.YUNMU:
        const allYunmu = [
          ...PinyinData.yunmu.dan,
          ...PinyinData.yunmu.fu,
          ...PinyinData.yunmu.qianbi,
          ...PinyinData.yunmu.houbi
        ];
        pool = allYunmu.map(item => ({
          type: 'pinyin',
          display: item.pinyin,
          answer: item.name,
          pinyin: item.pinyin
        }));
        break;

      case this.examTypes.ZHENTI:
        pool = PinyinData.zhengti.map(item => ({
          type: 'pinyin',
          display: item.pinyin,
          answer: item.name,
          pinyin: item.pinyin
        }));
        break;

      case this.examTypes.COMBINE:
        const allCombine = [
          ...PinyinData.liangpin,
          ...PinyinData.sanpin
        ];
        pool = allCombine.map(item => ({
          type: 'pinyin',
          display: item.pinyin,
          answer: item.name,
          pinyin: item.pinyin,
          example: item.example
        }));
        break;

      case this.examTypes.CHARS:
        for (let i = 1; i <= 5; i++) {
          const levelChars = getCharsByLevel(i);
          pool = pool.concat(levelChars.map(char => ({
            type: 'char',
            display: char.char,
            answer: char.char,
            pinyin: char.pinyin,
            meaning: char.meaning,
            level: i
          })));
        }
        break;
    }

    return this.shuffleArray(pool).slice(0, numQuestions);
  },

  shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  getCurrentQuestion() {
    if (!this.currentExam) return null;
    return this.currentExam.questions[this.currentExam.currentIndex];
  },

  async answerQuestion(recognizedText) {
    if (!this.currentExam) return null;

    const question = this.getCurrentQuestion();
    const isCorrect = SpeechManager.checkPronunciation(
      recognizedText,
      question.answer,
      question.pinyin
    );

    const answer = {
      question: question,
      recognizedText: recognizedText,
      isCorrect: isCorrect,
      timestamp: Date.now()
    };

    this.currentExam.answers.push(answer);
    this.currentExam.currentIndex++;

    return answer;
  },

  isFinished() {
    if (!this.currentExam) return true;
    return this.currentExam.currentIndex >= this.currentExam.questions.length;
  },

  getProgress() {
    if (!this.currentExam) return { current: 0, total: 0, percentage: 0 };
    return {
      current: this.currentExam.currentIndex + 1,
      total: this.currentExam.questions.length,
      percentage: Math.round(((this.currentExam.currentIndex + 1) / this.currentExam.questions.length) * 100)
    };
  },

  getResult() {
    if (!this.currentExam) return null;

    const total = this.currentExam.questions.length;
    const correct = this.currentExam.answers.filter(a => a.isCorrect).length;
    const score = Math.round((correct / total) * 100);
    const isPass = score >= 60;

    const wrongAnswers = this.currentExam.answers
      .filter(a => !a.isCorrect)
      .map(a => ({
        display: a.question.display,
        answer: a.question.answer,
        pinyin: a.question.pinyin,
        recognized: a.recognizedText
      }));

    const result = {
      type: this.currentExam.type,
      difficulty: this.currentExam.difficulty,
      totalQuestions: total,
      correctCount: correct,
      wrongCount: total - correct,
      score: score,
      isPass: isPass,
      wrongAnswers: wrongAnswers,
      duration: Math.round((Date.now() - this.currentExam.startTime) / 1000)
    };

    StorageManager.addExamResult(result);
    return result;
  },

  getExamTypeName(type) {
    const names = {
      [this.examTypes.SHENGMU]: '声母考试',
      [this.examTypes.YUNMU]: '韵母考试',
      [this.examTypes.ZHENTI]: '整体认读音节考试',
      [this.examTypes.COMBINE]: '组合发音考试',
      [this.examTypes.CHARS]: '汉字发音考试'
    };
    return names[type] || '拼音考试';
  }
};
