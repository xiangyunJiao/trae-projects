<template>
  <div class="config-page">
    <div class="page-header">
      <h1>活动配置</h1>
    </div>
    
    <div class="form-container">
      <div class="form-group">
        <label>活动标题</label>
        <input
          type="text"
          v-model="config.title"
          class="form-input"
          placeholder="请输入活动标题"
        />
      </div>
      
      <div class="form-group">
        <label>头图图片 URL (750*1000px)</label>
        <input
          type="text"
          v-model="config.headerImage"
          class="form-input"
          placeholder="请输入头图图片URL"
        />
        <img v-if="config.headerImage" :src="config.headerImage" class="preview-image" />
      </div>
      
      <div class="form-group">
        <label>规则文案</label>
        <textarea
          v-model="config.ruleContent"
          class="form-textarea"
          rows="6"
          placeholder="请输入规则文案，支持换行"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label>奖励按钮跳转地址</label>
        <input
          type="text"
          v-model="config.rewardUrl"
          class="form-input"
          placeholder="请输入奖励页面URL"
        />
      </div>
      
      <div class="form-group">
        <label>玩法组合</label>
        <div class="checkbox-group">
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="config.enableLottery"
            />
            <span>抽奖</span>
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="config.enableRanking"
            />
            <span>榜单</span>
          </label>
        </div>
      </div>
      
      <div class="form-group">
        <label>榜单类型</label>
        <div class="radio-group">
          <label class="radio-item">
            <input
              type="radio"
              :value="'receive'"
              v-model="config.rankingType"
            />
            <span>收礼榜</span>
          </label>
          <label class="radio-item">
            <input
              type="radio"
              :value="'send'"
              v-model="config.rankingType"
            />
            <span>送礼榜</span>
          </label>
        </div>
      </div>
      
      <div class="form-group">
        <label>玩法按钮配置</label>
        <div class="button-config">
          <div
            v-for="(btn, index) in config.playButtons"
            :key="btn.id"
            class="button-item"
          >
            <input
              type="text"
              v-model="btn.name"
              class="form-input small"
              placeholder="按钮名称"
            />
            <select v-model="btn.type" class="form-select">
              <option value="lottery">抽奖</option>
              <option value="ranking">榜单</option>
            </select>
            <button
              v-if="config.playButtons.length > 1"
              class="remove-btn"
              @click="removeButton(index)"
            >删除</button>
          </div>
          <button class="add-btn" @click="addButton">+ 添加按钮</button>
        </div>
      </div>
      
      <button class="submit-btn" @click="saveConfig">保存配置</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/api'
import { ActivityConfig, PlayButton } from '@/types'

export default Vue.extend({
  name: 'AdminConfig',
  data() {
    return {
      config: {} as ActivityConfig
    }
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    async loadConfig() {
      this.config = await api.getActivityConfig()
    },
    addButton() {
      if (!this.config.playButtons) {
        this.config.playButtons = []
      }
      const newId = this.config.playButtons.length > 0 
        ? Math.max(...this.config.playButtons.map(b => b.id)) + 1 
        : 1
      this.config.playButtons.push({
        id: newId,
        name: '新按钮',
        type: 'lottery'
      })
    },
    removeButton(index: number) {
      this.config.playButtons.splice(index, 1)
    },
    async saveConfig() {
      await api.updateActivityConfig(this.config)
      alert('配置保存成功！')
    }
  }
})
</script>

<style lang="scss" scoped>
.config-page {
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

.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s;
}

.form-textarea:focus {
  outline: none;
  border-color: #3498db;
}

.preview-image {
  display: block;
  max-width: 200px;
  margin-top: 10px;
  border-radius: 8px;
}

.checkbox-group,
.radio-group {
  display: flex;
  gap: 20px;
}

.checkbox-item,
.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-item input,
.radio-item input {
  width: 18px;
  height: 18px;
}

.button-config {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.button-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-input.small {
  width: 200px;
}

.form-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.remove-btn {
  padding: 10px 15px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
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