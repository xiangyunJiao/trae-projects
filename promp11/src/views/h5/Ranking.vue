<template>
  <div class="ranking-page">
    <div class="back-btn" @click="goBack">← 返回</div>
    
    <div class="ranking-header">
      <h1 class="ranking-title">{{ rankingType === 'receive' ? '收礼榜' : '送礼榜' }}</h1>
    </div>
    
    <div class="top-three">
      <div class="second-place">
        <div class="medal silver">2</div>
        <img :src="rankingData[1]?.avatar" :alt="rankingData[1]?.nickname" class="avatar">
        <div class="nickname">{{ rankingData[1]?.nickname }}</div>
        <div class="value">{{ formatValue(rankingData[1]?.value) }}积分</div>
      </div>
      
      <div class="first-place">
        <div class="medal gold">1</div>
        <img :src="rankingData[0]?.avatar" :alt="rankingData[0]?.nickname" class="avatar">
        <div class="nickname">{{ rankingData[0]?.nickname }}</div>
        <div class="value">{{ formatValue(rankingData[0]?.value) }}积分</div>
      </div>
      
      <div class="third-place">
        <div class="medal bronze">3</div>
        <img :src="rankingData[2]?.avatar" :alt="rankingData[2]?.nickname" class="avatar">
        <div class="nickname">{{ rankingData[2]?.nickname }}</div>
        <div class="value">{{ formatValue(rankingData[2]?.value) }}积分</div>
      </div>
    </div>
    
    <div class="ranking-list">
      <div
        v-for="(item, index) in rankingData.slice(3)"
        :key="item.id"
        class="list-item"
      >
        <div class="rank">{{ index + 4 }}</div>
        <img :src="item.avatar" :alt="item.nickname" class="list-avatar">
        <div class="list-info">
          <div class="list-nickname">{{ item.nickname }}</div>
        </div>
        <div class="list-value">{{ formatValue(item.value) }}积分</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/api'
import { RankingItem, RankingType } from '@/types'

export default Vue.extend({
  name: 'RankingPage',
  data() {
    return {
      rankingData: [] as RankingItem[],
      rankingType: 'receive' as RankingType
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const config = await api.getActivityConfig()
      this.rankingType = config.rankingType
      this.rankingData = await api.getRankingData(this.rankingType)
    },
    goBack() {
      this.$router.push('/')
    },
    formatValue(value: number | undefined): string {
      if (!value) return '0'
      return value.toLocaleString()
    }
  }
})
</script>

<style lang="scss" scoped>
.ranking-page {
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

.ranking-header {
  text-align: center;
  margin: 20px 0;
}

.ranking-title {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 10px;
  padding: 20px 0;
}

.second-place,
.third-place {
  width: 28%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
}

.first-place {
  width: 35%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 30px;
}

.medal {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  position: relative;
  z-index: 1;
}

.medal.gold {
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  width: 50px;
  height: 50px;
  font-size: 24px;
}

.medal.silver {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
}

.medal.bronze {
  background: linear-gradient(135deg, #cd7f32, #b87333);
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.first-place .avatar {
  width: 90px;
  height: 90px;
  border-width: 4px;
}

.nickname {
  font-size: 14px;
  color: #fff;
  margin-top: 10px;
  text-align: center;
}

.value {
  font-size: 12px;
  color: #ffd700;
  margin-top: 5px;
}

.ranking-list {
  margin-top: 20px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
}

.rank {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

.list-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 15px;
}

.list-info {
  flex: 1;
  margin-left: 15px;
}

.list-nickname {
  font-size: 16px;
  color: #fff;
}

.list-value {
  font-size: 16px;
  color: #ffd700;
  font-weight: bold;
}
</style>