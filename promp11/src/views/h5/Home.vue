<template>
  <div class="h5-home">
    <div class="header-section">
      <img :src="config.headerImage" alt="活动头图" class="header-image">
      <div class="header-title">{{ config.title }}</div>
      <div class="header-buttons">
        <button class="btn rule-btn" @click="showRule = true">规则</button>
        <button class="btn reward-btn" @click="goToReward">奖励</button>
      </div>
    </div>

    <div class="gifts-section">
      <div class="gifts-container" ref="giftsContainer">
        <div class="gifts-scroll">
          <div
            v-for="gift in gifts"
            :key="gift.id"
            class="gift-item"
          >
            <img :src="gift.image" :alt="gift.name" class="gift-image">
            <div class="gift-name">{{ gift.name }}</div>
            <div class="gift-points">{{ gift.points }}积分</div>
          </div>
        </div>
      </div>
    </div>

    <div class="play-buttons-section">
      <button
        v-for="btn in displayButtons"
        :key="btn.id"
        class="play-btn"
        @click="goToPlay(btn.type)"
      >
        {{ btn.name }}
      </button>
    </div>

    <div v-if="showRule" class="modal-overlay" @click="showRule = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">活动规则</div>
        <div class="modal-body">{{ config.ruleContent }}</div>
        <button class="modal-close" @click="showRule = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/api'
import { ActivityConfig, Gift, PlayButton } from '@/types'

export default Vue.extend({
  name: 'H5Home',
  data() {
    return {
      config: {} as ActivityConfig,
      gifts: [] as Gift[],
      showRule: false
    }
  },
  computed: {
    displayButtons(): PlayButton[] {
      return this.config.playButtons?.filter(btn => {
        if (btn.type === 'lottery') return this.config.enableLottery
        if (btn.type === 'ranking') return this.config.enableRanking
        return true
      }) || []
    }
  },
  mounted() {
    this.loadData()
    this.startGiftScroll()
  },
  methods: {
    async loadData() {
      this.config = await api.getActivityConfig()
      this.gifts = await api.getGifts()
    },
    startGiftScroll() {
      const container = this.$refs.giftsContainer as HTMLElement
      if (!container) return
      
      const scroll = container.querySelector('.gifts-scroll') as HTMLElement
      if (!scroll) return
      
      const scrollWidth = scroll.scrollWidth
      const clientWidth = container.clientWidth
      
      if (scrollWidth <= clientWidth) return
      
      let position = 0
      const speed = 1
      
      const animate = () => {
        position -= speed
        if (Math.abs(position) >= scrollWidth - clientWidth) {
          position = 0
        }
        scroll.style.transform = `translateX(${position}px)`
        requestAnimationFrame(animate)
      }
      
      animate()
    },
    goToPlay(type: string) {
      if (type === 'lottery') {
        this.$router.push('/lottery')
      } else if (type === 'ranking') {
        this.$router.push('/ranking')
      }
    },
    goToReward() {
      window.open(this.config.rewardUrl, '_blank')
    }
  }
})
</script>

<style lang="scss" scoped>
.h5-home {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.header-section {
  position: relative;
  width: 100%;
  padding-top: 133.33%;
  background: #333;
}

.header-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-title {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.header-buttons {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.rule-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.reward-btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: #fff;
}

.gifts-section {
  width: 100%;
  padding: 20px 0;
  overflow: hidden;
}

.gifts-container {
  width: 100%;
  overflow: hidden;
}

.gifts-scroll {
  display: flex;
  gap: 15px;
  padding: 0 20px;
  white-space: nowrap;
}

.gift-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
}

.gift-image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
}

.gift-name {
  font-size: 12px;
  color: #fff;
  margin-top: 8px;
}

.gift-points {
  font-size: 11px;
  color: #ffd700;
  margin-top: 4px;
}

.play-buttons-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 30px 20px;
}

.play-btn {
  padding: 15px 40px;
  border-radius: 30px;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.play-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.modal-overlay {
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

.modal-content {
  width: 90%;
  max-width: 400px;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.modal-body {
  padding: 20px;
  font-size: 14px;
  color: #333;
  white-space: pre-wrap;
  line-height: 1.8;
}

.modal-close {
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