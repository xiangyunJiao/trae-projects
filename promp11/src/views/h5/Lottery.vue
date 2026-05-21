<template>
  <div class="lottery-page">
    <div class="back-btn" @click="goBack">← 返回</div>
    
    <div class="lottery-container">
      <div class="lottery-bg">
        <img :src="lotteryConfig.backgroundImage" alt="抽奖背景" class="bg-image">
        
        <div class="lottery-grid">
          <div
            v-for="(prize, index) in lotteryConfig.prizes"
            :key="prize.id"
            :class="['lottery-cell', { active: currentIndex === index, selected: resultIndex === index }]"
            :style="getCellStyle(index)"
          >
            <img :src="prize.image" :alt="prize.name" class="prize-image">
            <div class="prize-name">{{ prize.name }}</div>
          </div>
        </div>
      </div>
      
      <div class="draw-controls">
        <div class="count-buttons">
          <button
            v-for="count in lotteryConfig.drawCounts"
            :key="count"
            :class="['count-btn', { active: drawCount === count }]"
            @click="drawCount = count"
          >
            {{ count }}抽
          </button>
        </div>
        
        <button
          class="draw-btn"
          :disabled="isDrawing"
          @click="startDraw"
        >
          {{ isDrawing ? '抽奖中...' : lotteryConfig.buttonText }}
        </button>
      </div>
    </div>

    <div v-if="showResult" class="result-modal" @click="showResult = false">
      <div class="result-content" @click.stop>
        <div class="result-header">抽奖结果</div>
        <div class="result-list">
          <div
            v-for="(item, index) in aggregatedResults"
            :key="index"
            class="result-item"
          >
            <img :src="item.prize.image" :alt="item.prize.name" class="result-image">
            <div class="result-info">
              <div class="result-name">{{ item.prize.name }}</div>
              <div class="result-count">x{{ item.count }}</div>
            </div>
          </div>
        </div>
        <button class="result-close" @click="showResult = false">确定</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/api'
import { LotteryConfig, Prize, LotteryResult } from '@/types'

export default Vue.extend({
  name: 'LotteryPage',
  data() {
    return {
      lotteryConfig: {} as LotteryConfig,
      drawCount: 1,
      isDrawing: false,
      currentIndex: -1,
      resultIndex: -1,
      showResult: false,
      results: [] as Prize[]
    }
  },
  computed: {
    aggregatedResults(): LotteryResult[] {
      const map = new Map<number, LotteryResult>()
      
      this.results.forEach(prize => {
        const existing = map.get(prize.id)
        if (existing) {
          existing.count++
        } else {
          map.set(prize.id, { prize, count: 1 })
        }
      })
      
      return Array.from(map.values())
    }
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    async loadConfig() {
      this.lotteryConfig = await api.getLotteryConfig()
      this.drawCount = this.lotteryConfig.drawCounts[0] || 1
    },
    goBack() {
      this.$router.push('/')
    },
    getCellStyle(index: number): Record<string, string> {
      const positions = [
        { top: '0', left: '0' },
        { top: '0', left: '33.33%' },
        { top: '0', left: '66.66%' },
        { top: '33.33%', left: '0' },
        { top: '33.33%', left: '33.33%' },
        { top: '33.33%', left: '66.66%' },
        { top: '66.66%', left: '0' },
        { top: '66.66%', left: '33.33%' },
        { top: '66.66%', left: '66.66%' }
      ]
      
      const pos = positions[index]
      return {
        top: pos.top,
        left: pos.left
      }
    },
    async startDraw() {
      if (this.isDrawing) return
      
      this.isDrawing = true
      this.currentIndex = -1
      this.resultIndex = -1
      this.results = []
      
      const response = await api.drawLottery(this.drawCount)
      this.results = response
      
      await this.playAnimation()
      
      this.isDrawing = false
      this.showResult = true
    },
    async playAnimation(): Promise<void> {
      const totalRounds = 3
      const speed = 80
      const slowDownSpeed = 150
      
      const positions = [0, 1, 2, 5, 8, 7, 6, 3]
      
      let currentPos = 0
      let roundsCompleted = 0
      const finalPositions: number[] = this.results.map(r => 
        this.lotteryConfig.prizes.findIndex(p => p.id === r.id)
      )
      
      return new Promise(resolve => {
        const animate = () => {
          this.currentIndex = positions[currentPos]
          currentPos = (currentPos + 1) % positions.length
          
          if (currentPos === 0) {
            roundsCompleted++
          }
          
          if (roundsCompleted < totalRounds) {
            setTimeout(animate, speed)
          } else if (finalPositions.length > 0) {
            const finalPos = finalPositions.shift()!
            const steps = positions.indexOf(finalPos)
            let step = 0
            
            const slowAnimate = () => {
              if (step < steps) {
                this.currentIndex = positions[(currentPos + step) % positions.length]
                step++
                setTimeout(slowAnimate, slowDownSpeed)
              } else {
                this.currentIndex = finalPos
                this.resultIndex = finalPos
                
                if (finalPositions.length > 0) {
                  setTimeout(() => {
                    this.resultIndex = -1
                    animate()
                  }, 500)
                } else {
                  setTimeout(resolve, 500)
                }
              }
            }
            
            slowAnimate()
          } else {
            resolve()
          }
        }
        
        setTimeout(animate, speed)
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.lottery-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 20px;
}

.back-btn {
  color: #fff;
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
}

.lottery-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lottery-bg {
  position: relative;
  width: 100%;
  max-width: 400px;
  padding-top: 96%;
  border-radius: 15px;
  overflow: hidden;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lottery-grid {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  display: flex;
  flex-wrap: wrap;
}

.lottery-cell {
  position: absolute;
  width: 29%;
  height: 29%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.lottery-cell.active {
  background: rgba(255, 215, 0, 0.6);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}

.lottery-cell.selected {
  background: rgba(255, 100, 100, 0.8);
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(255, 100, 100, 1);
}

.prize-image {
  width: 60%;
  height: 60%;
  object-fit: cover;
  border-radius: 8px;
}

.prize-name {
  font-size: 10px;
  color: #fff;
  margin-top: 5px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 90%;
}

.draw-controls {
  width: 100%;
  max-width: 400px;
  margin-top: 30px;
}

.count-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.count-btn {
  padding: 10px 25px;
  border-radius: 20px;
  border: 2px solid #667eea;
  background: transparent;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.count-btn.active {
  background: #667eea;
  border-color: #667eea;
}

.draw-btn {
  width: 100%;
  padding: 20px;
  border-radius: 30px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.5);
  transition: transform 0.2s;
}

.draw-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.draw-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.result-content {
  width: 90%;
  max-width: 400px;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
}

.result-header {
  padding: 20px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.result-list {
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.result-item:last-child {
  border-bottom: none;
}

.result-image {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  object-fit: cover;
}

.result-info {
  margin-left: 15px;
}

.result-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.result-count {
  font-size: 14px;
  color: #ff6b6b;
  margin-top: 5px;
}

.result-close {
  width: 100%;
  padding: 15px;
  border: none;
  background: #667eea;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>