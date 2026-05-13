let currentLevel = null;
let currentStory = null;
let isPlaying = false;
let currentUtterance = null;

const pages = {
    home: document.getElementById('home-page'),
    stories: document.getElementById('stories-page'),
    reading: document.getElementById('reading-page'),
    review: document.getElementById('review-page'),
    finish: document.getElementById('finish-page')
};

const navBtns = {
    home: document.getElementById('btn-home'),
    stories: document.getElementById('btn-stories')
};

function showPage(pageName) {
    Object.keys(pages).forEach(key => {
        pages[key].classList.toggle('hidden', key !== pageName);
    });
    Object.keys(navBtns).forEach(key => {
        navBtns[key].classList.toggle('active', key === pageName);
    });
}

function renderLevels() {
    const container = document.getElementById('levels-grid');
    container.innerHTML = levels.map(level => `
        <div class="level-card ${level.color}" data-level="${level.id}">
            <div class="level-number">${level.id}</div>
            <div class="level-name">${level.name}</div>
            <div class="level-desc">${level.desc}</div>
        </div>
    `).join('');

    container.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', () => {
            currentLevel = parseInt(card.dataset.level);
            showStoriesPage();
        });
    });
}

function showStoriesPage() {
    const level = levels.find(l => l.id === currentLevel);
    document.getElementById('current-level-title').textContent = `${level.name} - 故事列表`;
    
    const container = document.getElementById('stories-grid');
    const levelStories = stories.filter(s => s.level === currentLevel);
    
    container.innerHTML = levelStories.map(story => `
        <div class="story-card" data-story="${story.id}">
            <div class="story-card-image" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
                ${story.icon}
            </div>
            <div class="story-card-content">
                <div class="story-card-title">${story.title}</div>
                <div class="story-card-desc">${story.description}</div>
                <div class="story-card-meta">
                    <span>📝 ${story.paragraphs.length}段</span>
                    <span>⭐ ${story.keyWords.length}个字</span>
                </div>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.story-card').forEach(card => {
        card.addEventListener('click', () => {
            currentStory = stories.find(s => s.id === parseInt(card.dataset.story));
            showReadingPage();
        });
    });

    showPage('stories');
}

function showReadingPage() {
    document.getElementById('story-title').textContent = currentStory.title;
    
    const container = document.getElementById('story-content');
    const keyChars = new Set(currentStory.keyWords.map(k => k.char));
    
    container.innerHTML = currentStory.paragraphs.map(paragraph => {
        const chars = paragraph.split('').map(char => {
            const isKey = keyChars.has(char);
            const pinyin = getPinyin(char);
            if (char === ' ' || char === '，' || char === '。' || char === '！' || char === '？' || char === '、' || char === '：') {
                return `<span class="char-wrapper" data-char="${char}"><span class="char-text">${char}</span></span>`;
            }
            return `
                <span class="char-wrapper ${isKey ? 'key-word' : ''}" data-char="${char}" data-pinyin="${pinyin}">
                    <span class="char-pinyin">${pinyin}</span>
                    <span class="char-text">${char}</span>
                </span>
            `;
        }).join('');
        
        return `<div class="story-paragraph">${chars}</div>`;
    }).join('');

    container.querySelectorAll('.char-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const char = wrapper.dataset.char;
            const pinyin = wrapper.dataset.pinyin;
            playChar(char, pinyin, wrapper);
        });
    });

    showPage('reading');
}

function playChar(char, pinyin, element) {
    if (!('speechSynthesis' in window)) {
        alert('您的浏览器不支持语音朗读，请使用现代浏览器');
        return;
    }

    stopAllPlay();

    const utterance = new SpeechSynthesisUtterance(char);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.7;
    
    if (element) {
        utterance.onstart = () => {
            element.classList.add('playing');
        };
        utterance.onend = () => {
            element.classList.remove('playing');
        };
    }

    speechSynthesis.speak(utterance);
}

function playParagraphs(autoStartReview = false) {
    if (!('speechSynthesis' in window)) {
        alert('您的浏览器不支持语音朗读，请使用现代浏览器');
        return;
    }

    stopAllPlay();
    isPlaying = true;

    const allChars = document.querySelectorAll('.char-wrapper');
    let currentIndex = 0;

    const punctuationMarks = new Set(['，', '。', '！', '？', '、', '：', '；', '「', '」', '（', '）', '【', '】', ' ', '']);

    function isPunctuation(char) {
        return punctuationMarks.has(char);
    }

    function playNext() {
        if (currentIndex >= allChars.length || !isPlaying) {
            isPlaying = false;
            if (autoStartReview && currentIndex >= allChars.length) {
                setTimeout(() => {
                    showReviewPage();
                    setTimeout(playAllReviewWords, 1000);
                }, 500);
            }
            return;
        }

        const wrapper = allChars[currentIndex];
        const char = wrapper.dataset.char;

        if (isPunctuation(char)) {
            wrapper.classList.add('playing');
            const pauseTime = (char === '。' || char === '！' || char === '？') ? 500 : 250;
            setTimeout(() => {
                wrapper.classList.remove('playing');
                currentIndex++;
                playNext();
            }, pauseTime);
            return;
        }

        let sentenceEnd = currentIndex;
        let sentence = '';
        const sentenceWrappers = [];

        while (sentenceEnd < allChars.length) {
            const charWrapper = allChars[sentenceEnd];
            const c = charWrapper.dataset.char;
            
            if (isPunctuation(c)) {
                break;
            }
            
            sentence += c;
            sentenceWrappers.push(charWrapper);
            sentenceEnd++;
        }

        const utterance = new SpeechSynthesisUtterance(sentence);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.95;
        utterance.pitch = 1.1;

        const charInterval = Math.max(200, 1500 / sentence.length);
        let charIndex = 0;

        utterance.onstart = () => {
            let highlightTimer = setInterval(() => {
                if (!isPlaying) {
                    clearInterval(highlightTimer);
                    return;
                }
                
                if (charIndex > 0 && charIndex - 1 < sentenceWrappers.length) {
                    sentenceWrappers[charIndex - 1].classList.remove('playing');
                }
                if (charIndex < sentenceWrappers.length) {
                    sentenceWrappers[charIndex].classList.add('playing');
                    charIndex++;
                }
            }, charInterval);

            utterance.highlightTimer = highlightTimer;
        };

        utterance.onend = () => {
            if (utterance.highlightTimer) {
                clearInterval(utterance.highlightTimer);
            }
            sentenceWrappers.forEach(w => w.classList.remove('playing'));
            currentIndex = sentenceEnd;
            playNext();
        };

        speechSynthesis.speak(utterance);
    }

    playNext();
}

function stopAllPlay() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
    isPlaying = false;
    document.querySelectorAll('.playing').forEach(el => {
        el.classList.remove('playing');
    });
}

function showReviewPage() {
    const container = document.getElementById('review-grid');
    
    container.innerHTML = currentStory.keyWords.map((keyword, index) => `
        <div class="review-card" data-char="${keyword.char}" data-pinyin="${getPinyin(keyword.char)}" data-words="${keyword.words}" data-index="${index}">
            <div class="review-char">${keyword.char}</div>
            <div class="review-pinyin">${getPinyin(keyword.char)}</div>
            <div class="review-words">${keyword.words}</div>
        </div>
    `).join('');

    container.querySelectorAll('.review-card').forEach(card => {
        card.addEventListener('click', () => {
            const char = card.dataset.char;
            const pinyin = card.dataset.pinyin;
            const words = card.dataset.words;
            playReviewWord(char, pinyin, words, card);
        });
    });

    showPage('review');
}

const pinyinSoundMap = {
    'b': '波', 'p': '坡', 'm': '摸', 'f': '佛',
    'd': '得', 't': '特', 'n': '讷', 'l': '勒',
    'g': '哥', 'k': '科', 'h': '喝',
    'j': '基', 'q': '欺', 'x': '希',
    'zh': '知', 'ch': '吃', 'sh': '诗', 'r': '日',
    'z': '资', 'c': '雌', 's': '思',
    'y': '一', 'w': '五',
    'a': '啊', 'o': '喔', 'e': '鹅', 'i': '一', 'u': '乌', 'v': '迂', 'ü': '迂',
    'ai': '哀', 'ei': '欸', 'ui': '威', 'ao': '熬', 'ou': '欧',
    'iu': '优', 'ie': '耶', 've': '约', 'üe': '约', 'er': '二',
    'an': '安', 'en': '恩', 'in': '因', 'un': '温', 'vn': '晕', 'ün': '晕',
    'ang': '昂', 'eng': '鞥', 'ing': '英', 'ong': '翁'
};

function getChinesePhoneticSequence(pinyin) {
    const pinyinNoTone = pinyin.replace(/[āáǎà]/g, 'a').replace(/[ēéěè]/g, 'e').replace(/[īíǐì]/g, 'i').replace(/[ōóǒò]/g, 'o').replace(/[ūúǔù]/g, 'u').replace(/[ǖǘǚǜü]/g, 'ü');
    
    const initials = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'];
    const finals = ['a', 'o', 'e', 'i', 'u', 'v', 'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 've', 'er', 'an', 'en', 'in', 'un', 'vn', 'ang', 'eng', 'ing', 'ong'];
    
    let initial = '';
    let final = '';
    let remaining = pinyinNoTone;
    
    for (let i = 0; i < initials.length; i++) {
        if (pinyinNoTone.startsWith(initials[i])) {
            initial = initials[i];
            remaining = pinyinNoTone.substring(initial.length);
            break;
        }
    }
    
    if (remaining.length > 0) {
        for (let i = finals.length - 1; i >= 0; i--) {
            if (remaining === finals[i] || remaining.endsWith(finals[i])) {
                final = finals[i];
                break;
            }
        }
    }
    
    const sequence = [];
    
    if (initial) {
        sequence.push(pinyinSoundMap[initial] || initial);
    }
    
    if (final) {
        if (final.length === 1) {
            sequence.push(pinyinSoundMap[final] || final);
        } else if (final.length >= 2) {
            for (let i = 0; i < final.length; i++) {
                sequence.push(pinyinSoundMap[final[i]] || final[i]);
            }
            sequence.push(pinyinSoundMap[final] || final);
        }
    }
    
    if (initial && final) {
        sequence.push(pinyin);
    }
    
    return sequence;
}

function playReviewWord(char, pinyin, words, card) {
    if (!('speechSynthesis' in window)) {
        alert('您的浏览器不支持语音朗读，请使用现代浏览器');
        return;
    }

    stopAllPlay();
    isPlaying = true;

    const phoneticSequence = getChinesePhoneticSequence(pinyin);
    
    const texts = [];
    texts.push(char);
    phoneticSequence.forEach(p => {
        texts.push(p);
    });
    if (words && words.length > 0) {
        texts.push(words);
    }

    let currentTextIndex = 0;

    function speakNext() {
        if (currentTextIndex >= texts.length || !isPlaying) {
            isPlaying = false;
            card.classList.remove('playing');
            return;
        }

        const text = texts[currentTextIndex];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        
        if (currentTextIndex === 0) {
            utterance.rate = 0.8;
        } else if (currentTextIndex === texts.length - 1) {
            utterance.rate = 0.7;
        } else {
            utterance.rate = 0.6;
        }

        utterance.onstart = () => {
            card.classList.add('playing');
        };

        utterance.onend = () => {
            currentTextIndex++;
            const delay = (currentTextIndex === 1) ? 400 : 300;
            setTimeout(speakNext, delay);
        };

        speechSynthesis.speak(utterance);
    }

    speakNext();
}

function playAllReviewWords() {
    if (!('speechSynthesis' in window)) {
        alert('您的浏览器不支持语音朗读，请使用现代浏览器');
        return;
    }

    stopAllPlay();
    isPlaying = true;

    const cards = document.querySelectorAll('.review-card');
    let currentCardIndex = 0;

    function playNextCard() {
        if (currentCardIndex >= cards.length || !isPlaying) {
            isPlaying = false;
            return;
        }

        const card = cards[currentCardIndex];
        const char = card.dataset.char;
        const pinyin = card.dataset.pinyin;
        const words = card.dataset.words;

        const phoneticSequence = getChinesePhoneticSequence(pinyin);
        
        const texts = [];
        texts.push(char);
        phoneticSequence.forEach(p => {
            texts.push(p);
        });
        if (words && words.length > 0) {
            texts.push(words);
        }

        let currentTextIndex = 0;

        function speakNext() {
            if (currentTextIndex >= texts.length || !isPlaying) {
                card.classList.remove('playing');
                currentCardIndex++;
                setTimeout(playNextCard, 500);
                return;
            }

            const text = texts[currentTextIndex];
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            
            if (currentTextIndex === 0) {
                utterance.rate = 0.8;
            } else if (currentTextIndex === texts.length - 1) {
                utterance.rate = 0.7;
            } else {
                utterance.rate = 0.6;
            }

            utterance.onstart = () => {
                card.classList.add('playing');
            };

            utterance.onend = () => {
                currentTextIndex++;
                const delay = (currentTextIndex === 1) ? 400 : 300;
                setTimeout(speakNext, delay);
            };

            speechSynthesis.speak(utterance);
        }

        speakNext();
    }

    playNextCard();
}

function initEventListeners() {
    document.getElementById('btn-home').addEventListener('click', () => {
        stopAllPlay();
        showPage('home');
    });

    document.getElementById('btn-stories').addEventListener('click', () => {
        stopAllPlay();
        if (!currentLevel) currentLevel = 1;
        showStoriesPage();
    });

    document.getElementById('back-to-home').addEventListener('click', () => {
        stopAllPlay();
        showPage('home');
    });

    document.getElementById('back-to-stories').addEventListener('click', () => {
        stopAllPlay();
        showStoriesPage();
    });

    document.getElementById('back-to-reading').addEventListener('click', () => {
        stopAllPlay();
        showReadingPage();
    });

    document.getElementById('play-all').addEventListener('click', () => playParagraphs(false));
    document.getElementById('play-auto-review').addEventListener('click', () => playParagraphs(true));
    document.getElementById('stop-play').addEventListener('click', stopAllPlay);

    document.getElementById('to-review').addEventListener('click', () => {
        stopAllPlay();
        showReviewPage();
    });

    document.getElementById('play-all-review').addEventListener('click', playAllReviewWords);
    document.getElementById('finish-review').addEventListener('click', () => {
        stopAllPlay();
        showPage('finish');
    });

    document.getElementById('go-home').addEventListener('click', () => {
        showPage('home');
    });

    document.getElementById('read-more').addEventListener('click', () => {
        showStoriesPage();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderLevels();
    initEventListeners();
});
