class Game {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.mazeGenerator = new MazeGenerator();
        this.physics = new PhysicsEngine();
        this.inputManager = new InputManager();
        
        this.currentLevel = 1;
        this.mazeData = null;
        this.gameState = 'menu';
        
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        
        this.animationFrameId = null;
        this.lastFrameTime = 0;
        
        this.offsetX = 0;
        this.offsetY = 0;
        
        this.adCountdown = 10;
        this.adInterval = null;
        
        this.isRunning = false;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        
        this.init();
    }

    init() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            console.error('Canvas not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Canvas context not available!');
            return;
        }
        
        console.log('Game initialized');
        
        this.setupCanvas();
        window.addEventListener('resize', () => this.setupCanvas());
        
        this.inputManager.init(this.physics);
        this.bindEvents();
        this.showScreen('start-screen');
        
        console.log('Ready - click start');
    }

    setupCanvas() {
        const container = document.getElementById('game-container');
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
        
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        
        if (this.mazeData && this.gameState !== 'menu') {
            this.calculateOffset();
        }
        
        console.log('Canvas setup:', this.canvasWidth, 'x', this.canvasHeight);
    }

    calculateOffset() {
        if (!this.mazeData) return;
        
        const { width, height, cellSize } = this.mazeData;
        const mazeWidth = width * cellSize;
        const mazeHeight = height * cellSize;
        
        this.offsetX = Math.max(0, (this.canvasWidth - mazeWidth) / 2);
        this.offsetY = Math.max(0, (this.canvasHeight - mazeHeight) / 2);
    }

    bindEvents() {
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Start clicked');
                this.startGame();
            });
        }
        
        const calibrateBtn = document.getElementById('calibrate-btn');
        if (calibrateBtn) {
            calibrateBtn.addEventListener('click', () => {
                this.physics.calibrate();
                this.showMessage('校准成功！');
            });
        }
        
        this.bindModalEvents();
    }

    bindModalEvents() {
        const events = {
            'pause-btn': () => this.pauseGame(),
            'resume-btn': () => this.resumeGame(),
            'restart-btn': () => this.restartLevel(),
            'quit-btn': () => this.quitToMenu(),
            'watch-ad-btn': () => this.watchAd(),
            'give-up-btn': () => this.gameOver(),
            'next-level-btn': () => this.nextLevel(),
            'retry-btn': () => this.restartLevel(),
            'close-btn': () => this.quitToMenu()
        };
        
        for (const [id, handler] of Object.entries(events)) {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', handler);
            }
        }
    }

    async startGame() {
        console.log('startGame called');
        try {
            const granted = await this.inputManager.requestPermission();
            console.log('Permission:', granted);
            
            if (granted) {
                this.inputManager.startListening();
            } else {
                this.inputManager.startFallbackInput();
            }
        } catch (error) {
            console.error('Permission error:', error);
            this.inputManager.startFallbackInput();
        }
        
        this.currentLevel = 1;
        this.startLevel();
    }

    startLevel() {
        console.log('startLevel:', this.currentLevel);
        
        this.gameState = 'playing';
        this.setupCanvas();
        
        console.log('Generating maze...');
        console.log('Canvas size:', this.canvasWidth, 'x', this.canvasHeight);
        
        try {
            this.mazeData = this.mazeGenerator.generate(
                this.currentLevel, 
                Math.max(200, this.canvasWidth), 
                Math.max(200, this.canvasHeight)
            );
            
            console.log('Maze generated:', this.mazeData.width, 'x', this.mazeData.height);
            console.log('Cell size:', this.mazeData.cellSize);
        } catch (e) {
            console.error('Maze generation failed:', e);
            this.showMessage('迷宫生成失败: ' + e.message);
            return;
        }
        
        this.calculateOffset();
        
        const { start, cellSize } = this.mazeData;
        const startX = this.offsetX + start.x * cellSize + cellSize / 2;
        const startY = this.offsetY + start.y * cellSize + cellSize / 2;
        
        console.log('Ball position:', startX, startY);
        
        this.physics.init(startX, startY, cellSize);
        
        setTimeout(() => {
            this.physics.calibrate();
            console.log('Calibrated');
        }, 100);
        
        this.timeRemaining = this.getTimeForLevel(this.currentLevel);
        this.startTime = Date.now();
        this.elapsedTime = 0;
        
        document.getElementById('level-display').textContent = this.currentLevel;
        this.updateTimeDisplay();
        
        console.log('Showing game screen...');
        this.showScreen('game-screen');
        
        console.log('Starting timer and game loop...');
        this.startTimer();
        this.startGameLoop();
        
        console.log('Level started successfully!');
    }

    getTimeForLevel(level) {
        const baseTime = 45;
        const levelBonus = level * 15;
        const complexityFactor = 1 + (level - 1) * 0.3;
        return Math.floor((baseTime + levelBonus) * complexityFactor);
    }

    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            if (this.gameState === 'playing') {
                this.timeRemaining--;
                this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
                this.updateTimeDisplay();
                
                if (this.timeRemaining <= 0) {
                    this.timeUp();
                }
            }
        }, 1000);
    }

    updateTimeDisplay() {
        const display = document.getElementById('time-display');
        if (display) {
            display.textContent = this.timeRemaining;
            if (this.timeRemaining <= 10) {
                display.classList.add('warning');
            } else {
                display.classList.remove('warning');
            }
        }
    }

    timeUp() {
        this.gameState = 'ad-prompt';
        this.stopGameLoop();
        this.stopTimer();
        this.showScreen('ad-screen');
    }

    watchAd() {
        this.gameState = 'ad-playing';
        this.showScreen('ad-playing-screen');
        
        this.adCountdown = 10;
        this.updateAdDisplay();
        
        if (this.adInterval) clearInterval(this.adInterval);
        
        this.adInterval = setInterval(() => {
            this.adCountdown--;
            this.updateAdDisplay();
            
            if (this.adCountdown <= 0) {
                clearInterval(this.adInterval);
                this.adFinished();
            }
        }, 1000);
    }

    updateAdDisplay() {
        const countdownEl = document.getElementById('ad-countdown');
        if (countdownEl) countdownEl.textContent = this.adCountdown;
        
        const progressBar = document.getElementById('ad-progress-bar');
        if (progressBar) {
            progressBar.style.width = ((10 - this.adCountdown) / 10 * 100) + '%';
        }
    }

    adFinished() {
        this.timeRemaining = 15;
        this.gameState = 'playing';
        this.showScreen('game-screen');
        this.startTimer();
        this.startGameLoop();
        this.showMessage('+15秒！');
    }

    gameOver() {
        this.gameState = 'lost';
        this.stopGameLoop();
        this.stopTimer();
        this.showScreen('lose-screen');
    }

    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.stopGameLoop();
            this.stopTimer();
            this.showScreen('pause-screen');
        }
    }

    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.showScreen('game-screen');
            this.startTimer();
            this.startGameLoop();
        }
    }

    restartLevel() {
        this.stopGameLoop();
        this.stopTimer();
        this.startLevel();
    }

    quitToMenu() {
        this.gameState = 'menu';
        this.stopGameLoop();
        this.stopTimer();
        this.showScreen('start-screen');
    }

    nextLevel() {
        this.currentLevel++;
        this.startLevel();
    }

    checkWin() {
        if (this.physics.checkWin(this.getMazeDataWithOffset())) {
            this.gameState = 'won';
            this.stopGameLoop();
            this.stopTimer();
            
            const winInfo = document.getElementById('win-info');
            if (winInfo) winInfo.textContent = `用时: ${this.elapsedTime}秒`;
            
            this.showScreen('win-screen');
        }
    }

    getMazeDataWithOffset() {
        if (!this.mazeData) return null;
        
        return {
            ...this.mazeData,
            start: {
                x: this.mazeData.start.x * this.mazeData.cellSize + this.mazeData.cellSize / 2 + this.offsetX,
                y: this.mazeData.start.y * this.mazeData.cellSize + this.mazeData.cellSize / 2 + this.offsetY
            },
            end: {
                x: this.mazeData.end.x * this.mazeData.cellSize + this.mazeData.cellSize / 2 + this.offsetX,
                y: this.mazeData.end.y * this.mazeData.cellSize + this.mazeData.cellSize / 2 + this.offsetY
            }
        };
    }

    startGameLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }

    stopGameLoop() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;
        
        if (this.gameState === 'playing') {
            const mazeWithOffset = this.getMazeDataWithOffset();
            this.physics.update(mazeWithOffset, deltaTime);
            this.checkWin();
        }
        
        this.render();
        
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    render() {
        if (!this.ctx) return;
        
        this.ctx.fillStyle = '#0f0f1e';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        if (this.mazeData && this.gameState !== 'menu') {
            this.mazeGenerator.render(this.ctx, this.mazeData, this.offsetX, this.offsetY);
            this.physics.render(this.ctx, 0, 0);
        }
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.modal-screen');
        const topBar = document.getElementById('top-bar');
        
        screens.forEach(screen => {
            if (screen.id === screenId) {
                screen.classList.remove('hidden');
            } else {
                screen.classList.add('hidden');
            }
        });
        
        if (screenId === 'game-screen') {
            if (topBar) topBar.classList.remove('hidden');
        } else {
            if (topBar) topBar.classList.add('hidden');
        }
        
        console.log('Show screen:', screenId);
    }

    showMessage(msg) {
        const msgEl = document.createElement('div');
        msgEl.textContent = msg;
        msgEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            z-index: 2000;
            font-size: 16px;
        `;
        document.body.appendChild(msgEl);
        
        setTimeout(() => {
            if (msgEl.parentNode) {
                document.body.removeChild(msgEl);
            }
        }, 2000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

window.addEventListener('load', () => {
    console.log('Window loaded');
    window.game = new Game();
});
