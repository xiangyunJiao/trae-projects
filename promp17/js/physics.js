class PhysicsEngine {
    constructor() {
        this.gravity = { x: 0, y: 0 };
        this.friction = 0.985;
        this.maxSpeed = 12;
        this.accelerationMultiplier = 0.25;
        this.smoothing = 0.4;
        
        this.ball = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 10
        };
        
        this.calibration = { x: 0, y: 0 };
        this.isCalibrated = false;
        
        this.deviceOrientation = { beta: 0, gamma: 0 };
        this.mazeHelper = new MazeGenerator();
    }

    init(startX, startY, cellSize) {
        this.ball.x = startX;
        this.ball.y = startY;
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.ball.radius = Math.max(6, cellSize * 0.25);
        this.gravity = { x: 0, y: 0 };
    }

    calibrate() {
        this.calibration.x = this.deviceOrientation.gamma;
        this.calibration.y = this.deviceOrientation.beta;
        this.isCalibrated = true;
    }

    setDeviceOrientation(beta, gamma) {
        this.deviceOrientation.beta = beta;
        this.deviceOrientation.gamma = gamma;
    }

    updateGravity() {
        let gamma = this.deviceOrientation.gamma - this.calibration.x;
        let beta = this.deviceOrientation.beta - this.calibration.y;
        
        gamma = Math.max(-45, Math.min(45, gamma));
        beta = Math.max(-45, Math.min(45, beta));
        
        const targetGravityX = (gamma / 45) * this.accelerationMultiplier;
        const targetGravityY = (beta / 45) * this.accelerationMultiplier;
        
        this.gravity.x += (targetGravityX - this.gravity.x) * this.smoothing;
        this.gravity.y += (targetGravityY - this.gravity.y) * this.smoothing;
    }

    update(mazeData, deltaTime) {
        if (!mazeData) return;
        
        this.updateGravity();
        
        this.ball.vx += this.gravity.x;
        this.ball.vy += this.gravity.y;
        
        this.ball.vx *= this.friction;
        this.ball.vy *= this.friction;
        
        const speed = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
        if (speed > this.maxSpeed) {
            this.ball.vx = (this.ball.vx / speed) * this.maxSpeed;
            this.ball.vy = (this.ball.vy / speed) * this.maxSpeed;
        }
        
        const minStepSize = this.ball.radius * 0.25;
        const totalDistance = Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy);
        let subSteps = 1;
        if (totalDistance > minStepSize) {
            subSteps = Math.max(1, Math.ceil(totalDistance / minStepSize));
            subSteps = Math.min(subSteps, 15);
        }
        
        const stepVx = this.ball.vx / subSteps;
        const stepVy = this.ball.vy / subSteps;
        
        for (let i = 0; i < subSteps; i++) {
            const prevX = this.ball.x;
            const prevY = this.ball.y;
            
            const testX = this.ball.x + stepVx;
            const testY = this.ball.y + stepVy;
            
            const willCollide = this.mazeHelper.checkWallCollision(mazeData, testX, testY, this.ball.radius);
            
            if (willCollide) {
                const sweepSteps = 5;
                let sweepX = prevX;
                let sweepY = prevY;
                let collided = false;
                
                for (let s = 1; s <= sweepSteps; s++) {
                    const t = s / sweepSteps;
                    const sweepTestX = prevX + stepVx * t;
                    const sweepTestY = prevY + stepVy * t;
                    
                    const sweepResult = this.mazeHelper.resolveCollision(mazeData, sweepTestX, sweepTestY, this.ball.radius);
                    
                    if (sweepResult.collided) {
                        sweepX = sweepResult.x;
                        sweepY = sweepResult.y;
                        collided = true;
                        
                        const pushMag = Math.sqrt(sweepResult.pushX * sweepResult.pushX + sweepResult.pushY * sweepResult.pushY);
                        if (pushMag > 0.001) {
                            const nx = sweepResult.pushX / pushMag;
                            const ny = sweepResult.pushY / pushMag;
                            
                            const dot = this.ball.vx * nx + this.ball.vy * ny;
                            if (dot < 0) {
                                const bounce = 0.15;
                                const friction = 0.95;
                                
                                const tangentX = -ny;
                                const tangentY = nx;
                                const tangentDot = this.ball.vx * tangentX + this.ball.vy * tangentY;
                                
                                this.ball.vx = tangentX * tangentDot * friction - nx * dot * bounce;
                                this.ball.vy = tangentY * tangentDot * friction - ny * dot * bounce;
                            }
                        }
                        break;
                    } else {
                        sweepX = sweepTestX;
                        sweepY = sweepTestY;
                    }
                }
                
                this.ball.x = sweepX;
                this.ball.y = sweepY;
            } else {
                this.ball.x = testX;
                this.ball.y = testY;
            }
        }
        
        const finalCheck = this.mazeHelper.resolveCollision(mazeData, this.ball.x, this.ball.y, this.ball.radius);
        if (finalCheck.collided) {
            this.ball.x = finalCheck.x;
            this.ball.y = finalCheck.y;
            
            const pushMag = Math.sqrt(finalCheck.pushX * finalCheck.pushX + finalCheck.pushY * finalCheck.pushY);
            if (pushMag > 0.001) {
                const nx = finalCheck.pushX / pushMag;
                const ny = finalCheck.pushY / pushMag;
                const dot = this.ball.vx * nx + this.ball.vy * ny;
                if (dot < 0) {
                    const bounce = 0.1;
                    this.ball.vx -= (1 + bounce) * dot * nx;
                    this.ball.vy -= (1 + bounce) * dot * ny;
                }
            }
        }
        
        const { cellSize, width, height } = mazeData;
        const wallThickness = Math.max(3, cellSize * 0.08);
        const boundary = this.ball.radius + wallThickness * 0.6;
        this.ball.x = Math.max(boundary, Math.min(width * cellSize - boundary, this.ball.x));
        this.ball.y = Math.max(boundary, Math.min(height * cellSize - boundary, this.ball.y));
    }

    render(ctx, offsetX, offsetY) {
        const x = this.ball.x + offsetX;
        const y = this.ball.y + offsetY;
        const r = this.ball.radius;
        
        const gradient = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, '#ff6b6b');
        gradient.addColorStop(1, '#c92a2a');
        
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
    }

    checkWin(mazeData) {
        const { end, cellSize } = mazeData;
        let endX, endY;
        
        if (typeof end.x === 'number' && end.x < 1000 && typeof mazeData.width === 'number' && end.x <= mazeData.width) {
            endX = end.x * cellSize + cellSize / 2;
            endY = end.y * cellSize + cellSize / 2;
        } else {
            endX = end.x;
            endY = end.y;
        }
        
        const dx = this.ball.x - endX;
        const dy = this.ball.y - endY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < cellSize * 0.35;
    }
}

class InputManager {
    constructor() {
        this.physics = null;
        this.isSupported = false;
        this.needsPermission = false;
        this.listenerAdded = false;
        this.fallbackAdded = false;
    }

    init(physics) {
        this.physics = physics;
        this.checkSupport();
    }

    checkSupport() {
        if (typeof DeviceOrientationEvent !== 'undefined') {
            this.isSupported = true;
            
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                this.needsPermission = true;
            }
        } else {
            console.warn('DeviceOrientationEvent not available');
            this.isSupported = false;
        }
    }

    async requestPermission() {
        if (this.needsPermission && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await DeviceOrientationEvent.requestPermission();
                return response === 'granted';
            } catch (error) {
                console.error('Permission request error:', error);
                return false;
            }
        }
        return true;
    }

    startListening() {
        if (!this.isSupported) {
            console.log('Device orientation not supported, using fallback');
            this.startFallbackInput();
            return;
        }
        
        if (!this.listenerAdded) {
            window.addEventListener('deviceorientation', (event) => {
                let beta = event.beta || 0;
                let gamma = event.gamma || 0;
                
                beta = Math.max(-90, Math.min(90, beta));
                gamma = Math.max(-90, Math.min(90, gamma));
                
                if (this.physics) {
                    this.physics.setDeviceOrientation(beta, gamma);
                }
            });
            this.listenerAdded = true;
            console.log('Device orientation listener added');
        }
        
        setTimeout(() => {
            if (this.physics) {
                const { beta, gamma } = this.physics.deviceOrientation;
                if (Math.abs(beta) < 0.01 && Math.abs(gamma) < 0.01) {
                    console.log('No orientation data received, using fallback');
                    this.startFallbackInput();
                }
            }
        }, 1500);
    }

    startFallbackInput() {
        if (this.fallbackAdded) return;
        this.fallbackAdded = true;
        
        console.log('Using keyboard/touch fallback controls');
        
        const keys = {
            ArrowUp: { beta: -25, gamma: 0 },
            ArrowDown: { beta: 25, gamma: 0 },
            ArrowLeft: { beta: 0, gamma: -25 },
            ArrowRight: { beta: 0, gamma: 25 },
            w: { beta: -25, gamma: 0 },
            s: { beta: 25, gamma: 0 },
            a: { beta: 0, gamma: -25 },
            d: { beta: 0, gamma: 25 }
        };
        
        window.addEventListener('keydown', (e) => {
            if (keys[e.key] && this.physics) {
                this.physics.setDeviceOrientation(keys[e.key].beta, keys[e.key].gamma);
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (keys[e.key] && this.physics) {
                this.physics.setDeviceOrientation(0, 0);
            }
        });
        
        this.setupTouchFallback();
    }

    setupTouchFallback() {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;
        
        let touchStartX = 0;
        let touchStartY = 0;
        
        canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;
            
            const gamma = Math.max(-30, Math.min(30, deltaX / 8));
            const beta = Math.max(-30, Math.min(30, deltaY / 8));
            
            if (this.physics) {
                this.physics.setDeviceOrientation(beta, gamma);
            }
        }, { passive: false });
        
        canvas.addEventListener('touchend', () => {
            if (this.physics) {
                this.physics.setDeviceOrientation(0, 0);
            }
        }, { passive: true });
    }
}
