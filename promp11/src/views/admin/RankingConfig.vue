<template>
  <div class="ranking-config-page">
    <div class="page-header">
      <h1>榜单配置</h1>
    </div>
    
    <div class="form-container">
      <div class="form-group">
        <label>榜单类型</label>
        <div class="radio-group">
          <label class="radio-item">
            <input
              type="radio"
              :value="'receive'"
              v-model="rankingType"
            />
            <span>收礼榜</span>
          </label>
          <label class="radio-item">
            <input
              type="radio"
              :value="'send'"
              v-model="rankingType"
            />
            <span>送礼榜</span>
          </label>
        </div>
      </div>
      
      <div class="info-box">
        <h3>榜单数据说明</h3>
        <ul>
          <li>榜单数据由后端接口根据配置的类型获取</li>
          <li>收礼榜：展示参与活动中收礼最多的用户</li>
          <li>送礼榜：展示参与活动中送礼最多的用户</li>
          <li>榜单数据实时更新，无需手动配置</li>
        </ul>
      </div>
      
      <div class="form-group">
        <label>当前榜单预览</label>
        <div class="ranking-preview">
          <div
            v-for="(item, index) in rankingData"
            :key="item.id"
            class="preview-item"
          >
            <div class="rank">{{ index + 1 }}</div>
            <img :src="item.avatar" :alt="item.nickname" class="avatar" />
            <div class="info">
              <div class="nickname">{{ item.nickname }}</div>
              <div class="value">{{ item.value.toLocaleString() }}积分</div>
            </div>
          </div>
        </div>
      </div>
      
      <button class="refresh-btn" @click="refreshData">刷新数据</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/api'
import { RankingItem, RankingType } from '@/types'

export default Vue.extend({
  name: 'RankingConfig',
  data() {
    return {
      rankingType: 'receive' as RankingType,
      rankingData: [] as RankingItem[]
    }
  },
  mounted() {
    this.loadConfig()
    this.loadData()
  },
  methods: {
    async loadConfig() {
      const config = await api.getActivityConfig()
      this.rankingType = config.rankingType
    },
    async loadData() {
      this.rankingData = await api.getRankingData(this.rankingType)
    },
    async refreshData() {
      await this.loadData()
      alert('数据刷新成功！')
    }
  }
})
</script>

<style lang="scss" scoped>
.ranking-config-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.form-container {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.radio-item input {
  width: 18px;
  height: 18px;
}

.info-box {
  background: #e8f4f8;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.info-box h3 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 15px 0;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
}

.info-box li {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.info-box li:last-child {
  margin-bottom: 0;
}

.ranking-preview {
  max-height: 400px;
  overflow-y: auto;
}

.preview-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.preview-item:last-child {
  border-bottom: none;
}

.rank {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #3498db;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 15px;
}

.info {
  margin-left: 15px;
}

.nickname {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.value {
  font-size: 14px;
  color: #f39c12;
}

.refresh-btn {
  padding: 15px 30px;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>