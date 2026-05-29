<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { GameObject, SceneryItem, CollectedWord, GameStatus, WordItem } from '../types/game'
import { words, sceneryEmojis, otherCars } from '../data/words'
import { speakWord, speakLetter, stopSpeaking } from '../utils/speech'

const gameStatus = ref<GameStatus>('idle')
const carX = ref(50)
const lives = ref(3)
const timeLeft = ref(60)
const score = ref(0)
const collectedWords = ref<CollectedWord[]>([])
const gameObjects = ref<GameObject[]>([])
const sceneryItems = ref<SceneryItem[]>([])
const backgroundOffset = ref(0)
const wheelRotation = ref(0)
const adTimeLeft = ref(5)
const speed = ref(0.83)
const permissionGranted = ref(false)
const motionEnabled = ref(false)

const gameAreaRef = ref<HTMLDivElement | null>(null)

let animationId: number | null = null
let timerInterval: number | null = null
let lastObjectTime = 0
let lastSceneryTime = 0
let tiltX = 0
let savedGameState: {
  timeLeft: number
  score: number
  collectedWords: CollectedWord[]
} | null = null

const GAME_WIDTH = 375
const GAME_HEIGHT = 667
const ROAD_LEFT = 15
const ROAD_RIGHT = 85
const CAR_WIDTH = 12
const CAR_HEIGHT = 15

const generateId = () => Math.random().toString(36).substr(2, 9)

const getRandomWord = (): WordItem => {
  return words[Math.floor(Math.random() * words.length)]
}

const spawnObject = () => {
  const now = Date.now()
  if (now - lastObjectTime < 2000) return
  lastObjectTime = now

  const rand = Math.random()
  let type: GameObject['type']
  let emoji: string
  let word: WordItem | undefined

  if (rand < 0.55) {
    type = 'word'
    word = getRandomWord()
    emoji = word.emoji
  } else if (rand < 0.7) {
    type = 'obstacle'
    emoji = '📌'
  } else if (rand < 0.8) {
    type = 'lightning'
    emoji = '⚡'
  } else {
    type = 'car'
    emoji = otherCars[Math.floor(Math.random() * otherCars.length)]
  }

  const x = ROAD_LEFT + Math.random() * (ROAD_RIGHT - ROAD_LEFT - 10)

  gameObjects.value.push({
    id: generateId(),
    type,
    x,
    y: -10,
    word,
    emoji
  })
}

const spawnScenery = () => {
  const now = Date.now()
  if (now - lastSceneryTime < 800) return
  lastSceneryTime = now

  const side = Math.random() > 0.5 ? 'left' : 'right'
  const emoji = sceneryEmojis[Math.floor(Math.random() * sceneryEmojis.length)]
  const x = side === 'left' ? Math.random() * 10 : 90 + Math.random() * 10

  sceneryItems.value.push({
    id: generateId(),
    emoji,
    x,
    y: -10,
    side
  })
}

const checkCollision = (obj: GameObject): boolean => {
  const carLeft = carX.value - CAR_WIDTH / 2
  const carRight = carX.value + CAR_WIDTH / 2
  const carTop = 75
  const carBottom = 75 + CAR_HEIGHT

  const objLeft = obj.x
  const objRight = obj.x + 8
  const objTop = obj.y
  const objBottom = obj.y + 8

  return !(carRight < objLeft || carLeft > objRight || carBottom < objTop || carTop > objBottom)
}

const gameLoop = () => {
  if (gameStatus.value !== 'playing') return

  backgroundOffset.value = (backgroundOffset.value + speed.value) % 100
  wheelRotation.value = (wheelRotation.value + speed.value * 5) % 360

  carX.value += tiltX * 0.5
  carX.value = Math.max(ROAD_LEFT + CAR_WIDTH / 2, Math.min(ROAD_RIGHT - CAR_WIDTH / 2, carX.value))

  gameObjects.value = gameObjects.value.map(obj => ({
    ...obj,
    y: obj.y + speed.value * 0.8
  })).filter(obj => {
    if (obj.y > 100) return false

    if (checkCollision(obj)) {
      handleCollision(obj)
      return false
    }
    return true
  })

  sceneryItems.value = sceneryItems.value.map(item => ({
    ...item,
    y: item.y + speed.value * 0.8
  })).filter(item => item.y < 110)

  spawnObject()
  spawnScenery()

  animationId = requestAnimationFrame(gameLoop)
}

const handleCollision = async (obj: GameObject) => {
  switch (obj.type) {
    case 'word':
      if (obj.word) {
        collectedWords.value.push({
          word: obj.word,
          timestamp: Date.now()
        })
        score.value++
        if (obj.word.category === 'letter') {
          speakLetter(obj.word.english)
        } else {
          speakWord(obj.word.english, obj.word.chinese)
        }
      }
      break
    case 'obstacle':
      lives.value--
      if (lives.value <= 0) {
        endGame('gameover')
      }
      break
    case 'lightning':
      speed.value = Math.min(speed.value + 0.5, 3)
      setTimeout(() => {
        speed.value = Math.max(speed.value - 0.5, 0.83)
      }, 3000)
      break
    case 'car':
      lives.value--
      if (lives.value <= 0) {
        endGame('gameover')
      }
      break
  }
}

const startGame = (resume = false) => {
  gameStatus.value = 'playing'
  carX.value = 50
  gameObjects.value = []
  sceneryItems.value = []
  backgroundOffset.value = 0
  speed.value = 0.83
  lastObjectTime = 0
  lastSceneryTime = 0

  if (!resume) {
    lives.value = 3
    timeLeft.value = 60
    score.value = 0
    collectedWords.value = []
    savedGameState = null
  } else if (savedGameState) {
    lives.value = 3
    timeLeft.value = savedGameState.timeLeft
    score.value = savedGameState.score
    collectedWords.value = savedGameState.collectedWords
    savedGameState = null
  }

  timerInterval = window.setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame('finished')
    }
  }, 1000)

  gameLoop()
}

const endGame = (status: 'gameover' | 'finished') => {
  if (status === 'gameover') {
    savedGameState = {
      timeLeft: timeLeft.value,
      score: score.value,
      collectedWords: [...collectedWords.value]
    }
  }
  gameStatus.value = status
  stopSpeaking()
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const watchAd = () => {
  gameStatus.value = 'advertisement'
  adTimeLeft.value = 5

  const adTimer = setInterval(() => {
    adTimeLeft.value--
    if (adTimeLeft.value <= 0) {
      clearInterval(adTimer)
      startGame(true)
    }
  }, 1000)
}

const closeModal = () => {
  gameStatus.value = 'idle'
  savedGameState = null
}

const requestMotionPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const DeviceOrientationEventAny = DeviceOrientationEvent as any
    
    if (typeof DeviceOrientationEventAny.requestPermission === 'function') {
      DeviceOrientationEventAny.requestPermission()
        .then((permission: string) => {
          if (permission === 'granted') {
            permissionGranted.value = true
            motionEnabled.value = true
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch((err: any) => {
          console.log('Permission request failed:', err)
          resolve(false)
        })
    } else {
      permissionGranted.value = true
      motionEnabled.value = true
      resolve(true)
    }
  })
}

const handleStartClick = async () => {
  const granted = await requestMotionPermission()
  console.log('Motion permission:', granted ? 'granted' : 'denied')
  startGame()
}

const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
  if (event.gamma !== null) {
    const gamma = event.gamma
    if (gamma > 8) {
      tiltX = Math.min(gamma / 10, 2.5)
    } else if (gamma < -8) {
      tiltX = Math.max(gamma / 10, -2.5)
    } else {
      tiltX = 0
    }
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    tiltX = -3
  } else if (event.key === 'ArrowRight') {
    tiltX = 3
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    tiltX = 0
  }
}

onMounted(() => {
  window.addEventListener('deviceorientation', handleDeviceOrientation)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('deviceorientation', handleDeviceOrientation)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
  if (animationId) cancelAnimationFrame(animationId)
  if (timerInterval) clearInterval(timerInterval)
  stopSpeaking()
})

const uniqueCollectedWords = computed(() => {
  const seen = new Set<string>()
  return collectedWords.value.filter(item => {
    if (seen.has(item.word.id)) return false
    seen.add(item.word.id)
    return true
  })
})
</script>

<template>
  <div class="game-container" ref="gameAreaRef">
    <div class="game-area">
      <div class="sky"></div>

      <div class="road">
        <div class="road-marking" :style="{ transform: `translateY(${backgroundOffset}%)` }">
          <div v-for="i in 20" :key="i" class="marking-line"></div>
        </div>
      </div>

      <div class="scenery">
        <div
          v-for="item in sceneryItems"
          :key="item.id"
          class="scenery-item"
          :style="{ left: item.x + '%', top: item.y + '%' }"
        >
          {{ item.emoji }}
        </div>
      </div>

      <div class="game-objects">
        <div
          v-for="obj in gameObjects"
          :key="obj.id"
          class="game-object"
          :class="[obj.type]"
          :style="{ left: obj.x + '%', top: obj.y + '%' }"
        >
          {{ obj.emoji }}
        </div>
      </div>

      <div
        class="player-car"
        :style="{ left: carX + '%' }"
      >
        <div class="car-body">🚗</div>
        <div class="wheel wheel-left" :style="{ transform: `rotate(${wheelRotation}deg)` }">⚫</div>
        <div class="wheel wheel-right" :style="{ transform: `rotate(${wheelRotation}deg)` }">⚫</div>
      </div>

      <div v-if="gameStatus === 'playing'" class="hud">
        <div class="hud-item lives">
          <span v-for="i in lives" :key="i">❤️</span>
          <span v-for="i in (3 - lives)" :key="'empty-' + i">🖤</span>
        </div>
        <div class="hud-item timer">⏱️ {{ timeLeft }}s</div>
        <div class="hud-item score">🏆 {{ score }}</div>
      </div>

      <div v-if="gameStatus === 'idle'" class="start-screen">
        <h1>🚗 单词旅行</h1>
        <p>左右晃动手机控制汽车<br>收集物品学习英语单词！</p>
        <button class="start-btn" @click="handleStartClick">开始游戏</button>
      </div>

      <div v-if="gameStatus === 'gameover'" class="modal-overlay">
        <div class="modal">
          <h2>💥 游戏结束</h2>
          <p>你的汽车撞到太多障碍物了！</p>
          <p class="score-display">得分: {{ score }}</p>
          <div class="modal-buttons">
            <button class="ad-btn" @click="watchAd">📺 看广告继续</button>
            <button class="close-btn" @click="closeModal">返回首页</button>
          </div>
        </div>
      </div>

      <div v-if="gameStatus === 'finished'" class="modal-overlay">
        <div class="modal result-modal">
          <h2>🎉 恭喜完成！</h2>
          <p>旅游过程中学到以下单词：</p>
          <div class="collected-words">
            <div
              v-for="item in uniqueCollectedWords"
              :key="item.word.id"
              class="word-card"
              @click="item.word.category === 'letter' ? speakLetter(item.word.english) : speakWord(item.word.english, item.word.chinese)"
            >
              <span class="word-emoji">{{ item.word.emoji }}</span>
              <span class="word-text">{{ item.word.english }}</span>
              <span v-if="item.word.chinese" class="word-chinese">{{ item.word.chinese }}</span>
            </div>
          </div>
          <p v-if="uniqueCollectedWords.length === 0" class="empty-text">还没有收集到单词哦～</p>
          <p class="final-score">总得分: {{ score }}</p>
          <button class="close-btn" @click="closeModal">返回首页</button>
        </div>
      </div>

      <div v-if="gameStatus === 'advertisement'" class="modal-overlay">
        <div class="modal ad-modal">
          <h2>📺 广告时间</h2>
          <div class="ad-content">
            <div class="ad-placeholder">广告播放中...</div>
            <div class="ad-timer">{{ adTimeLeft }}s 后继续游戏</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1a1a2e;
  overflow: hidden;
}

.game-area {
  position: relative;
  width: 375px;
  height: 667px;
  background: linear-gradient(180deg, #87CEEB 0%, #98D8C8 50%, #7CB342 100%);
  overflow: hidden;
  border-radius: 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%);
}

.road {
  position: absolute;
  left: 15%;
  right: 15%;
  top: 0;
  bottom: 0;
  background: #555;
  overflow: hidden;
}

.road-marking {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 200%;
}

.marking-line {
  width: 4px;
  height: 30px;
  background: #fff;
  margin: 20px 0;
}

.scenery {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.scenery-item {
  position: absolute;
  font-size: 32px;
  transform: translateX(-50%);
}

.game-objects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.game-object {
  position: absolute;
  font-size: 36px;
  transform: translateX(-50%);
  transition: none;
}

.game-object.obstacle {
  animation: pulse 0.5s ease-in-out infinite;
}

.game-object.lightning {
  animation: glow 0.3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
}

@keyframes glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.5); }
}

.player-car {
  position: absolute;
  bottom: 10%;
  transform: translateX(-50%);
  font-size: 48px;
  z-index: 10;
  transition: left 0.1s ease-out;
}

.car-body {
  position: relative;
  z-index: 2;
}

.wheel {
  position: absolute;
  font-size: 14px;
  bottom: 5px;
}

.wheel-left {
  left: 5px;
}

.wheel-right {
  right: 5px;
}

.hud {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  z-index: 20;
}

.hud-item {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.start-screen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 30;
}

.start-screen h1 {
  color: white;
  font-size: 36px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.start-screen p {
  color: white;
  text-align: center;
  margin-bottom: 40px;
  font-size: 16px;
  line-height: 1.8;
}

.start-btn {
  background: #FFD700;
  color: #333;
  border: none;
  padding: 16px 48px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  max-width: 320px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal h2 {
  margin-bottom: 15px;
  color: #333;
}

.modal p {
  color: #666;
  margin-bottom: 15px;
}

.score-display {
  font-size: 24px;
  font-weight: bold;
  color: #FFD700;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.ad-btn, .close-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.ad-btn {
  background: #4CAF50;
  color: white;
}

.close-btn {
  background: #f0f0f0;
  color: #333;
}

.ad-btn:hover, .close-btn:hover {
  transform: scale(1.05);
}

.result-modal .collected-words {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
  max-height: 300px;
  overflow-y: auto;
}

.word-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.word-card:hover {
  transform: scale(1.05);
}

.word-emoji {
  font-size: 28px;
  display: block;
}

.word-text {
  color: white;
  font-size: 12px;
  font-weight: bold;
  display: block;
  margin-top: 5px;
}

.word-chinese {
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  display: block;
}

.empty-text {
  color: #999;
  font-style: italic;
  padding: 20px;
}

.final-score {
  font-size: 20px;
  font-weight: bold;
  color: #FFD700;
  margin-top: 15px;
}

.ad-modal .ad-content {
  padding: 30px 0;
}

.ad-placeholder {
  background: #f0f0f0;
  padding: 40px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #999;
}

.ad-timer {
  font-size: 18px;
  color: #666;
}

@media (max-width: 375px) {
  .game-area {
    width: 100%;
    height: 100vh;
  }
}
</style>
