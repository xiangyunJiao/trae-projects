<template>
  <div class="gift-config-page">
    <div class="page-header">
      <h1>礼物配置</h1>
    </div>
    
    <div class="form-container">
      <div class="gifts-list">
        <div
          v-for="(gift, index) in gifts"
          :key="gift.id"
          class="gift-item"
        >
          <div class="gift-header">礼物 {{ index + 1 }}</div>
          <div class="gift-fields">
            <input
              type="text"
              v-model="gift.name"
              class="form-input small"
              placeholder="礼物名称"
            />
            <input
              type="text"
              v-model="gift.image"
              class="form-input"
              placeholder="礼物图片URL"
            />
            <input
              type="number"
              v-model.number="gift.points"
              class="form-input small"
              placeholder="积分"
              min="1"
            />
          </div>
          <button
            v-if="gifts.length > 1"
            class="remove-btn"
            @click="removeGift(index)"
          >删除礼物</button>
        </div>
      </div>
      
      <button class="add-btn" @click="addGift">+ 添加礼物</button>
      
      <button class="submit-btn" @click="saveConfig">保存配置</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/api'
import { Gift } from '@/types'

export default Vue.extend({
  name: 'GiftConfig',
  data() {
    return {
      gifts: [] as Gift[]
    }
  },
  mounted() {
    this.loadGifts()
  },
  methods: {
    async loadGifts() {
      this.gifts = await api.getGifts()
    },
    addGift() {
      const newId = this.gifts.length > 0 
        ? Math.max(...this.gifts.map(g => g.id)) + 1 
        : 1
      this.gifts.push({
        id: newId,
        name: '新礼物',
        image: '',
        points: 100
      })
    },
    removeGift(index: number) {
      this.gifts.splice(index, 1)
    },
    async saveConfig() {
      await api.updateGifts(this.gifts)
      alert('配置保存成功！')
    }
  }
})
</script>

<style lang="scss" scoped>
.gift-config-page {
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

.gifts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.gift-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.gift-header {
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.gift-fields {
  display: grid;
  grid-template-columns: 150px 1fr 100px;
  gap: 10px;
  align-items: center;
}

.form-input {
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

.form-input.small {
  width: 150px;
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
  margin-top: 15px;
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