let currentLevel = null;
let currentStory = null;
let favorites = JSON.parse(localStorage.getItem('idiom-stories-favorites')) || [];

let speechSynthesis = window.speechSynthesis;
let utterance = null;
let isPlaying = false;
let isPaused = false;
let currentCharIndex = 0;
let fullText = '';
let updateTimer = null;
const charsPerSecond = 3;

const levelNames = {
    easy: '3-6岁 入门级',
    medium: '7-10岁 基础级',
    hard: '11岁以上 进阶级'
};

const navHomeBtn = document.getElementById('nav-home');
const navFavoritesBtn = document.getElementById('nav-favorites');
const homePage = document.getElementById('home-page');
const storyPage = document.getElementById('story-page');
const favoritesPage = document.getElementById('favorites-page');

const ageSelector = document.querySelector('.age-selector');
const storyListContainer = document.getElementById('story-list-container');
const levelTitle = document.getElementById('level-title');
const storyList = document.getElementById('story-list');
const backHomeBtn = document.getElementById('back-home');
const backListBtn = document.getElementById('back-list');

const storyTitle = document.getElementById('story-title');
const storyContent = document.getElementById('story-content');
const storyMeaning = document.getElementById('story-meaning').querySelector('p');
const favoriteBtn = document.getElementById('favorite-btn');

const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeSpan = document.getElementById('current-time');
const totalTimeSpan = document.getElementById('total-time');

const favoritesList = document.getElementById('favorites-list');
const noFavorites = document.getElementById('no-favorites');

function showPage(pageName) {
    homePage.classList.remove('active');
    storyPage.classList.remove('active');
    favoritesPage.classList.remove('active');
    navHomeBtn.classList.remove('active');
    navFavoritesBtn.classList.remove('active');

    if (pageName === 'home') {
        homePage.classList.add('active');
        navHomeBtn.classList.add('active');
    } else if (pageName === 'story') {
        storyPage.classList.add('active');
    } else if (pageName === 'favorites') {
        favoritesPage.classList.add('active');
        navFavoritesBtn.classList.add('active');
        renderFavorites();
    }
}

function showStoryList(level) {
    currentLevel = level;
    ageSelector.classList.add('hidden');
    storyListContainer.classList.remove('hidden');
    levelTitle.textContent = levelNames[level];
    
    const levelStories = stories[level];
    storyList.innerHTML = '';
    
    levelStories.forEach(story => {
        const card = document.createElement('div');
        card.className = 'story-card';
        card.innerHTML = `
            <h3>${story.title}</h3>
            <p>${story.summary}</p>
        `;
        card.addEventListener('click', () => openStory(story));
        storyList.appendChild(card);
    });
}

function goBackHome() {
    ageSelector.classList.remove('hidden');
    storyListContainer.classList.add('hidden');
    currentLevel = null;
}

function openStory(story) {
    currentStory = story;
    stopAudio();
    
    storyTitle.textContent = story.title;
    storyContent.innerHTML = story.content.replace(/\n\n/g, '</p><p>').replace(/^(.*)$/, '<p>$1</p>');
    storyMeaning.textContent = story.meaning;
    
    updateFavoriteButton();
    
    const cleanContent = story.content.replace(/[。！？.!?]+$/, '');
    const cleanMeaning = story.meaning.replace(/[。！？.!?]+$/, '');
    fullText = `${story.title}。${cleanContent}。故事解读：${cleanMeaning}。`;
    
    currentCharIndex = 0;
    progressBar.value = 0;
    currentTimeSpan.textContent = '0:00';
    
    const totalSeconds = Math.ceil(fullText.length / charsPerSecond);
    totalTimeSpan.textContent = formatTime(totalSeconds);
    
    showPage('story');
}

function goBackList() {
    stopAudio();
    
    if (currentLevel) {
        showPage('home');
        ageSelector.classList.add('hidden');
        storyListContainer.classList.remove('hidden');
    } else {
        showPage('favorites');
    }
}

function toggleFavorite() {
    if (!currentStory) return;
    
    const index = favorites.findIndex(s => s.id === currentStory.id);
    
    if (index === -1) {
        favorites.push({
            id: currentStory.id,
            title: currentStory.title,
            summary: currentStory.summary,
            content: currentStory.content,
            meaning: currentStory.meaning
        });
    } else {
        favorites.splice(index, 1);
    }
    
    localStorage.setItem('idiom-stories-favorites', JSON.stringify(favorites));
    updateFavoriteButton();
}

function updateFavoriteButton() {
    if (!currentStory) return;
    
    const isFavorite = favorites.some(s => s.id === currentStory.id);
    
    if (isFavorite) {
        favoriteBtn.classList.add('active');
        favoriteBtn.textContent = '已收藏';
    } else {
        favoriteBtn.classList.remove('active');
        favoriteBtn.textContent = '收藏';
    }
}

function renderFavorites() {
    favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
        noFavorites.classList.remove('hidden');
        favoritesList.classList.add('hidden');
        return;
    }
    
    noFavorites.classList.add('hidden');
    favoritesList.classList.remove('hidden');
    
    favorites.forEach(story => {
        const card = document.createElement('div');
        card.className = 'story-card';
        card.innerHTML = `
            <h3>${story.title}</h3>
            <p>${story.summary}</p>
        `;
        card.addEventListener('click', () => {
            currentLevel = null;
            openStory(story);
        });
        favoritesList.appendChild(card);
    });
}

function updateProgress() {
    if (!fullText) return;
    
    const progress = (currentCharIndex / fullText.length) * 100;
    progressBar.value = progress;
    
    const currentSeconds = Math.ceil(currentCharIndex / charsPerSecond);
    currentTimeSpan.textContent = formatTime(currentSeconds);
}

function startProgressTimer() {
    if (updateTimer) clearInterval(updateTimer);
    
    updateTimer = setInterval(() => {
        if (!isPlaying || isPaused) return;
        
        currentCharIndex += charsPerSecond;
        if (currentCharIndex > fullText.length) {
            currentCharIndex = fullText.length;
        }
        
        updateProgress();
    }, 1000);
}

function stopProgressTimer() {
    if (updateTimer) {
        clearInterval(updateTimer);
        updateTimer = null;
    }
}

function playAudio() {
    if (isPlaying && !isPaused) return;
    
    if (isPaused) {
        speechSynthesis.resume();
        isPaused = false;
        pauseBtn.textContent = '暂停';
        startProgressTimer();
        return;
    }
    
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    if (currentCharIndex >= fullText.length) {
        currentCharIndex = 0;
    }
    
    const remainingText = fullText.substring(currentCharIndex);
    utterance = new SpeechSynthesisUtterance(remainingText);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
        isPlaying = true;
        isPaused = false;
        pauseBtn.textContent = '暂停';
        startProgressTimer();
    };
    
    utterance.onend = () => {
        isPlaying = false;
        isPaused = false;
        pauseBtn.textContent = '暂停';
        currentCharIndex = fullText.length;
        progressBar.value = 100;
        
        const totalSeconds = Math.ceil(fullText.length / charsPerSecond);
        currentTimeSpan.textContent = formatTime(totalSeconds);
        
        stopProgressTimer();
    };
    
    utterance.onerror = () => {
        isPlaying = false;
        isPaused = false;
        pauseBtn.textContent = '暂停';
        stopProgressTimer();
    };
    
    speechSynthesis.speak(utterance);
}

function pauseAudio() {
    if (!isPlaying) return;
    
    if (isPaused) {
        playAudio();
    } else {
        speechSynthesis.pause();
        isPaused = true;
        pauseBtn.textContent = '继续';
        stopProgressTimer();
    }
}

function stopAudio() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    isPlaying = false;
    isPaused = false;
    pauseBtn.textContent = '暂停';
    currentCharIndex = 0;
    progressBar.value = 0;
    currentTimeSpan.textContent = '0:00';
    stopProgressTimer();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function seekAudio(value) {
    if (!fullText) return;
    
    const wasPlaying = isPlaying;
    const wasPaused = isPaused;
    
    const progress = value / 100;
    currentCharIndex = Math.floor(fullText.length * progress);
    
    updateProgress();
    
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    
    if (!wasPlaying && !wasPaused) {
        return;
    }
    
    isPlaying = false;
    isPaused = false;
    pauseBtn.textContent = '暂停';
    
    const remainingText = fullText.substring(currentCharIndex);
    utterance = new SpeechSynthesisUtterance(remainingText);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
        isPlaying = true;
        startProgressTimer();
    };
    
    utterance.onend = () => {
        isPlaying = false;
        isPaused = false;
        pauseBtn.textContent = '暂停';
        currentCharIndex = fullText.length;
        progressBar.value = 100;
        
        const totalSeconds = Math.ceil(fullText.length / charsPerSecond);
        currentTimeSpan.textContent = formatTime(totalSeconds);
        
        stopProgressTimer();
    };
    
    utterance.onerror = () => {
        isPlaying = false;
        isPaused = false;
        pauseBtn.textContent = '暂停';
        stopProgressTimer();
    };
    
    speechSynthesis.speak(utterance);
}

navHomeBtn.addEventListener('click', () => {
    stopAudio();
    showPage('home');
    goBackHome();
});

navFavoritesBtn.addEventListener('click', () => {
    stopAudio();
    showPage('favorites');
});

document.querySelectorAll('.age-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.dataset.level;
        showStoryList(level);
    });
});

backHomeBtn.addEventListener('click', goBackHome);
backListBtn.addEventListener('click', goBackList);
favoriteBtn.addEventListener('click', toggleFavorite);

playBtn.addEventListener('click', playAudio);
pauseBtn.addEventListener('click', pauseAudio);
stopBtn.addEventListener('click', stopAudio);

progressBar.addEventListener('change', (e) => {
    seekAudio(e.target.value);
});
