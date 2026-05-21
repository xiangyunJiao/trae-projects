<template>
  <div class="lottery-config-page">
    <div class="page-header">
      <h1>抽奖配置</h1>
    </div>
    
    <div class="form-container">
      <div class="form-group">
        <label>抽奖背景图片 URL (750*900px)</label>
        <input
          type="text"
          v-model="config.backgroundImage"
          class="form-input"
          placeholder="请输入背景图片URL"
        />
        <img v-if="config.backgroundImage" :src="config.backgroundImage" class="preview-image" />
      </div>
      
      <div class="form-group">
        <label>格子默认背景图片 URL</label>
        <input
          type="text"
          v-model="config.cellDefaultImage"
          class="form-input"
          placeholder="请输入默认背景图片URL"
        />
        <img v-if="config.cellDefaultImage" :src="config.cellDefaultImage" class="preview-image small" />
      </div>
      
      <div class="form-group">
        <label>格子选中背景图片 URL</label>
        <input
          type="text"
          v-model="config.cellSelectedImage"
          class="form-input"
          placeholder="请输入选中背景图片URL"
        />
        <img v-if="config.cellSelectedImage" :src="config.cellSelectedImage" class="preview-image small" />
      </div>
      
      <div class="form-group">
        <label>抽奖按钮文案</label>
        <input
          type="text"
          v-model="config.buttonText"
          class="form-input"
          placeholder="请输入按钮文案"
        />
      </div>
      
      <div class="form-group">
        <label>抽奖次数配置</label>
        <div class="count-config">
          <div
            v-for="(count, index) in config.drawCounts"
            :key="index"
            class="count-item"
          >
            <input
              type="number"
              v-model.number="config.drawCounts[index]"
              class="form-input small"
              min="1"
            />
            <span>抽</span>
            <button
              v-if="config.drawCounts.length > 1"
              class="remove-btn"
              @click="removeCount(index)"
            >删除</button>
          </div>
          <button class="add-btn" @click="addCount">+ 添加次数</button>
        </div>
      </div>
      
      <div class="form-group">
        <label>奖品配置</label>
        <div class="prizes-config">
          <div
            v-for="(prize, index) in config.prizes"
            :key="prize.id"
            class="prize-item"
          >
            <div class="prize-header">奖品 {{ index + 1 }}</div>
            <div class="prize-fields">
              <input
                type="text"
                v-model="prize.name"
                class="form-input small"
                placeholder="奖品名称"
              />
              <input
                type="text"
                v-model="prize.image"
                class="form-input"
                placeholder="奖品图片URL"
              />
              <input
                type="number"
                v-model.number="prize.quantity"
                class="form-input small"
                placeholder="数量"
                min="0"
              />
              <input
                type="number"
                v-model.number="prize.probability"
                class="form-input small"
                placeholder="概率%"
                min="0"
                max="100"
              />
            </div>
            <button
              v-if="config.prizes.length > 1"
              class="remove-btn"
              @click="removePrize(index)"
            >删除奖品</button>
          </div>
          <button class="add-btn" @click="addPrize">+ 添加奖品</button>
        </div>
        <div class="probability-tip">
          总概率: {{ totalProbability }}%
          <span v-if="totalProbability !== 100" class="warning">（建议总和为100%）</span>
        </div>
      </div>
      
      <button class="submit-btn" @click="saveConfig">保存配置</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/api'
import { LotteryConfig, Prize } from '@/types'

export default Vue.extend({
  name: 'LotteryConfig',
  data() {
    return {
      config: {} as LotteryConfig
    }
  },
  computed: {
    totalProbability(): number {
      return this.config.prizes?.reduce((sum, p) => sum + (p.probability || 0), 0) || 0
    }
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    async loadConfig() {
      this.config = await api.getLotteryConfig()
    },
    addCount() {
      if (!this.config.drawCounts) {
        this.config.drawCounts = []
      }
      const newCount = this.config.drawCounts.length > 0 
        ? this.config.drawCounts[this.config.drawCounts.length - 1] + 10 
        : 1
      this.config.drawCounts.push(newCount)
    },
    removeCount(index: number) {
      this.config.drawCounts.splice(index, 1)
    },
    addPrize() {
      if (!this.config.prizes) {
        this.config.prizes = []
      }
      const newId = this.config.prizes.length > 0 
        ? Math.max(...this.config.prizes.map(p => p.id)) + 1 
        : 1
      this.config.prizes.push({
        id: newId,
        name: '新奖品',
        image: '',
        quantity: 100,
        probability: 10
      })
    },
    removePrize(index: number) {
      this.config.prizes.splice(index, 1)
    },
    async saveConfig() {
      await api.updateLotteryConfig(this.config)
      alert('配置保存成功！')
    }
  }
})
</script>

<style lang="scss" scoped>
.lottery-config-page {
  max-width: 1000px;
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

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.preview-image {
  display: block;
  max-width: 300px;
  margin-top: 10px;
  border-radius: 8px;
}

.preview-image.small {
  max-width: 100px;
}

.count-config {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.count-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-input.small {
  width: 100px;
}

.prizes-config {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.prize-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.prize-header {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.prize-fields {
  display: grid;
  grid-template-columns: 150px 1fr 100px 100px;
  gap: 10px;
  align-items: center;
}

.remove-btn {
  padding: 8px 12px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
}

.add-btn {
  padding: 12px 20px;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  align-self: flex-start;
}

.probability-tip {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.probability-tip .warning {
  color: #e74c3c;
  margin-left: 10px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}
</style>